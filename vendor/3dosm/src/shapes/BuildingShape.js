/**
 * @exports BuildingShape
 */
define([], function () {
  "use strict";

  /**
   *
   * @alias BuildingShape
   * @constructor
   * @classdesc Sets the color and altitude of the BuildingShape, which can be either {@link Polygon} or {@link MultiPolygon}.
   * @param {Object} properties The properties related to the shape's geometry.
   */
   var BuildingShape = function (properties) {
     this._properties = properties;
     this._altitude = 9;
     this._color = null;
   };

   Object.defineProperties (BuildingShape.prototype, {
     /**
      * The properties related to the shape's geometry.
      * @memberof BuildingShape.prototype
      * @type {Object}
      * @readonly
      */
     properties: {
       get: function() {
         return this._properties;
       }
     },
     /**
      * The altitude of the shape.
      * @memberof BuildingShape.prototype
      * @type {Float}
      * @readonly
      */
     altitude: {
       get: function() {
         return this._altitude;
       }
     },
     /**
      * The color of the shape.
      * @memberof BuildingShape.prototype
      * @type {Color}
      * @readonly
      */
     color: {
       get: function() {
         return this._color;
       }
     }
   });

  /**
   * Colors the shape ({@link Polygon} or {@link MultiPolygon}) based on their altitude.
   * As the altitude increases the red component of the color increases.
   * The thresholds could be calculated automatically based on the data.
   * @param {Object} configuration Configuration is the object returned by [shapeConfigurationCallback]{@link OSMBuildingLayer#shapeConfigurationCallback}.
   */
  BuildingShape.prototype.setColor = function (configuration) {
    var numberOfThresholds = configuration.heatmap.thresholds.length;

    var heat = 1.0/(numberOfThresholds-2);

    for (var thresholdIndex = 0; thresholdIndex < numberOfThresholds-1; thresholdIndex++) {
      if (this._altitude > configuration.heatmap.thresholds[thresholdIndex] && this._altitude <= configuration.heatmap.thresholds[thresholdIndex+1]) {
        configuration.attributes.interiorColor = new WorldWind.Color(heat*thresholdIndex, configuration.attributes.interiorColor.green, configuration.attributes.interiorColor.blue, configuration.attributes.interiorColor.alpha);
        configuration.attributes.outlineColor = configuration.attributes.interiorColor; // Needed in case triangulation is not used.
        // console.log(heat*thresholdIndex);
      }
    }

    /* var heat = 0.5/(numberOfThresholds-2);

    if (configuration.attributes.interiorColor.red < 0.5) {
      for (var thresholdIndex = 0; thresholdIndex < numberOfThresholds-1; thresholdIndex++) {
        if (this._altitude > configuration.heatmap.thresholds[thresholdIndex] && this._altitude <= configuration.heatmap.thresholds[thresholdIndex+1]) {
          configuration.attributes.interiorColor = new WorldWind.Color(configuration.attributes.interiorColor.red+heat*thresholdIndex, configuration.attributes.interiorColor.green, configuration.attributes.interiorColor.blue, configuration.attributes.interiorColor.alpha);
          configuration.attributes.outlineColor = configuration.attributes.interiorColor; // Needed in case triangulation is not used.
          console.log(configuration.attributes.interiorColor);
        }
      }
    }
    else {
      for (var thresholdIndex = 0; thresholdIndex < numberOfThresholds-1; thresholdIndex++) {
        if (this._altitude > configuration.heatmap.thresholds[thresholdIndex] && this._altitude <= configuration.heatmap.thresholds[thresholdIndex+1])
          configuration.attributes.interiorColor = new WorldWind.Color(configuration.attributes.interiorColor.red-heat*(numberOfThresholds-thresholdIndex), configuration.attributes.interiorColor.green, configuration.attributes.interiorColor.blue, configuration.attributes.interiorColor.alpha);
          configuration.attributes.outlineColor = configuration.attributes.interiorColor; // Needed in case triangulation is not used.
      }
    } */
    this._color = configuration.attributes.interiorColor;
  };

  /**
   * Sets the altitude of the shape ({@link Polygon} or {@link MultiPolygon}).
   * For the {@link OSMBuildingLayer} if extrude is true, altitude is defined and altitude "type" is set to "number", altitude "value" is used. If altitude "value" is not set, 9 is used.
   * For the {@link OSMBuildingLayer} if extrude is true, altitude is defined and altitude "type" is set to "osm", if available the value of OSM "height" tag is used. If the "height" tag is not available an approximate height value is calculated using "building:levels" tag. Every level is considered to be 3 meters. If both are not available, 9 is used by default.
   * For the {@link OSMBuildingLayer} if extrude is true, altitude is defined and altitude "type" is set to "property", the value of the property defined in "value" is used. If value of the property is null, 9 is used.
   * For the {@link OSMBuildingLayer} if extrude is true and altitude is undefined, 9 is used by default.
   * For the {@link OSMBuildingLayer} if extrude is false, 0 is used.
   * @param {Object} configuration Configuration is the object returned by [shapeConfigurationCallback]{@link OSMBuildingLayer#shapeConfigurationCallback}.
   */
  BuildingShape.prototype.setAltitude = function (configuration) {
    var altitude;
    if (configuration.extrude && configuration.altitude && configuration.altitude.type == "number") {
      if (configuration.altitude.value)
        altitude = configuration.altitude.value;
      // Not necessary if the BuildingShape is one of OSMBuildingLayer.
      else
        altitude = 9;
    }
    else if (configuration.extrude && configuration.altitude && configuration.altitude.type == "osm") {
      if (this._properties && this._properties.height)
        altitude = this._properties.height;
      else if (this._properties && this._properties["building:levels"])
        altitude = this._properties["building:levels"]*3;
      else if (this._properties.tags && this._properties.tags.height)
        altitude = this._properties.tags.height;
      else if (this._properties.tags && this._properties.tags["building:levels"])
        altitude = this._properties.tags["building:levels"]*3;
      else if (this._properties && this._properties.building_l)
        altitude = this._properties.building_l*3;
      else if (this._properties.tags && this._properties.tags.building_l)
        altitude = this._properties.tags.building_l;
      else
        altitude = 9;
    }
    else if (configuration.extrude && configuration.altitude && configuration.altitude.type == "property") {
      if (configuration.altitude.value && this._properties[configuration.altitude.value] && this._properties[configuration.altitude.value] != 0)
        altitude = this._properties[configuration.altitude.value];
      else if (this._properties && this._properties.height)
        altitude = this._properties.height;
      else if (this._properties && this._properties["building:levels"])
        altitude = this._properties["building:levels"]*3;
      else if (this._properties.tags && this._properties.tags.height)
        altitude = this._properties.tags.height;
      else if (this._properties.tags && this._properties.tags["building:levels"])
        altitude = this._properties.tags["building:levels"]*3;
      else if (this._properties && this._properties.building_l)
        altitude = this._properties.building_l*3;
      else if (this._properties.tags && this._properties.tags.building_l)
        altitude = this._properties.tags.building_l;
      else
        altitude = 9;
    }
    else if (configuration.extrude)
      altitude = 9;
    else
      altitude = 0;

    // console.log("altitude --> " + altitude);

    this._altitude = altitude;
  };

  return BuildingShape;
});
