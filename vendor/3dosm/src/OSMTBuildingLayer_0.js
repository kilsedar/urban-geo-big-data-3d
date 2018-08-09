/**
 * @exports OSMTBuildingLayer
 */
define(["vendor/3dosm/src/OSMBuildingLayer",
        "vendor/3dosm/src/GeoJSONParserTriangulationOSM",
        "vendor/3dosm/libraries/osmtogeojson-3.0.0"],
       function (OSMBuildingLayer, GeoJSONParserTriangulationOSM, osmtogeojson) {
  "use strict";

  /**
   * Creates a sublass of the {@link OSMBuildingLayer} class.
   * @alias OSMTBuildingLayer
   * @constructor
   * @classdesc Attempts to create tiles (sectors) using the bounding box of the layer with a fixed size for all the zoom levels. For each sector makes a new request to OSM if the sector is visible.
   * Upon gestures, adds and/or removes the [layers]{@link OSMBuildingLayer} corresponding to the sectors.
   * @param {Object} configuration Configuration is used to set the attributes of {@link ShapeAttributes}. Four more attributes can be defined, which are "extrude", "altitude", "altitudeMode" and "heatmap".
   * @param {Object} source Defines the data source of the layer.
   */
  var OSMTBuildingLayer = function (configuration, source) {
    OSMBuildingLayer.call(this, configuration, source);

    /**
     * Holds the {@link OSMBuildingLayer} for each sector.
     * @memberof OSMTBuildingLayer.prototype
     * @type {MemoryCache}
     */
    this._cache = new WorldWind.MemoryCache(100000, 80000);

    /**
     * An array holding both the sectors making up the layer's bounding box and their state of being added to the {@link WorldWindow} or not.
     * @memberof OSMTBuildingLayer.prototype
     * @type {Object[]}
     */
    this._sectors = [];
  };

  OSMTBuildingLayer.prototype = Object.create(OSMBuildingLayer.prototype);

  /**
   * The callback for [GestureRecognizers]{@link GestureRecognizer}, which are {@link DragRecognizer}, {@link PanRecognizer}, {@link ClickRecognizer}, {@link TapRecognizer}, {@link PinchRecognizer}, {@link RotationRecognizer} and {@link TiltRecognizer}.
   * For each sector of the layer, checks if it is visible. If it is and its layer is not added to the WorldWindow, checks the cache.
   * If the layer corresponding to the sector is in the cache uses the cache, otherwise makes a request to OSM. If it is not visible and it is added to the WorldWindow, removes it.
   */
  OSMTBuildingLayer.prototype.gestureRecognizerCallback = function(recognizer) {
    // console.log("sectors -> " + JSON.stringify(this._sectors));
    for (var sectorIndex = 0; sectorIndex < this._sectors.length; sectorIndex++) {
      if (this.intersectsVisible(this._sectors[sectorIndex].sector) && !this._sectors[sectorIndex].added) {
        console.log("The layer in this sector has to be added.");
        if (this._cache.entryForKey(this._sectors[sectorIndex].sector.minLatitude + "," + this._sectors[sectorIndex].sector.minLongitude + "," + this._sectors[sectorIndex].sector.maxLatitude + "," + this._sectors[sectorIndex].sector.maxLongitude) != null) {
          this.worldWindow.addLayer(this._cache.entryForKey(this._sectors[sectorIndex].sector.minLatitude + "," + this._sectors[sectorIndex].sector.minLongitude + "," + this._sectors[sectorIndex].sector.maxLatitude + "," + this._sectors[sectorIndex].sector.maxLongitude));
          this._sectors[sectorIndex].added = true;
        }
        else
          this.addBySector(this._sectors[sectorIndex]);
      }
      else if (!this.intersectsVisible(this._sectors[sectorIndex].sector) && this._sectors[sectorIndex].added) {
        console.log("The layer in this sector has to be removed.");
        this.worldWindow.removeLayer(this._cache.entryForKey(this._sectors[sectorIndex].sector.minLatitude + "," + this._sectors[sectorIndex].sector.minLongitude + "," + this._sectors[sectorIndex].sector.maxLatitude + "," + this._sectors[sectorIndex].sector.maxLongitude));
        this._sectors[sectorIndex].added = false;
      }
      else {
        console.log("No need to do something.");
      }
      // console.log("the number of layers -> " + this.worldWindow.layers.length);
    }
  };

  /**
   * Sectorizes a bounding box. Each sector initially will be 0.02 to 0.02 degrees for all the zoom levels.
   * @param {Float[]} boundingBox The bounding box to be sectorized. Intended to be the bounding box of the whole layer.
   */
  OSMTBuildingLayer.prototype.createSectors = function(boundingBox) {
    var sectorSize = 0.02;
    var decimalCount = 5; // Can be derived from the coordinates.
    var sectorsOnXCount = Math.ceil((boundingBox[2]-boundingBox[0]).toFixed(decimalCount)/sectorSize);
    var sectorsOnYCount = Math.ceil((boundingBox[3]-boundingBox[1]).toFixed(decimalCount)/sectorSize);

    for (var indexY = 0; indexY < sectorsOnYCount; indexY++) {
      for (var indexX = 0; indexX < sectorsOnXCount; indexX++) {
        var x1 = (boundingBox[0]+sectorSize*indexX).toFixed(decimalCount);

        if (indexX+1 == sectorsOnXCount)
          var x2 = boundingBox[2].toFixed(decimalCount);
        else
          var x2 = (boundingBox[0]+sectorSize*(indexX+1)).toFixed(decimalCount);

        var y1 = (boundingBox[1]+sectorSize*indexY).toFixed(decimalCount);

        if (indexY+1 == sectorsOnYCount)
          var y2 = boundingBox[3].toFixed(decimalCount);
        else
        var y2 = (boundingBox[1]+sectorSize*(indexY+1)).toFixed(decimalCount);

        this._sectors.push({sector: new WorldWind.Sector(y1, y2, x1, x2), added: false});
      }
    }
  };

  /**
   * Checks if a given sector is visible.
   * @param {Sector} sector A {@link Sector} of the layer.
   * @returns {boolean} True if the sector intersects the frustum, otherwise false.
   */
  OSMTBuildingLayer.prototype.intersectsVisible = function(sector) {
    var boundingBox = new WorldWind.BoundingBox();
    boundingBox.setToSector(sector, this.worldWindow.drawContext.globe, 0, 9); // Maximum elevation 9 should be changed.

    return boundingBox.intersectsFrustum(this.worldWindow.drawContext.navigatorState.frustumInModelCoordinates);
  };

  /**
   * Calls [createSectors]{@link OSMTBuildingLayer#createSectors} and [addBySector]{@link OSMTBuildingLayer#addBySector} if the "type" property of the "source" member variable is "boundingBox" and the "coordinates" property of the "source" member variable is defined.
   * Also registers the [GestureRecognizers]{@link GestureRecognizer}, which are {@link DragRecognizer}, {@link PanRecognizer}, {@link ClickRecognizer}, {@link TapRecognizer}, {@link PinchRecognizer}, {@link RotationRecognizer} and {@link TiltRecognizer}.
   * @throws {ArgumentError} If the source definition is wrong.
   */
  OSMTBuildingLayer.prototype.add = function (worldWindow) {
    this.worldWindow = worldWindow;
    if (this.source.type == "boundingBox" && this.source.coordinates) {
      this.createSectors(this.source.coordinates);
      for (var sectorIndex = 0; sectorIndex < this._sectors.length; sectorIndex++){
        if (this.intersectsVisible(this._sectors[sectorIndex].sector))
          this.addBySector(this._sectors[sectorIndex].sector);
      }

      var dragRecognizer = new WorldWind.DragRecognizer(this.worldWindow.canvas, this.gestureRecognizerCallback.bind(this)); // desktop
      var panRecognizer = new WorldWind.PanRecognizer(this.worldWindow.canvas, this.gestureRecognizerCallback.bind(this)); // mobile
      var clickRecognizer = new WorldWind.ClickRecognizer(this.worldWindow.canvas, this.gestureRecognizerCallback.bind(this)); // desktop
      var tapRecognizer = new WorldWind.TapRecognizer(this.worldWindow.canvas, this.gestureRecognizerCallback.bind(this)); // mobile
      var pinchRecognizer = new WorldWind.PinchRecognizer(this.worldWindow.canvas, this.gestureRecognizerCallback.bind(this)); // mobile
      var rotationRecognizer = new WorldWind.RotationRecognizer(this.worldWindow.canvas, this.gestureRecognizerCallback.bind(this)); // mobile
      var tiltRecognizer = new WorldWind.TiltRecognizer(this.worldWindow.canvas, this.gestureRecognizerCallback.bind(this)); // mobile
    }
    else {
      throw new WorldWind.ArgumentError(
        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "OSMTBuildingLayer", "add", "The source definition of the layer is wrong.")
      );
    }
  };

  /**
   * Makes an AJAX request to fetch the OSM building data using the sector's minimum and maximum latitude and longitude and Overpass API, converts it to GeoJSON using osmtogeojson API,
   * adds the GeoJSON to the {@link WorldWindow} using the {@link GeoJSONParserTriangulationOSM}.
   * Also caches the {@link OSMBuildingLayer} corresponding to the sector using as id the sector's minimum and maximum latitude and longitude.
   * @param {Sector} sector A {@link Sector} of the layer.
   */
  OSMTBuildingLayer.prototype.addBySector = function (sector) {

    var worldWindow = this.worldWindow;
    var _self = this;

    var data = "[out:json][timeout:25];(";
    for (var typeIndex = 0; typeIndex < this.type.length; typeIndex++) {
      data += this.type[typeIndex] + "[" + this.tag + "](" + sector.minLatitude + "," + sector.minLongitude + "," + sector.maxLatitude + "," + sector.maxLongitude + "); ";
    }
    data += "); out body; >; out skel qt;";

    $.ajax({
      url: "http://overpass-api.de/api/interpreter",
      data: data,
      type: "POST",
      success: function(dataOverpass) {
        var dataOverpassGeoJSON = osmtogeojson(dataOverpass);
        var dataOverpassGeoJSONString = JSON.stringify(dataOverpassGeoJSON);
        var OSMTBuildingLayer = new WorldWind.RenderableLayer("OSMTBuildingLayer");
        var OSMTBuildingLayerGeoJSON = new GeoJSONParserTriangulationOSM(dataOverpassGeoJSONString);
        OSMTBuildingLayerGeoJSON.load(null, _self.shapeConfigurationCallback.bind(_self), OSMTBuildingLayer);
        _self.worldWindow.addLayer(OSMTBuildingLayer);
        _self._cache.putEntry(sector.minLatitude + "," + sector.minLongitude + "," + sector.maxLatitude + "," + sector.maxLongitude, OSMTBuildingLayer, dataOverpassGeoJSON.features.length);
        // var sectorIndex = _self._sectors.findIndex(s => s.sector === sector);
        var sectorIndex = _self._sectors.map(function(obj, index) {
          if(obj.sector == sector)
            return index;
        }).filter(isFinite);
        _self._sectors[sectorIndex].added = true;
      },
      error: function(e) {
        throw new WorldWind.ArgumentError(
          WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "OSMTBuildingLayer", "addBySector", "Request failed. Error: " + JSON.stringify(e))
        );
      }
    });
  };

  return OSMTBuildingLayer;
});
