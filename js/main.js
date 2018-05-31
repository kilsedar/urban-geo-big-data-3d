define(["js/TopNavigationBar",
        "js/TopSection",
        "js/LocationSwitcher",
        "js/LocationSwitcherItem",
        "vendor/3dosm/src/OSMBuildingLayer"],
       function (TopNavigationBar, TopSection, LocationSwitcher, LocationSwitcherItem, OSMBuildingLayer) {
  "use strict";

  Cesium.BingMapsApi.defaultKey = "AkOk-CSt-kcpa4o6S8qZPtUEfPIRh__FfRTCl9nFu51qAMSJklQe8KiFFFNivIRD";

  var cesiumViewer = new Cesium.Viewer("cesium", {
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false
  });

  cesiumViewer.terrainProvider = Cesium.createWorldTerrain();
  var center = Cesium.Cartesian3.fromDegrees(12, 41);
  cesiumViewer.camera.lookAt(center, new Cesium.Cartesian3(0.0, 0.0, 18000000.0));

  var worldWindViewer = new WorldWind.WorldWindow("worldwind");

  worldWindViewer.addLayer(new WorldWind.BMNGOneImageLayer());
  worldWindViewer.addLayer(new WorldWind.BingAerialLayer());
  worldWindViewer.addLayer(new WorldWind.ViewControlsLayer(worldWindViewer));
  var starFieldLayer = new WorldWind.StarFieldLayer();
  starFieldLayer.time = new Date();
  worldWindViewer.addLayer(starFieldLayer);
  var atmosphereLayer = new WorldWind.AtmosphereLayer();
  atmosphereLayer.lightLocation = WorldWind.SunPosition.getAsGeographicLocation(starFieldLayer.time);
  worldWindViewer.addLayer(atmosphereLayer);
  worldWindViewer.navigator.lookAtLocation = new WorldWind.Location(41, 12);
  worldWindViewer.navigator.range = 22e6;

  var topNavigationBar = new TopNavigationBar("container", "top-navigation-bar", "rgba(67, 173, 97, 1.0)", "rgba(51, 132, 74, 1.0)");

  var topSection3dCityNasa = new TopSection("worldwind", "3dCityNasa", "3D City <img id='top-section-nasa-image' src='images/nasa.png'>", "3D OpenStreetMap Buildings on NASA Web WorldWind", true);
  var topSection3dCityCesium = new TopSection("cesium", "3dCityCesium", "3D City <img id='top-section-cesium-image' src='images/cesium_white.png'>", "CityGML on Cesium", false);
  var topSectionLulc = new TopSection("cesium", "lulc", "LULC", "Land Cover Land Use (LULC) on Cesium", false);
  var topSectionDisplacement = new TopSection("cesium", "displacement", "Displacement", "Displacement Maps on Cesium", false);

  topNavigationBar.addSection(topSection3dCityNasa);
  topNavigationBar.addSection(topSection3dCityCesium);
  topNavigationBar.addSection(topSectionLulc);
  topNavigationBar.addSection(topSectionDisplacement);

  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
  });

  var configurationMilan = {
    interiorColor: new WorldWind.Color(0.0, 0.0, 0.0, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "property", value: "height_med"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 10, 20, 40, 60, 900]}
  };

  var sourceMilan = {type: "GeoJSONFile", path: "data/milan.geojson"};

  var milan = new OSMBuildingLayer(configurationMilan, sourceMilan);

  var locationSwitcher = new LocationSwitcher("container", "location-switcher");

  var locationSwitcherMilan = new LocationSwitcherItem("Milan", "milan", worldWindViewer, milan, [9.16479, 45.4553, 9.19573, 45.4802]);

  locationSwitcher.add(locationSwitcherMilan);

  /* var source = {type: "GeoJSONFile", path: "data/milan.geojson"};

  var configuration = {
    interiorColor: new WorldWind.Color(0.0, 0.0, 0.0, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "property", value: "height_med"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 10, 20, 40, 60, 900]}
  };

  var test = new OSMBuildingLayer(configuration, source);
  test.add(worldWindViewer);
  test.boundingBox = [9.16479, 45.4553, 9.19573, 45.4802];
  worldWindViewer.navigator.tilt = 50;
  test.zoom(); */

  /* var source = {type: "GeoJSONFile", path: "data/padua.geojson"};

  var configuration = {
    interiorColor: new WorldWind.Color(0.0, 0.2, 0.7, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "osm"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 900]}
  };

  var test = new OSMBuildingLayer(configuration, source);
  test.add(worldWindViewer);
  test.boundingBox = [11.8657, 45.3991, 11.888, 45.4179];
  worldWindViewer.navigator.tilt = 50;
  test.zoom(); */

  /* var source = {type: "GeoJSONFile", path: "data/rome.geojson"};

  var configuration = {
    interiorColor: new WorldWind.Color(0.0, 1.0, 0.4, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "property", value: "hei_median"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 20, 40, 60]}
  };

  var test = new OSMBuildingLayer(configuration, source);
  test.add(worldWindViewer);
  test.boundingBox = [12.4446, 41.8855, 12.4934, 41.9078];
  worldWindViewer.navigator.tilt = 50;
  test.zoom(); */

  /* var source = {type: "GeoJSONFile", path: "data/naples.geojson"};

  var configuration = {
    interiorColor: new WorldWind.Color(0.0, 0.9, 0.8, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "osm"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 30, 48, 900]}
  };

  var test = new OSMBuildingLayer(configuration, source);
  test.add(worldWindViewer);
  test.boundingBox = [14.231, 40.8263, 14.2645, 40.848];
  worldWindViewer.navigator.tilt = 50;
  test.zoom(); */

  /* var source = {type: "GeoJSONFile", path: "data/turin.geojson"};

  var configuration = {
    interiorColor: new WorldWind.Color(0.0, 0.6, 0.9, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "osm"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 33, 60, 900]}
  };

  var test = new OSMBuildingLayer(configuration, source);
  test.add(worldWindViewer);
  test.boundingBox = [7.67087, 45.0589, 7.70694, 45.0846];
  worldWindViewer.navigator.tilt = 50;
  test.zoom(); */
});
