/**
 * @exports OSMLayer
 */
define(["vendor/3dosm/libraries/osmtogeojson-3.0.0"],
       function (osmtogeojson) {
  "use strict";

  /**
   * Constructs an OSMLayer.
   * @alias OSMLayer
   * @constructor
   * @classdesc Sets the properties and functions viable for any OSM data. It is intended to be an abstract class, only to be extended for specific OSM data.
   * @param {Object} configuration Configuration is used to set the attributes of {@link PlacemarkAttributes} or {@link ShapeAttributes}.
   * @param {Object} source Defines the data source of the layer. Its "type" can be either "boundingBox", "GeoJSONFile" or "GeoJSONData".
   * If the "type" is "boundingBox", "coordinates" must be defined. The order of the "coordinates" is "x1, y1, x2, y2".
   * If the "type" is "GeoJSONFile", "path" where the file resides must be defined.
   * If the "type" is "GeoJSONData", "data" itself must be defined.
   */
  var OSMLayer = function (configuration, source) {
    this._configuration = configuration;
    this.source = source;

    this._tag = null;
    this._type = [];
    this._worldWindow;
    this._data = {};
    this._dataSize = 0;
    this._boundingBox = null;
  };

  Object.defineProperties (OSMLayer.prototype, {
    /**
     * Configuration is used to set the attributes of {@link PlacemarkAttributes} if the geometry is Point or MultiPoint; or of {@link ShapeAttributes} otherwise.
     * @memberof OSMLayer.prototype
     * @type {Object}
     */
    configuration: {
      get: function() {
        return this._configuration;
      },
      set: function(configuration) {
        this._configuration = configuration;
      }
    },
    /**
     * The tag of the OSM data. Some examples are "amenity", "amenity=education"; "building", "building=farm" ...
     * @memberof OSMLayer.prototype
     * @type {String}
     */
    tag: {
      get: function() {
        return this._tag;
      },
      set: function(tag) {
        this._tag = tag;
      }
    },
    /**
     * A type can be "node", "way" or "relation". The variable can hold any number of the aforementioned types valid for the tag specified for the OSM data.
     * The tags and their types can be found at http://wiki.openstreetmap.org/wiki/Map_Features.
     * @memberof OSMLayer.prototype
     * @type {String[]}
     */
    type: {
      get: function() {
        return this._type;
      },
      set: function(type) {
        this._type = type;
      }
    },
    /**
     * The WorldWindow where the layer is added to.
     * @memberof OSMLayer.prototype
     * @type {WorldWindow}
     */
    worldWindow: {
      get: function() {
        return this._worldWindow;
      },
      set: function(worldWindow) {
        this._worldWindow = worldWindow;
      }
    },
    /**
     * The OSM data associated with the layer.
     * @memberof OSMLayer.prototype
     * @type Object
     */
    data: {
      get: function() {
        return this._data;
      },
      set: function(data) {
        this._data = data;
      }
    },
    /**
     * The size in bytes of the OSM data associated with the layer.
     * @memberof OSMLayer.prototype
     * @type Number
     */
    dataSize: {
      get: function() {
        return this._dataSize;
      },
      set: function(dataSize) {
        this._dataSize = dataSize;
      }
    },
    /**
     * It defines the bounding box of the OSM data for the layer. The order of coordinates of the bounding box is "x1, y1, x2, y2".
     * @memberof OSMLayer.prototype
     * @type {Float[]}
     */
    boundingBox: {
      get: function() {
        return this._boundingBox;
      },
      set: function(boundingBox) {
        this._boundingBox = boundingBox;
      }
    }
  });

  /**
   * Sets the attributes of {@link PlacemarkAttributes} if the geometry is Point or MultiPoint; or of {@link ShapeAttributes} otherwise.
   * @param {GeoJSONGeometry} geometry An object containing the geometry of the OSM data in GeoJSON format for the layer.
   * @returns {Object} An object with its attributes set as {@link PlacemarkAttributes} or {@link ShapeAttributes},
   * where for both their attributes are defined in the configuration of the layer.
   */
  OSMLayer.prototype.shapeConfigurationCallback = function (geometry) {
    var configuration = {};

    if (geometry.isPointType() || geometry.isMultiPointType()) {
      var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
      for (var key in this._configuration)
        placemarkAttributes[key] = this._configuration[key];
      configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
    }
    else {
      configuration.attributes =  new WorldWind.ShapeAttributes(null);
      for (var key in this._configuration)
        configuration.attributes[key] = this._configuration[key];
    }

    return configuration;
  };

  /**
   * Calculates the rough size of a given object.
   * @param {Object} object The object to be calculated the size of.
   * @returns {Number} The number of bytes of the object given.
   */
  OSMLayer.prototype.roughSizeOfObject = function(object) {
    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while (stack.length) {
      var value = stack.pop();

      if (typeof value === "boolean") {
        bytes += 4;
      }
      else if (typeof value === "string") {
        bytes += value.length * 2;
      }
      else if (typeof value === "number") {
        bytes += 8;
      }
      else if (typeof value === "object" && objectList.indexOf(value) === -1)
      {
        objectList.push(value);

        for(var i in value) {
          stack.push(value[i]);
        }
      }
    }
    return bytes;
  };

  /**
   * Calculates the bounding box of a GeoJSON object, where its features are expected to be of type "Polygon" or "MultiPolygon".
   * @param {Object} dataGeoJSON GeoJSON object of which the bounding box is calculated.
   * @returns {Float[]} The bounding box for the given GeoJSON data.
   */
  OSMLayer.prototype.calculateBoundingBox = function (dataGeoJSON) {
    var boundingBox = [Infinity, Infinity, -Infinity, -Infinity], polygons, coordinates, latitude, longitude;

    for (var featureIndex = 0; featureIndex < dataGeoJSON.features.length; featureIndex++) {
      if (dataGeoJSON.features[featureIndex].geometry.type == "Polygon" || dataGeoJSON.features[featureIndex].geometry.type == "MultiPolygon") {
        polygons = dataGeoJSON.features[featureIndex].geometry.coordinates;

        for (var polygonIndex = 0; polygonIndex < polygons.length; polygonIndex++) {
          for (var coordinatesIndex = 0; coordinatesIndex < polygons[polygonIndex].length; coordinatesIndex++) {
            longitude = polygons[polygonIndex][coordinatesIndex][0];
            latitude = polygons[polygonIndex][coordinatesIndex][1];
            boundingBox[0] = boundingBox[0] < longitude ? boundingBox[0] : longitude; // minimum longitude (x1)
            boundingBox[1] = boundingBox[1] < latitude ? boundingBox[1] : latitude; // minimum latitude (y1)
            boundingBox[2] = boundingBox[2] > longitude ? boundingBox[2] : longitude; // maximum longitude (x2)
            boundingBox[3] = boundingBox[3] > latitude ? boundingBox[3] : latitude; // maximum latitude (y2)
          }
        }
      }
    }

    return boundingBox;
  };

  /**
   * Calls [loadByBoundingBox]{@link OSMLayer#loadByBoundingBox} if the "type" property of the "source" member variable is "boundingBox" and the "coordinates" property of the "source" member variable is defined.
   * Calls [loadByGeoJSONFile]{@link OSMLayer#loadByGeoJSONFile} if the "type" property of the "source" member variable is "GeoJSONFile" and the "path" property of the "source" member variable is defined.
   * Calls [loadByGeoJSONData]{@link OSMLayer#loadByGeoJSONData} if the "type" property of the "source" member variable is "GeoJSONData" and the "data" property of the "source" member variable is defined.
   * @throws {ArgumentError} If the source definition is wrong.
   */
  OSMLayer.prototype.load = function () {
    if (this.source.type == "boundingBox" && this.source.coordinates)
      return this.loadByBoundingBox();
    else if (this.source.type == "GeoJSONFile" && this.source.path)
      return this.loadByGeoJSONFile();
    else if (this.source.type == "GeoJSONData" && this.source.data)
      return this.loadByGeoJSONData();
    else {
      throw new WorldWind.ArgumentError(
        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "OSMLayer", "load", "The source definition of the layer is wrong.")
      );
    }
  };

  /**
   * Makes an AJAX request to fetch the OSM building data using the "coordinates" property of the "source" member variable and Overpass API,
   * converts them to GeoJSON using osmtogeojson API, sets "data" and "dataSize" member variables using the GeoJSON data.
   * @throws {ArgumentError} If the "coordinates" property of the "source" member variable doesn't have four values.
   * @throws {ArgumentError} If the request to OSM fails.
   */
  OSMLayer.prototype.loadByBoundingBox = function () {
    if (this.source.coordinates.length != 4) {
      throw new WorldWind.ArgumentError(
        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "OSMLayer", "loadByBoundingBox", "The bounding box is invalid.")
      );
    }

    var _self = this;

    var data = "[out:json][timeout:25];(";
    for (var typeIndex = 0; typeIndex < this._type.length; typeIndex++) {
      // console.log(this._type[typeIndex]);
      data += this._type[typeIndex] + "[" + this._tag + "](" + this.source.coordinates[1] + "," + this.source.coordinates[0] + "," + this.source.coordinates[3] + "," + this.source.coordinates[2] + "); ";
    }
    data += "); out body; >; out skel qt;";
    console.log(data);

    return $.ajax({
      url: "http://overpass-api.de/api/interpreter",
      data: data,
      type: "POST",
      success: function(dataOverpass) {
        var dataOverpassGeoJSON = osmtogeojson(dataOverpass);
        _self._data = dataOverpassGeoJSON;
        if (_self._dataSize == 0)
          _self._dataSize = _self.roughSizeOfObject(_self._data);
      },
      error: function(e) {
        throw new WorldWind.ArgumentError(
          WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "OSMLayer", "loadByBoundingBox", "Request failed. Error: " + JSON.stringify(e))
        );
      }
    });
  };

  /**
   * Makes an AJAX request using the "path" property of the "source" member variable to fetch the GeoJSON file,
   * sets "data" and "dataSize" member variables using the GeoJSON data.
   * @throws {ArgumentError} If the data returned from the request is empty.
   * @throws {ArgumentError} If the request fails.
   */
  OSMLayer.prototype.loadByGeoJSONFile = function () {
    var _self = this;

    return $.ajax({
      beforeSend: function(xhr) {
        if(xhr.overrideMimeType)
          xhr.overrideMimeType("application/json");
      },
      dataType: "json",
      url: this.source.path,
      success: function(data) {
        if (data.length == 0) {
          throw new WorldWind.ArgumentError(
            WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "OSMLayer", "loadByGeoJSONFile", "File is empty.")
          );
        }
        _self._data = data;
        if (_self._dataSize == 0)
          _self._dataSize = _self.roughSizeOfObject(_self._data);
      },
      error: function(e) {
        throw new WorldWind.ArgumentError(
          WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "OSMLayer", "loadByGeoJSONFile", "Request failed. Error: " + JSON.stringify(e))
        );
      }
    });
  };

  /**
   * Sets "data" and "dataSize" member variables using the GeoJSON data assigned to the "data" property of the "source" member variable.
   */
  OSMLayer.prototype.loadByGeoJSONData = function () {
    this._data = this.source.data;
    if (this._dataSize == 0)
      this._dataSize = this.roughSizeOfObject(this._data);
  };

  /**
   * Sets the "worldWindow" member variable and adds the layer to the WorldWindow.
   * @param {WorldWindow} worldWindow The WorldWindow where the layer is added to.
   */
  OSMLayer.prototype.add = function (worldWindow) {
    this._worldWindow = worldWindow;
    var _self = this;
    $.when(_self.load()).then(function() {
      var OSMLayer = new WorldWind.RenderableLayer("OSMLayer");
      var OSMLayerGeoJSON = new WorldWind.GeoJSONParser(JSON.stringify(_self._data));
      OSMLayerGeoJSON.load(null, _self.shapeConfigurationCallback.bind(_self), OSMLayer);
      _self._worldWindow.addLayer(OSMLayer);
    });
  };

  /**
   * Zooms to the layer, by setting the center of the viewport to the center of the bounding box.
   * It uses an arbitrary value for the range of {@link LookAtNavigator}.
   * To be removed later.
   * @throws {ArgumentError} If boundingBox of the layer is null.
   */
  OSMLayer.prototype.zoom = function () {
    if (this._boundingBox != null) {
      var boundingBox = this._boundingBox;
      var centerX = (boundingBox[0] + boundingBox[2])/2;
      var centerY = (boundingBox[1] + boundingBox[3])/2;
      this._worldWindow.navigator.lookAtLocation.longitude = centerX;
      this._worldWindow.navigator.lookAtLocation.latitude = centerY;
      // console.log(centerX + ", " + centerY);
      this._worldWindow.navigator.range = 4e3; // Should be automatically calculated.
      this._worldWindow.redraw();
    }
    else {
      throw new WorldWind.ArgumentError(
        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "OSMLayer", "zoom", "The bounding box of the layer is null.")
      );
    }
  };

  return OSMLayer;
});
