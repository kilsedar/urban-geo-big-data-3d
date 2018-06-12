define(["js/TopNavigationBar",
        "js/TopSection",
        "js/LocationSwitcher",
        "js/LocationSwitcherItem",
        "vendor/3dosm/src/OSMBuildingLayer"],
       function (TopNavigationBar, TopSection, LocationSwitcher, LocationSwitcherItem, OSMBuildingLayer) {
  "use strict";

  Cesium.BingMapsApi.defaultKey = "AkOk-CSt-kcpa4o6S8qZPtUEfPIRh__FfRTCl9nFu51qAMSJklQe8KiFFFNivIRD";
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZTc0MTUyMS03NTBhLTRlYzItYTk0Ni03MjYzNDlkNWU4ODIiLCJpZCI6MTM5MywiaWF0IjoxNTI4MjEzMTM3fQ.PjFkLZuljzHqMy1g8kSiRV4nmU6piS5UgfABBRaVAKM';

  var cesiumViewerDeformation = new Cesium.Viewer("cesium-deformation", {
    timeline: false,
    animation: false,
    imageryProvider: Cesium.createWorldImagery(),
    terrainProvider: Cesium.createWorldTerrain()
  });

  var center = Cesium.Cartesian3.fromDegrees(12, 41);
  cesiumViewerDeformation.camera.lookAt(center, new Cesium.Cartesian3(0.0, 0.0, 18000000.0));

  var worldWindViewer3dCity = new WorldWind.WorldWindow("world-wind-3d-city-canvas");

  worldWindViewer3dCity.addLayer(new WorldWind.BMNGOneImageLayer());
  worldWindViewer3dCity.addLayer(new WorldWind.BingAerialLayer());
  worldWindViewer3dCity.addLayer(new WorldWind.ViewControlsLayer(worldWindViewer3dCity));
  var starFieldLayer = new WorldWind.StarFieldLayer();
  starFieldLayer.time = new Date();
  worldWindViewer3dCity.addLayer(starFieldLayer);
  var atmosphereLayer = new WorldWind.AtmosphereLayer();
  atmosphereLayer.lightLocation = WorldWind.SunPosition.getAsGeographicLocation(starFieldLayer.time);
  worldWindViewer3dCity.addLayer(atmosphereLayer);
  worldWindViewer3dCity.navigator.lookAtLocation = new WorldWind.Location(41, 12);
  worldWindViewer3dCity.navigator.range = 22e6;

  var topNavigationBar = new TopNavigationBar("container", "top-navigation-bar", "rgba(67, 173, 97, 1.0)", "rgba(51, 132, 74, 1.0)");

  var topSectionWorldWind3dCity = new TopSection("world-wind-3d-city", "world-wind-3d-city-section", "3D City <img id='top-section-nasa-image' src='images/nasa.png'>", "3D OpenStreetMap Buildings on NASA Web WorldWind", true);
  var topSectionDeformation = new TopSection("cesium-deformation", "deformation-section", "Deformation", "Deformation Maps on Cesium", false);
  // var topSectionCesium3dCity = new TopSection("cesium-3d-city", "cesium-3d-city-section", "3D City <img id='top-section-cesium-image' src='images/cesium_white.png'>", "CityGML on Cesium", false);
  // var topSectionLulc = new TopSection("cesium-lulc", "lulc-section", "LULC", "Land Cover Land Use (LULC) on Cesium", false);

  topNavigationBar.addSection(topSectionWorldWind3dCity);
  topNavigationBar.addSection(topSectionDeformation);
  // topNavigationBar.addSection(topSectionCesium3dCity);
  // topNavigationBar.addSection(topSectionLulc);

  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
  });

  var locationSwitcherWorldWind3dCity = new LocationSwitcher("world-wind-3d-city", "location-switcher-world-wind-3d-city");

  var worldWind3dCityConfigurationMilan = {
    interiorColor: new WorldWind.Color(0.0, 0.0, 0.0, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "property", value: "height_med"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 10, 20, 40, 60, 900]}
  };
  var worldWind3dCitySourceMilan = {type: "GeoJSONFile", path: "data/milan.geojson"};
  var worldWind3dCityMilan = new OSMBuildingLayer(worldWind3dCityConfigurationMilan, worldWind3dCitySourceMilan);
  var locationSwitcherWorldWind3dCityMilan = new LocationSwitcherItem("world-wind", worldWindViewer3dCity, "Milan", "world-wind-3d-city-milan", worldWind3dCityMilan, [9.16479, 45.4553, 9.19573, 45.4802]);
  locationSwitcherWorldWind3dCity.add(locationSwitcherWorldWind3dCityMilan);

  var worldWind3dCityConfigurationPadua = {
    interiorColor: new WorldWind.Color(0.0, 0.2, 0.7, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "osm"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 900]}
  };
  var worldWind3dCitySourcePadua = {type: "GeoJSONFile", path: "data/padua.geojson"};
  var worldWind3dCityPadua = new OSMBuildingLayer(worldWind3dCityConfigurationPadua, worldWind3dCitySourcePadua);
  var locationSwitcherWorldWind3dCityPadua = new LocationSwitcherItem("world-wind", worldWindViewer3dCity, "Padua", "world-wind-3d-city-padua", worldWind3dCityPadua, [11.8657, 45.3991, 11.888, 45.4179]);
  locationSwitcherWorldWind3dCity.add(locationSwitcherWorldWind3dCityPadua);

  var worldWind3dCityConfigurationRome = {
    interiorColor: new WorldWind.Color(0.0, 1.0, 0.4, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "property", value: "hei_median"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 20, 40, 60]}
  };
  var worldWind3dCitySourceRome = {type: "GeoJSONFile", path: "data/rome.geojson"};
  var worldWind3dCityRome = new OSMBuildingLayer(worldWind3dCityConfigurationRome, worldWind3dCitySourceRome);
  var locationSwitcherWorldWind3dCityRome = new LocationSwitcherItem("world-wind", worldWindViewer3dCity, "Rome", "world-wind-3d-city-rome", worldWind3dCityRome, [12.4446, 41.8855, 12.4934, 41.9078]);
  locationSwitcherWorldWind3dCity.add(locationSwitcherWorldWind3dCityRome);

  var worldWind3dCityConfigurationNaples = {
    interiorColor: new WorldWind.Color(0.0, 0.9, 0.8, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "osm"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 30, 48, 900]}
  };
  var worldWind3dCitySourceNaples = {type: "GeoJSONFile", path: "data/naples.geojson"};
  var worldWind3dCityNaples = new OSMBuildingLayer(worldWind3dCityConfigurationNaples, worldWind3dCitySourceNaples);
  var locationSwitcherWorldWind3dCityNaples = new LocationSwitcherItem("world-wind", worldWindViewer3dCity, "Naples", "world-wind-3d-city-naples", worldWind3dCityNaples, [14.231, 40.8263, 14.2645, 40.848]);
  locationSwitcherWorldWind3dCity.add(locationSwitcherWorldWind3dCityNaples);

  var worldWind3dCityConfigurationTurin = {
    interiorColor: new WorldWind.Color(0.0, 0.6, 0.9, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "osm"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 33, 60, 900]}
  };
  var worldWind3dCitySourceTurin = {type: "GeoJSONFile", path: "data/turin.geojson"};
  var worldWind3dCityTurin = new OSMBuildingLayer(worldWind3dCityConfigurationTurin, worldWind3dCitySourceTurin);
  var locationSwitcherWorldWind3dCityTurin = new LocationSwitcherItem("world-wind", worldWindViewer3dCity, "Turin", "world-wind-3d-city-turin", worldWind3dCityTurin, [7.67087, 45.0589, 7.70694, 45.0846]);
  locationSwitcherWorldWind3dCity.add(locationSwitcherWorldWind3dCityTurin);

  var locationSwitcherDeformation = new LocationSwitcher("cesium-deformation", "location-switcher-deformation");

  var deformationNaples = new Cesium.WebMapServiceImageryProvider({
    url: "http://localhost:8080/geoserver/ugbd/wms",
    layers: "ugbd:deformation_naples",
    parameters: {version: "1.3.0", transparent: "TRUE", format: "image/png", srs: "EPSG:4326"},
    rectangle: Cesium.Rectangle.fromDegrees(14.05072, 40.82471, 14.30817, 40.91915)
  });
  var locationSwitcherDeformationNaples = new LocationSwitcherItem("cesium", cesiumViewerDeformation, "Naples", "deformation-naples", deformationNaples, [14.05072, 40.82471, 14.30817, 40.91915]);
  locationSwitcherDeformation.add(locationSwitcherDeformationNaples);
});
