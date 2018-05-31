/**
 * @exports GeoJSONParserOSM
 */
define(["vendor/3dosm/src/shapes/BuildingShape"],
       function (BuildingShape) {
  "use strict";

  /**
   * Creates a subclass of the {@link GeoJSONParser} class.
   * @alias GeoJSONParserOSM
   * @constructor
   * @classdesc Extrudes {@link GeoJSONGeometryPolygon}s and {@link GeoJSONGeometryMultiPolygon}s, and uses {@link ShapeAttributes} extended by "extrude", "altitude", "altitudeMode" and "heatmap" in the {@link OSMBuildingLayer}.
   * @param {String} dataSource The data source in GeoJSON format. Can be a string or a URL for the data.
   */
  var GeoJSONParserOSM = function (dataSource) {
    WorldWind.GeoJSONParser.call(this, dataSource);
  };

  GeoJSONParserOSM.prototype = Object.create(WorldWind.GeoJSONParser.prototype);

  /**
   * Adds an extruded {@link Polygon} if extrude is set to true, otherwise adds a {@link SurfacePolygon} for each ring in the {@link GeoJSONGeometryPolygon}.
   * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
   * @param {GeoJSONGeometryPolygon} geometry The Polygon geometry object.
   * @param {Object} properties The properties related to the Polygon geometry.
   * @throws {ArgumentError} If the specified layer is null or undefined.
   * @throws {ArgumentError} If the specified geometry is null or undefined.
   */
  GeoJSONParserOSM.prototype.addRenderablesForPolygon = function (layer, geometry, properties) {
    if (!layer) {
      throw new WorldWind.ArgumentError(
        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingLayer")
      );
    }

    if (!geometry) {
      throw new WorldWind.ArgumentError(
        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingGeometry")
      );
    }

    var configuration = this.shapeConfigurationCallback(geometry, properties);
    var boundaries = geometry.coordinates;
    var OSMBuildingPolygon = new BuildingShape(properties);
    OSMBuildingPolygon.setAltitude(configuration);
    var altitude = OSMBuildingPolygon.altitude;
    if (configuration.extrude && configuration.heatmap.enabled)
      OSMBuildingPolygon.setColor(configuration);

    if (!this.crs || this.crs.isCRSSupported()) {
      for (var boundaryIndex = 0; boundaryIndex < boundaries.length; boundaryIndex++) {
        var points = boundaries[boundaryIndex];
        var positions = [];

        for (var positionIndex = 0;  positionIndex < points.length; positionIndex++) {
          var longitude = points[positionIndex][0];
          var latitude = points[positionIndex][1];
          var reprojectedCoordinate = this.getReprojectedIfRequired(latitude, longitude, this.crs);
          var position = new WorldWind.Position(reprojectedCoordinate[1], reprojectedCoordinate[0], altitude);
          positions.push(position);
        }

        if (configuration.extrude) {
          var shape = new WorldWind.Polygon(positions, configuration && configuration.attributes ? configuration.attributes : null);
          shape.extrude = configuration.extrude;
        }
        else
          var shape = new WorldWind.SurfacePolygon(positions, configuration && configuration.attributes ? configuration.attributes : null);

        shape.altitudeMode = configuration.altitudeMode;
        if (configuration.highlightAttributes) {
          shape.highlightAttributes = configuration.highlightAttributes;
        }
        if (configuration && configuration.pickDelegate) {
          shape.pickDelegate = configuration.pickDelegate;
        }
        if (configuration && configuration.userProperties) {
          shape.userProperties = configuration.userProperties;
        }
        this.layer.addRenderable(shape);
      }
    }
  };

  /**
   * Adds an extruded {@link Polygon} if extrude is set to true, otherwise adds a {@link SurfacePolygon} for each ring in the {@link GeoJSONGeometryPolygon}s in the {@link GeoJSONGeometryMultiPolygon}.
   * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
   * @param {GeoJSONGeometryMultiPolygon} geometry The MultiPolygon geometry object.
   * @param {Object} properties The properties related to the MultiPolygon geometry.
   * @throws {ArgumentError} If the specified layer is null or undefined.
   * @throws {ArgumentError} If the specified geometry is null or undefined.
   */
  GeoJSONParserOSM.prototype.addRenderablesForMultiPolygon = function (layer, geometry, properties) {
    if (!layer) {
      throw new WorldWind.ArgumentError(
        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon", "missingLayer")
      );
    }

    if (!geometry) {
      throw new WorldWind.ArgumentError(
        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon", "missingGeometry")
      );
    }

    var configuration = this.shapeConfigurationCallback(geometry, properties);
    var polygons = geometry.coordinates, boundaries = [];
    var OSMBuildingMultiPolygon = new BuildingShape(properties);
    OSMBuildingMultiPolygon.setAltitude(configuration);
    var altitude = OSMBuildingMultiPolygon.altitude;
    if (configuration.extrude && configuration.heatmap.enabled)
      OSMBuildingMultiPolygon.setColor(configuration);

    if (!this.crs || this.crs.isCRSSupported()) {
      for (var polygonIndex = 0; polygonIndex < polygons.length; polygonIndex++) {
        boundaries = polygons[polygonIndex];

        for (var boundaryIndex = 0; boundaryIndex < boundaries.length; boundaryIndex++) {
          var points = boundaries[boundaryIndex];
          var positions = [];

          for (var positionIndex = 0;  positionIndex < points.length; positionIndex++) {
            var longitude = points[positionIndex][0];
            var latitude = points[positionIndex][1];
            var reprojectedCoordinate = this.getReprojectedIfRequired(latitude, longitude, this.crs);
            var position = new WorldWind.Position(reprojectedCoordinate[1], reprojectedCoordinate[0], altitude);
            positions.push(position);
          }

          if (configuration.extrude) {
            var shape = new WorldWind.Polygon(positions, configuration && configuration.attributes ? configuration.attributes : null);
            shape.extrude = configuration.extrude;
          }
          else
            var shape = new WorldWind.SurfacePolygon(positions, configuration && configuration.attributes ? configuration.attributes : null);

          shape.altitudeMode = configuration.altitudeMode;
          if (configuration.highlightAttributes) {
            shape.highlightAttributes = configuration.highlightAttributes;
          }
          if (configuration && configuration.pickDelegate) {
            shape.pickDelegate = configuration.pickDelegate;
          }
          if (configuration && configuration.userProperties) {
            shape.userProperties = configuration.userProperties;
          }
          this.layer.addRenderable(shape);
        }
      }
    }
  };

  return GeoJSONParserOSM;
});
