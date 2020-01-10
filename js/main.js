require.config({
  baseUrl: "./",
  paths: {
    "jquery": "vendor/jquery-3.3.1.min",
    "bootstrap": "vendor/bootstrap-4.1.0-dist/js/bootstrap.bundle.min",
    "ispraLandCoverLegend": "images/legends/ispraLandCover",
    "glc30Legend": "images/legends/glc30",
    "milanFloodRiskLegend": "images/legends/milanFloodRisk",
    "deformationMeanLegend": "images/legends/deformationMean",
    "deformationCumulativeLegend": "images/legends/deformationCumulative",
    "publicTransportationLegend": "images/legends/publicTransportation",
    "trafficLegend": "images/legends/traffic"
  },
  shim: {
    "ispraLandCoverLegend": {
        "deps": ["jquery"]
    },
    "glc30Legend": {
        "deps": ["jquery"]
    },
    "milanFloodRiskLegend": {
        "deps": ["jquery"]
    },
    "deformationMeanLegend": {
        "deps": ["jquery"]
    },
    "deformationCumulativeLegend": {
        "deps": ["jquery"]
    },
    "publicTransportationLegend": {
        "deps": ["jquery"]
    },
    "trafficLegend": {
        "deps": ["jquery"]
    }
  }
});

require(["jquery",
        "vendor/3dosm/src/OSMBuildingLayer",
        "js/Header",
        "js/UseCase",
        "js/Switcher",
        "js/SwitcherItem",
        "js/LayerList",
        "js/LayerListItem",
        "js/ImageMosaic",
        "js/WebMap3DCityDBKml",
        "js/WebMap3DCityDBKmlLayer",
        "js/LandCoverJson",
        "js/WmsDeformationPlot",
        "js/WcpsQuery.js",
        "js/WcpsProcessing.js",
        "ispraLandCoverLegend",
        "glc30Legend",
        "milanFloodRiskLegend",
        "deformationMeanLegend",
        "deformationCumulativeLegend",
        "publicTransportationLegend",
        "trafficLegend"],
       function ($, OSMBuildingLayer, Header, UseCase, Switcher, SwitcherItem, LayerList, LayerListItem, ImageMosaic, WebMap3DCityDBKml, WebMap3DCityDBKmlLayer, LandCoverJson, WmsDeformationPlot, WcpsQuery, WcpsProcessing) {
  "use strict";

  var worldWindViewer3dCity = new WorldWind.WorldWindow("world-wind-3d-city-canvas");
  worldWindViewer3dCity.navigator.lookAtLocation = new WorldWind.Location(41, 12);
  worldWindViewer3dCity.navigator.range = 22e6;
  worldWindViewer3dCity.addLayer(new WorldWind.BingAerialLayer());
  worldWindViewer3dCity.addLayer(new WorldWind.ViewControlsLayer(worldWindViewer3dCity));
  var starFieldLayer = new WorldWind.StarFieldLayer();
  starFieldLayer.time = new Date();
  worldWindViewer3dCity.addLayer(starFieldLayer);
  var atmosphereLayer = new WorldWind.AtmosphereLayer();
  atmosphereLayer.lightLocation = WorldWind.SunPosition.getAsGeographicLocation(starFieldLayer.time);
  worldWindViewer3dCity.addLayer(atmosphereLayer);

  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(7.0, 35.0, 19.0, 47.0);
  Cesium.Camera.DEFAULT_VIEW_FACTOR = 2;

  /* Public website for education or non-profit organization use anticipates less than 50000 cumulative transitions within any 24-hour period. (https://www.microsoft.com/en-us/maps/licensing/options) */
  var bingAerialProvider = new Cesium.BingMapsImageryProvider({
    url : "https://dev.virtualearth.net",
    key : "AtxWisu4pq4vFC9LnKyJa2DL0Yb2JjS0Hy9Q2Yi8o8WQpHmgYbWKxaATiFY56S_G",
    mapStyle : Cesium.BingMapsStyle.AERIAL
  });

  /* Allows up to 50000 views per month. (https://www.mapbox.com/pricing/) */
  var mapboxSatelliteStreetsProvider = new Cesium.MapboxImageryProvider({
    mapId: "mapbox.streets-satellite",
    accessToken: "pk.eyJ1IjoidWdiZCIsImEiOiJjam5lZW5xbmMwNzF6M3dwZDFzZ2ZmMTM5In0.vDfccM2WaIyP4vnBN3iB9g"
  });

  /* OSM tile servers are not free of charge, however access to them is permitted as long as minimum requirements are met: https://operations.osmfoundation.org/policies/tiles/. */
  var osmProvider = new Cesium.createOpenStreetMapImageryProvider({
    url: "https://a.tile.openstreetmap.org/",
    credit: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
  });

  /* The free service allows maximum 75000 map views per month. (https://carto.com/location-data-services/basemaps/) */
  var cartoDarkProvider = new Cesium.createOpenStreetMapImageryProvider({
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    credit: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, © <a href='https://carto.com/attribution/'>CARTO</a>"
  });

  /* Stamen maps are free of charge. (http://maps.stamen.com/#toner/12/37.7706/-122.3782) */
  var stamenTerrainProvider = new Cesium.createOpenStreetMapImageryProvider({
    url: "http://c.tile.stamen.com/terrain/",
    credit: "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://www.openstreetmap.org/copyright'>ODbL</a>."
  });

  /* Stamen maps are free of charge. (http://maps.stamen.com/#toner/12/37.7706/-122.3782) */
  var stamenWatercolorProvider = new Cesium.createOpenStreetMapImageryProvider({
    url: "http://c.tile.stamen.com/watercolor/",
    credit: "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>."
  });

  var skyBox3dCity = new Cesium.SkyBox({
    sources: {
      positiveX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_px.jpg",
      negativeX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg",
      positiveY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_py.jpg",
      negativeY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_my.jpg",
      positiveZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg",
      negativeZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg"
    }
  });

  var skyBoxDeformation = new Cesium.SkyBox({
    sources: {
      positiveX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_px.jpg",
      negativeX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg",
      positiveY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_py.jpg",
      negativeY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_my.jpg",
      positiveZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg",
      negativeZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg"
    }
  });

  var skyBoxLulc = new Cesium.SkyBox({
    sources: {
      positiveX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_px.jpg",
      negativeX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg",
      positiveY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_py.jpg",
      negativeY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_my.jpg",
      positiveZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg",
      negativeZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg"
    }
  });

  var skyBoxMobility = new Cesium.SkyBox({
    sources: {
      positiveX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_px.jpg",
      negativeX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg",
      positiveY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_py.jpg",
      negativeY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_my.jpg",
      positiveZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg",
      negativeZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg"
    }
  });

  var terrainProvider = new Cesium.VRTheWorldTerrainProvider({
    url: "http://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/",
    credit: "Terrain data courtesy of <a href='https://www.mak.com/products/terrain/vr-theworld-server/vr-theworld-online'>VT MAK</a>"
  });

  var cesiumViewer3dCity = new Cesium.Viewer("cesium-3d-city", {
    imageryProvider: bingAerialProvider,
    // terrainProvider: terrainProvider,
    terrainProvider: new Cesium.CesiumTerrainProvider({
      url: "http://urbangeobigdata.como.polimi.it:8082/tilesets/dtm"
    }),
    skyBox: skyBox3dCity,
    baseLayerPicker: false,
    geocoder: false,
    infoBox: false,
    navigationHelpButton: true,
    shadows: true,
    terrainShadows: Cesium.ShadowMode.ENABLED
  });
  cesiumViewer3dCity.clock.multiplier = 3600;
  cesiumViewer3dCity.shadowMap.normalOffset = false;
  cesiumViewer3dCity.shadowMap.maximumDistance = 3000;
  cesiumViewer3dCity.scene.logarithmicDepthBuffer = false;
  cesiumViewer3dCity.scene.globe.depthTestAgainstTerrain = true;

  var cesiumViewerDeformation = new Cesium.Viewer("cesium-deformation", {
    imageryProvider: cartoDarkProvider,
    terrainProvider: terrainProvider,
    skyBox: skyBoxDeformation,
    baseLayerPicker: false,
    geocoder: false,
    infoBox: false,
    navigationHelpButton: true,
  });

  var cesiumViewerLulc = new Cesium.Viewer("cesium-lulc", {
    imageryProvider: cartoDarkProvider,
    terrainProvider: terrainProvider,
    skyBox: skyBoxLulc,
    baseLayerPicker: false,
    geocoder: false,
    infoBox: true,
    navigationHelpButton: true
  });

  var cesiumViewerMobility = new Cesium.Viewer("cesium-mobility", {
    imageryProvider: cartoDarkProvider,
    terrainProvider: terrainProvider,
    skyBox: skyBoxMobility,
    baseLayerPicker: false,
    geocoder: false,
    infoBox: false,
    navigationHelpButton: true
  });

  var header = new Header("rgba(67, 173, 97, 1.0)", "rgba(51, 132, 74, 1.0)");

  var useCaseWorldWind3dCity = new UseCase(worldWindViewer3dCity, "world-wind-3d-city-use-case", "3D City <img id='header-nasa-image' src='images/nasa.png'>", "3D OpenStreetMap Buildings with NASA Web WorldWind", true);
  var useCaseCesium3dCity = new UseCase(cesiumViewer3dCity, "cesium-3d-city-use-case", "3D City <img id='header-cesium-image' src='images/cesium-white.png'>", "CityGML with CesiumJS", false);
  var useCaseDeformation = new UseCase(cesiumViewerDeformation, "cesium-deformation-use-case", "Deformation", "Deformation Maps with CesiumJS", false);
  var useCaseLulc = new UseCase(cesiumViewerLulc, "cesium-lulc-use-case", "LULC", "Land Use and Land Cover Maps with CesiumJS", false);
  var useCaseMobility = new UseCase(cesiumViewerMobility, "cesium-mobility-use-case", "Mobility", "Pulic Transportation and Traffic Maps with CesiumJS", false);

  header.addUseCase(useCaseWorldWind3dCity);
  header.addUseCase(useCaseCesium3dCity);
  header.addUseCase(useCaseDeformation);
  header.addUseCase(useCaseLulc);
  header.addUseCase(useCaseMobility);

  var switcherWorldWind3dCity = new Switcher("world-wind-3d-city", "switcher-world-wind-3d-city");

  var worldWind3dCityConfigurationMilan = {
    interiorColor: new WorldWind.Color(0.0, 0.0, 0.0, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "property", value: "height_med"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 10, 20, 40, 60, 900]}
  };
  var worldWind3dCitySourceMilan = {type: "GeoJSONFile", path: "data/geojson/milan.geojson"};
  var worldWind3dCityMilan = new OSMBuildingLayer(worldWind3dCityConfigurationMilan, worldWind3dCitySourceMilan);
  var switcherWorldWind3dCityMilan = new SwitcherItem("world-wind", worldWindViewer3dCity, "world-wind-3d-city-milan", "Milan", "renderable", worldWind3dCityMilan, [9.17356, 45.4561, 9.21089, 45.4907], undefined);
  switcherWorldWind3dCity.add(switcherWorldWind3dCityMilan);

  var worldWind3dCityConfigurationPadua = {
    interiorColor: new WorldWind.Color(0.0, 0.2, 0.7, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "osm"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 900]}
  };
  var worldWind3dCitySourcePadua = {type: "GeoJSONFile", path: "data/geojson/padua.geojson"};
  var worldWind3dCityPadua = new OSMBuildingLayer(worldWind3dCityConfigurationPadua, worldWind3dCitySourcePadua);
  var switcherWorldWind3dCityPadua = new SwitcherItem("world-wind", worldWindViewer3dCity, "world-wind-3d-city-padua", "Padua", "renderable", worldWind3dCityPadua, [11.8641, 45.3994, 11.8935, 45.414], undefined);
  switcherWorldWind3dCity.add(switcherWorldWind3dCityPadua);

  var worldWind3dCityConfigurationRome = {
    interiorColor: new WorldWind.Color(0.0, 1.0, 0.4, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "property", value: "hei_median"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 20, 40, 60]}
  };
  var worldWind3dCitySourceRome = {type: "GeoJSONFile", path: "data/geojson/rome.geojson"};
  var worldWind3dCityRome = new OSMBuildingLayer(worldWind3dCityConfigurationRome, worldWind3dCitySourceRome);
  var switcherWorldWind3dCityRome = new SwitcherItem("world-wind", worldWindViewer3dCity, "world-wind-3d-city-rome", "Rome", "renderable", worldWind3dCityRome, [12.4431, 41.8855, 12.4934, 41.9086], undefined);
  switcherWorldWind3dCity.add(switcherWorldWind3dCityRome);

  var worldWind3dCityConfigurationNaples = {
    interiorColor: new WorldWind.Color(0.0, 0.9, 0.8, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "osm"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 30, 48, 900]}
  };
  var worldWind3dCitySourceNaples = {type: "GeoJSONFile", path: "data/geojson/naples.geojson"};
  var worldWind3dCityNaples = new OSMBuildingLayer(worldWind3dCityConfigurationNaples, worldWind3dCitySourceNaples);
  var switcherWorldWind3dCityNaples = new SwitcherItem("world-wind", worldWindViewer3dCity, "world-wind-3d-city-naples", "Naples", "renderable", worldWind3dCityNaples, [14.2296, 40.8263, 14.2645, 40.85], undefined);
  switcherWorldWind3dCity.add(switcherWorldWind3dCityNaples);

  var worldWind3dCityConfigurationTurin = {
    interiorColor: new WorldWind.Color(0.0, 0.6, 0.9, 1.0),
    applyLighting: true,
    extrude: true,
    altitude: {type: "osm"},
    altitudeMode: WorldWind.RELATIVE_TO_GROUND,
    heatmap: {enabled: true, thresholds: [0, 6, 9, 33, 60, 900]}
  };
  var worldWind3dCitySourceTurin = {type: "GeoJSONFile", path: "data/geojson/turin.geojson"};
  var worldWind3dCityTurin = new OSMBuildingLayer(worldWind3dCityConfigurationTurin, worldWind3dCitySourceTurin);
  var switcherWorldWind3dCityTurin = new SwitcherItem("world-wind", worldWindViewer3dCity, "world-wind-3d-city-turin", "Turin", "renderable", worldWind3dCityTurin, [7.66429, 45.0589, 7.70738, 45.0898], undefined);
  switcherWorldWind3dCity.add(switcherWorldWind3dCityTurin);

  var switcherCesium3dCity = new Switcher("cesium-3d-city", "switcher-cesium-3d-city");

  var webMap3DCityDB = new WebMap3DCityDB(cesiumViewer3dCity);
  webMap3DCityDB.activateMouseMoveEvents(true);
  webMap3DCityDB.activateMouseClickEvents(true);
  var webMap3DCityDBKml = new WebMap3DCityDBKml(webMap3DCityDB);

  var cesium3dCityMilan = new WebMap3DCityDBKmlLayer(webMap3DCityDBKml, "data/kml/milan-8/", "milan", "https://www.google.com/fusiontables/DataSource?docid=1U0KZDo6d7lOvrZYI56SzlRu0ggdV9sqdWQYSwJEg");
  var switcherCesium3dCityMilan = new SwitcherItem("cesium", cesiumViewer3dCity, "cesium-3d-city-milan", "Milan", "kml", cesium3dCityMilan, [9.189000, 45.462144, 9.194527, 45.466475], 1000.0);
  switcherCesium3dCity.add(switcherCesium3dCityMilan);

  var milanBoundingBox = [8.71242903075098, 45.16242044888892, 0,
                          9.55105313254215, 45.16242044888892, 0,
                          9.55105313254215, 45.6376701796332, 0,
                          8.71242903075098, 45.6376701796332, 0];

  var water = new Cesium.Entity({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(milanBoundingBox),
      extrudedHeight: 30,
      material: Cesium.Color.LIGHTSKYBLUE.withAlpha(0.8),
      vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
    }
  });

  var viewModel = {height: 30};
  var tableWaterHeight = document.getElementById("table-water-height");
  Cesium.knockout.track(viewModel);
  Cesium.knockout.applyBindings(viewModel, tableWaterHeight);
  Cesium.knockout.getObservable(viewModel, "height").subscribe(
    function (newHeight) {
      water.polygon.extrudedHeight = newHeight;
    }
  );

  var floodRiskMilanProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://urbangeobigdata.como.polimi.it:8080/geoserver/gwc/service/wmts",
    layer: "ugbd:flood_risk_milan",
    style: "ugbd:flood_risk_milan",
    format: "image/png",
    tileMatrixSetID: "EPSG:900913",
    tileMatrixLabels: ["EPSG:900913:0", "EPSG:900913:1", "EPSG:900913:2", "EPSG:900913:3", "EPSG:900913:4", "EPSG:900913:5", "EPSG:900913:6", "EPSG:900913:7", "EPSG:900913:8", "EPSG:900913:9", "EPSG:900913:10", "EPSG:900913:11", "EPSG:900913:12", "EPSG:900913:13", "EPSG:900913:14", "EPSG:900913:15", "EPSG:900913:16", "EPSG:900913:17", "EPSG:900913:18", "EPSG:900913:19", "EPSG:900913:20", "EPSG:900913:21", "EPSG:900913:22", "EPSG:900913:23", "EPSG:900913:24", "EPSG:900913:25", "EPSG:900913:26", "EPSG:900913:27", "EPSG:900913:28", "EPSG:900913:29", "EPSG:900913:30"],
    rectangle: Cesium.Rectangle.fromDegrees(8.71242903075098, 45.16242044888892, 9.55105313254215, 45.6376701796332)
  });
  var floodRiskMilan = new Cesium.ImageryLayer(floodRiskMilanProvider);

  var cesium3dCityPadua = new WebMap3DCityDBKmlLayer(webMap3DCityDBKml, "data/kml/padua-5/", "padua", "https://www.google.com/fusiontables/DataSource?docid=1UX5QFdWPOOztk5eS2WZY-6GBcJgf7farK80rit3h");
  var switcherCesium3dCityPadua = new SwitcherItem("cesium", cesiumViewer3dCity, "cesium-3d-city-padua", "Padua", "kml", cesium3dCityPadua, [11.875266, 45.405584, 11.878439, 45.407605], 1000.0);
  switcherCesium3dCity.add(switcherCesium3dCityPadua);

  var cesium3dCityNaples = new WebMap3DCityDBKmlLayer(webMap3DCityDBKml, "data/kml/naples-3/", "naples", "https://www.google.com/fusiontables/DataSource?docid=1Ip9wT8FDkXquverJV8TPrj1WvuGfei70iK9QmAED");
  var switcherCesium3dCityNaples = new SwitcherItem("cesium", cesiumViewer3dCity, "cesium-3d-city-naples", "Naples", "kml", cesium3dCityNaples, [14.264500, 40.848800, 14.271250, 40.855650], 1000.0);
  switcherCesium3dCity.add(switcherCesium3dCityNaples);

  var cesium3dCityTurin = new WebMap3DCityDBKmlLayer(webMap3DCityDBKml, "data/kml/turin-2/", "turin", "https://www.google.com/fusiontables/DataSource?docid=1EkUJ9EEQZEySRryeM8z23KWXPuUzlkSPYL6SzzOW");
  var switcherCesium3dCityTurin = new SwitcherItem("cesium", cesiumViewer3dCity, "cesium-3d-city-turin", "Turin", "kml", cesium3dCityTurin, [7.682760, 45.069900, 7.689320, 45.072350], 1000.0);
  switcherCesium3dCity.add(switcherCesium3dCityTurin);

  var layerListCesium3dCity = new LayerList(useCaseCesium3dCity, "layer-list-cesium-3d-city");

  var layerListCesium3dCityBingAerial = new LayerListItem("cesium-3d-city-bing-aerial", "Bing Maps Aerial", true, "basemap", new Cesium.ImageryLayer(bingAerialProvider), undefined);
  layerListCesium3dCity.add(layerListCesium3dCityBingAerial);

  var layerListCesium3dCityMapboxSatelliteStreets = new LayerListItem("cesium-3d-city-mapbox-satellite-streets", "Mapbox Satellite Streets", false, "basemap", new Cesium.ImageryLayer(mapboxSatelliteStreetsProvider), undefined);
  layerListCesium3dCity.add(layerListCesium3dCityMapboxSatelliteStreets);

  var layerListCesium3dCityOsm = new LayerListItem("cesium-3d-city-osm", "OpenStreetMap", false, "basemap", new Cesium.ImageryLayer(osmProvider), undefined);
  layerListCesium3dCity.add(layerListCesium3dCityOsm);

  var layerListCesium3dCityCartoDark = new LayerListItem("cesium-3d-city-carto-dark", "CARTO Dark", false, "basemap", new Cesium.ImageryLayer(cartoDarkProvider), undefined);
  layerListCesium3dCity.add(layerListCesium3dCityCartoDark);

  var layerListCesium3dCityStamenTerrain = new LayerListItem("cesium-3d-city-stamen-terrain", "Stamen Terrain", false, "basemap", new Cesium.ImageryLayer(stamenTerrainProvider), undefined);
  layerListCesium3dCity.add(layerListCesium3dCityStamenTerrain);

  var layerListCesium3dCityStamenWatercolor = new LayerListItem("cesium-3d-city-stamen-watercolor", "Stamen Watercolor", false, "basemap", new Cesium.ImageryLayer(stamenWatercolorProvider), undefined);
  layerListCesium3dCity.add(layerListCesium3dCityStamenWatercolor);

  var switcherDeformation = new Switcher("cesium-deformation", "switcher-deformation");

  var switcherDeformationMilan = new SwitcherItem("cesium", cesiumViewerDeformation, "deformation-milan", "Milan", undefined, undefined, [9.09069, 45.30822, 9.6169, 45.58249], 60000.0);
  switcherDeformation.add(switcherDeformationMilan);

  var switcherDeformationPadua = new SwitcherItem("cesium", cesiumViewerDeformation, "deformation-padua", "Padua", undefined, undefined, [11.45958, 45.04319, 12.42597, 45.65069], 120000.0);
  switcherDeformation.add(switcherDeformationPadua);

  var switcherDeformationRome = new SwitcherItem("cesium", cesiumViewerDeformation, "deformation-rome", "Rome", undefined, undefined, [12.24653, 41.30458, 13.33569, 42.32653], 180000.0);
  switcherDeformation.add(switcherDeformationRome);

  var switcherDeformationNaples = new SwitcherItem("cesium", cesiumViewerDeformation, "deformation-naples", "Naples", undefined, undefined, [14.05072, 40.82471, 14.30817, 40.91915], 30000.0);
  switcherDeformation.add(switcherDeformationNaples);

  var switcherDeformationTurin = new SwitcherItem("cesium", cesiumViewerDeformation, "deformation-turin", "Turin", undefined, undefined, [6.87014, 44.54736, 8.04625, 45.23375], 120000.0);
  switcherDeformation.add(switcherDeformationTurin);

  var deformationMilanMeanProvider = new Cesium.WebMapServiceImageryProvider({
    url: "https://ugbd.get-it.it/proxy/image2/https://ugbd.get-it.it/geoserver/wms?transparent=TRUE&format=image/png",
    layers: "geonode:MILANO_DEFORMAZIONE_MAP"
  });
  var deformationMilanImageMosaic = new ImageMosaic(cesiumViewerDeformation, "https://ugbd.get-it.it/proxy/wmts/http://ugbd-geoserver.get-it.it/geoserver/gwc/service/wmts", "DeformationTS:milanorightcolors", ["1993-05-01", "1995-04-24", "1995-12-26", "1996-08-27", "1997-12-30", "1998-12-15", "1999-11-30", "2000-12-19", "2001-09-25", "2002-12-24", "2003-12-09", "2004-11-23", "2005-11-08", "2006-11-28", "2007-12-18", "2008-12-02", "2009-11-17", "2010-09-28"], [9.09069, 45.30822, 9.6169, 45.58249], 2628000);
  var deformationMilan = {switcherText: "Milan", meanProvider: deformationMilanMeanProvider, meanLayer: undefined, imageMosaic: deformationMilanImageMosaic, cumulativeLayer: undefined};

  var deformationPaduaMeanProvider = new Cesium.WebMapServiceImageryProvider({
    url: "https://ugbd.get-it.it/proxy/image2/https://ugbd.get-it.it/geoserver/wms?transparent=TRUE&format=image/png",
    layers: "geonode:PADOVA_DEFORMAZIONE_MAP"
  });
  var deformationPaduaImageMosaic = new ImageMosaic(cesiumViewerDeformation, "https://ugbd.get-it.it/proxy/wmts/http://ugbd-geoserver.get-it.it/geoserver/gwc/service/wmts", "DeformationTS:padovawmts", ["1992-04-24", "1993-11-05", "1995-10-30", "1996-12-23", "1997-12-08", "1998-12-28", "1999-12-13", "2000-11-27", "2001-12-17", "2002-10-28", "2003-12-22", "2004-12-06", "2005-12-26", "2006-01-30", "2006-12-11", "2007-12-31", "2008-11-10", "2009-11-30", "2010-06-28"], [11.45958, 45.04319, 12.42597, 45.65069], 2628000);
  var deformationPadua = {switcherText: "Padua", meanProvider: deformationPaduaMeanProvider, meanLayer: undefined, imageMosaic: deformationPaduaImageMosaic, cumulativeLayer: undefined};

  var deformationRomeMeanProvider = new Cesium.WebMapServiceImageryProvider({
    url: "https://ugbd.get-it.it/proxy/image2/https://ugbd.get-it.it/geoserver/wms?transparent=TRUE&format=image/png",
    layers: "geonode:ROMA_DEFORMAZIONE_MAP"
  });
  var deformationRomeImageMosaic = new ImageMosaic(cesiumViewerDeformation, "https://ugbd.get-it.it/proxy/wmts/http://ugbd-geoserver.get-it.it/geoserver/gwc/service/wmts", "DeformationTS:imageroma", ["1992-06-11", "1993-03-18", "1993-11-18", "1995-06-25", "1996-05-04", "1997-01-05", "1998-03-01", "1999-02-13", "2000-01-29", "2001-01-14", "2002-11-10", "2003-11-30", "2004-12-19", "2005-10-30", "2006-12-24", "2007-11-04", "2008-11-23", "2009-11-08", "2010-10-24"], [12.24653, 41.30458, 13.33569, 42.326539], 2628000);
  var deformationRome = {switcherText: "Rome", meanProvider: deformationRomeMeanProvider, meanLayer: undefined, imageMosaic: deformationRomeImageMosaic, cumulativeLayer: undefined};

  var deformationNaplesMeanProvider = new Cesium.WebMapServiceImageryProvider({
    url: "https://ugbd.get-it.it/proxy/image2/https://ugbd.get-it.it/geoserver/wms?transparent=TRUE&format=image/png",
    layers: "geonode:NAPOLI_DEFORMAZIONE_MAP"
  });
  var deformationNaplesImageMosaic = new ImageMosaic(cesiumViewerDeformation, "https://ugbd.get-it.it/proxy/wmts/http://ugbd-geoserver.get-it.it/geoserver/gwc/service/wmts", "DeformationTS:imagenapolirealcolors", ["1992-06-08", "1992-11-30", "1993-12-20", "1995-12-14", "1996-11-28", "1997-12-18", "1998-12-03", "1999-12-23", "2000-12-07", "2001-09-13", "2002-12-12", "2003-11-27", "2004-11-11", "2005-12-01", "2006-12-21", "2007-12-06", "2008-12-25", "2009-12-10", "2010-09-16"], [14.05072, 40.82471, 14.30817, 40.91915], 2628000);
  var deformationNaples = {switcherText: "Naples", meanProvider: deformationNaplesMeanProvider, meanLayer: undefined, imageMosaic: deformationNaplesImageMosaic, cumulativeLayer: undefined};

  var deformationTurinMeanProvider = new Cesium.WebMapServiceImageryProvider({
    url: "https://ugbd.get-it.it/proxy/image2/https://ugbd.get-it.it/geoserver/wms?transparent=TRUE&format=image/png",
    layers: "geonode:TORINO_DEFORMAZIONE_MAP"
  });
  var deformationTurinImageMosaic = new ImageMosaic(cesiumViewerDeformation, "https://ugbd.get-it.it/proxy/wmts/http://ugbd-geoserver.get-it.it/geoserver/gwc/service/wmts", "DeformationTS:torinowmts", ["1992-10-25", "1993-12-19", "1995-07-25", "1995-12-13", "1996-11-27", "1997-12-17", "1998-10-28", "1999-10-13", "2000-12-06", "2001-10-17", "2002-12-11", "2003-11-26", "2004-06-23", "2005-09-21", "2006-12-20", "2007-10-31", "2008-11-19", "2009-11-04"], [6.87014, 44.54736, 8.04625, 45.23375], 2628000);
  var deformationTurin = {switcherText: "Turin", meanProvider: deformationTurinMeanProvider, meanLayer: undefined, imageMosaic: deformationTurinImageMosaic, cumulativeLayer: undefined};

  var deformationCities = [deformationMilan, deformationPadua, deformationRome, deformationNaples, deformationTurin];

  var wmsDeformationPlot = new WmsDeformationPlot(cesiumViewerDeformation);
  wmsDeformationPlot.addListener("wfs_ts");

  var layerListDeformation = new LayerList(useCaseDeformation, "layer-list-deformation");

  var layerListDeformationBingAerial = new LayerListItem("deformation-bing-aerial", "Bing Maps Aerial", false, "basemap", new Cesium.ImageryLayer(bingAerialProvider), undefined);
  layerListDeformation.add(layerListDeformationBingAerial);

  var layerListDeformationMapboxSatelliteStreets = new LayerListItem("deformation-mapbox-satellite-streets", "Mapbox Satellite Streets", false, "basemap", new Cesium.ImageryLayer(mapboxSatelliteStreetsProvider), undefined);
  layerListDeformation.add(layerListDeformationMapboxSatelliteStreets);

  var layerListDeformationOsm = new LayerListItem("deformation-osm", "OpenStreetMap", false, "basemap", new Cesium.ImageryLayer(osmProvider), undefined);
  layerListDeformation.add(layerListDeformationOsm);

  var layerListDeformationCartoDark = new LayerListItem("deformation-carto-dark", "CARTO Dark", true, "basemap", new Cesium.ImageryLayer(cartoDarkProvider), undefined);
  layerListDeformation.add(layerListDeformationCartoDark);

  var layerListDeformationStamenTerrain = new LayerListItem("deformation-stamen-terrain", "Stamen Terrain", false, "basemap", new Cesium.ImageryLayer(stamenTerrainProvider), undefined);
  layerListDeformation.add(layerListDeformationStamenTerrain);

  var layerListDeformationStamenWatercolor = new LayerListItem("deformation-stamen-watercolor", "Stamen Watercolor", false, "basemap", new Cesium.ImageryLayer(stamenWatercolorProvider), undefined);
  layerListDeformation.add(layerListDeformationStamenWatercolor);

  var switcherLulc = new Switcher("cesium-lulc", "switcher-lulc");

  var switcherLulcMilan = new SwitcherItem("cesium", cesiumViewerLulc, "lulc-milan", "Milan", undefined, undefined, [9.04284, 45.3871, 9.27791, 45.536], 40000.0);
  switcherLulc.add(switcherLulcMilan);

  var switcherLulcPadua = new SwitcherItem("cesium", cesiumViewerLulc, "lulc-padua", "Padua", undefined, undefined, [11.8054, 45.34, 11.976, 45.4575], 40000.0);
  switcherLulc.add(switcherLulcPadua);

  var switcherLulcRome = new SwitcherItem("cesium", cesiumViewerLulc, "lulc-rome", "Rome", undefined, undefined, [12.2342, 41.6555, 12.8558, 42.141], 40000.0);
  switcherLulc.add(switcherLulcRome);

  var switcherLulcNaples = new SwitcherItem("cesium", cesiumViewerLulc, "lulc-naples", "Naples", undefined, undefined, [14.1367, 40.7912, 14.3537, 40.915], 40000.0);
  switcherLulc.add(switcherLulcNaples);

  var switcherLulcTurin = new SwitcherItem("cesium", cesiumViewerLulc, "lulc-turin", "Turin", undefined, undefined, [7.57783, 45.008, 7.77271, 45.1402], 40000.0);
  switcherLulc.add(switcherLulcTurin);

  var layerListLulc = new LayerList(useCaseLulc, "layer-list-lulc");

  var layerListLulcBingAerial = new LayerListItem("lulc-bing-aerial", "Bing Maps Aerial", false, "basemap", new Cesium.ImageryLayer(bingAerialProvider), undefined);
  layerListLulc.add(layerListLulcBingAerial);

  var layerListLulcMapboxSatelliteStreets = new LayerListItem("lulc-mapbox-satellite-streets", "Mapbox Satellite Streets", false, "basemap", new Cesium.ImageryLayer(mapboxSatelliteStreetsProvider), undefined);
  layerListLulc.add(layerListLulcMapboxSatelliteStreets);

  var layerListLulcOsm = new LayerListItem("lulc-osm", "OpenStreetMap", false, "basemap", new Cesium.ImageryLayer(osmProvider), undefined);
  layerListLulc.add(layerListLulcOsm);

  var layerListLulcCartoDark = new LayerListItem("lulc-carto-dark", "CARTO Dark", true, "basemap", new Cesium.ImageryLayer(cartoDarkProvider), undefined);
  layerListLulc.add(layerListLulcCartoDark);

  var layerListLulcStamenTerrain = new LayerListItem("lulc-stamen-terrain", "Stamen Terrain", false, "basemap", new Cesium.ImageryLayer(stamenTerrainProvider), undefined);
  layerListLulc.add(layerListLulcStamenTerrain);

  var layerListLulcStamenWatercolor = new LayerListItem("lulc-stamen-watercolor", "Stamen Watercolor", false, "basemap", new Cesium.ImageryLayer(stamenWatercolorProvider), undefined);
  layerListLulc.add(layerListLulcStamenWatercolor);

  var lulcIspraLandConsumptionImageMosaic = new ImageMosaic(cesiumViewerLulc, "http://urbangeobigdata.como.polimi.it:8080/geoserver/gwc/service/wmts", "ugbd:ispra_bu_mosaic", ["2012-01-01", "2015-01-01", "2016-01-01", "2017-01-01"], [6.538753580867903, 35.1492230912518, 20.043680683325675, 47.13620267234754], 2628000);
  var layerListLulcIspraLandConsumption = new LayerListItem("lulc-ispra-land-consumption", "ISPRA Land Consumption (2012, 2015, 2016, 2017)", false, "overlay", lulcIspraLandConsumptionImageMosaic, undefined);
  layerListLulc.add(layerListLulcIspraLandConsumption);

  var lulcIspraLandCover2012Provider = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://urbangeobigdata.como.polimi.it:8080/geoserver/gwc/service/wmts",
    layer: "ugbd:ispra_land_cover_2012",
    style: "ugbd:ispra_land_cover_2012",
    format: "image/png",
    tileMatrixSetID: "EPSG:900913",
    tileMatrixLabels: ["EPSG:900913:0", "EPSG:900913:1", "EPSG:900913:2", "EPSG:900913:3", "EPSG:900913:4", "EPSG:900913:5", "EPSG:900913:6", "EPSG:900913:7", "EPSG:900913:8", "EPSG:900913:9", "EPSG:900913:10", "EPSG:900913:11", "EPSG:900913:12", "EPSG:900913:13", "EPSG:900913:14", "EPSG:900913:15", "EPSG:900913:16", "EPSG:900913:17", "EPSG:900913:18", "EPSG:900913:19", "EPSG:900913:20", "EPSG:900913:21", "EPSG:900913:22", "EPSG:900913:23", "EPSG:900913:24", "EPSG:900913:25", "EPSG:900913:26", "EPSG:900913:27", "EPSG:900913:28", "EPSG:900913:29", "EPSG:900913:30"],
    rectangle: Cesium.Rectangle.fromDegrees(6.5022543122834735, 35.18884195920269, 19.544459557604412, 47.11391665478447)
  });
  var lulcIspraLandCover2012 = new Cesium.ImageryLayer(lulcIspraLandCover2012Provider);
  var layerListLulcIspraLandCover = new LayerListItem("lulc-ispra-land-cover", "ISPRA Land Cover (2012)", false, "overlay", lulcIspraLandCover2012, ispraLandCoverLegend);
  layerListLulc.add(layerListLulcIspraLandCover);

  var lulcGlc30ImageMosaic = new ImageMosaic(cesiumViewerLulc, "http://urbangeobigdata.como.polimi.it:8080/geoserver/gwc/service/wmts", "ugbd:glc30_mosaic", ["2000-01-01", "2010-01-01"], [6.62743, 35.4930964524792, 18.5192301504127, 47.09175], 15768000);
  var layerListLulcGlc30 = new LayerListItem("lulc-glc30", "GlobeLand30 (2000, 2010)", false, "overlay", lulcGlc30ImageMosaic, glc30Legend);
  layerListLulc.add(layerListLulcGlc30);

  var lulcGhsImageMosaic = new ImageMosaic(cesiumViewerLulc, "http://urbangeobigdata.como.polimi.it:8080/geoserver/gwc/service/wmts", "ugbd:ghs_mosaic", ["1975-01-01", "1990-01-01", "2000-01-01", "2014-01-01"], [6.62742880642586, 35.4929658861417, 18.5194423562342, 47.0917506888397], 15768000);
  var layerListLulcGhs = new LayerListItem("lulc-ghs", "GHS Built-up (1975, 1990, 2000, 2014)", false, "overlay", lulcGhsImageMosaic, undefined);
  layerListLulc.add(layerListLulcGhs);

  var lulcWcpsQuery = new WcpsQuery(cesiumViewerLulc, layerListLulc);
  lulcWcpsQuery.addListener();

  /*
  artificial surface: rgba(147, 47, 20, 1.0) or #932f14 -> Cesium.Color(0.576470588, 0.184313725, 0.078431373, 1.0)
  bare land: rgba(202, 202, 202, 1.0) or #cacaca -> Cesium.Color(0.792156863, 0.792156863, 0.792156863, 1.0)
  cultivated land: rgba(249, 243, 193, 1.0) or #f9f3c1 -> Cesium.Color(0.976470588, 0.952941176, 0.756862745, 1.0)
  forest: rgba(20, 119, 73, 1.0) or #147749 -> Cesium.Color(0.078431373, 0.466666667, 0.28627451, 1.0)
  grassland: rgba(169, 208, 95, 1.0) or #a9d05f -> Cesium.Color(0.662745098, 0.815686275, 0.37254902, 1.0)
  permanent snow and ice: rgba(211, 237, 251, 1.0) or #d3edfb -> Cesium.Color(0.82745098, 0.929411765, 0.984313725, 1.0)
  shrubland: rgba(62, 179, 112, 1.0) or #3eb370 -> Cesium.Color(0.243137255, 0.701960784, 0.439215686, 1.0)
  tundra: rgba(100, 100, 50, 1.0) or #646432 -> Cesium.Color(0.392156863, 0.392156863, 0.196078431, 1.0)
  water body: rgba(0, 68, 154, 1.0) or #00449a -> Cesium.Color(0.0, 0.266666667, 0.603921569, 1.0)
  wetland: rgba(126, 206, 244, 1.0) or #7ecef4 -> Cesium.Color(0.494117647, 0.807843137, 0.956862745, 1.0)
  */
  var glc30Classes = ["artificialSurface", "bareLand", "cultivatedLand", "forest", "grassland", "permanentSnowAndIce", "shrubland", "tundra", "waterBody", "wetland"];
  var glc30Colors = [new Cesium.Color(0.576470588, 0.184313725, 0.078431373, 1.0), new Cesium.Color(0.792156863, 0.792156863, 0.792156863, 1.0), new Cesium.Color(0.976470588, 0.952941176, 0.756862745, 1.0), new Cesium.Color(0.078431373, 0.466666667, 0.28627451, 1.0), new Cesium.Color(0.662745098, 0.815686275, 0.37254902, 1.0), new Cesium.Color(0.82745098, 0.929411765, 0.984313725, 1.0), new Cesium.Color(0.243137255, 0.701960784, 0.439215686, 1.0), new Cesium.Color(0.392156863, 0.392156863, 0.196078431, 1.0), new Cesium.Color(0.0, 0.266666667, 0.603921569, 1.0), new Cesium.Color(0.494117647, 0.807843137, 0.956862745, 1.0)];
  var urlCouchdb = "https://landcover.como.polimi.it/couchdb/lcc_points/_all_docs?include_docs=true";
  var glc30Couchdb = new LandCoverJson(glc30Classes, glc30Colors, urlCouchdb);

  var switcherMobility = new Switcher("cesium-mobility", "switcher-mobility");

  var switcherMobilityMilan = new SwitcherItem("cesium", cesiumViewerMobility, "mobility-milan", "Milan", undefined, undefined, [9.04284, 45.3871, 9.27791, 45.536], 40000.0);
  switcherMobility.add(switcherMobilityMilan);

  var switcherMobilityPadua = new SwitcherItem("cesium", cesiumViewerMobility, "mobility-padua", "Padua", undefined, undefined, [11.8054, 45.34, 11.976, 45.4575], 40000.0);
  switcherMobility.add(switcherMobilityPadua);

  var switcherMobilityRome = new SwitcherItem("cesium", cesiumViewerMobility, "mobility-rome", "Rome", undefined, undefined, [12.2342, 41.6555, 12.8558, 42.141], 40000.0);
  switcherMobility.add(switcherMobilityRome);

  var switcherMobilityNaples = new SwitcherItem("cesium", cesiumViewerMobility, "mobility-naples", "Naples", undefined, undefined, [14.1367, 40.7912, 14.3537, 40.915], 40000.0);
  switcherMobility.add(switcherMobilityNaples);

  var switcherMobilityTurin = new SwitcherItem("cesium", cesiumViewerMobility, "mobility-turin", "Turin", undefined, undefined, [7.57783, 45.008, 7.77271, 45.1402], 40000.0);
  switcherMobility.add(switcherMobilityTurin);

  var mobilityMilanPublicTransportationProvider = new Cesium.WebMapServiceImageryProvider({
    url: "http://urban.ithacaweb.org/geoserver/ithaca/wms?transparent=TRUE&format=image/png",
    layers: "ithaca:linee_milano"
  });
  var mobilityMilan = {switcherText: "Milan", publicTransportationProvider: mobilityMilanPublicTransportationProvider, publicTransportationLayer: undefined};

  var mobilityPadua = {switcherText: "Padua", publicTransportationProvider: undefined, publicTransportationLayer: undefined};

  var mobilityRomePublicTransportationProvider = new Cesium.WebMapServiceImageryProvider({
    url: "http://urban.ithacaweb.org/geoserver/ithaca/wms?transparent=TRUE&format=image/png",
    layers: "ithaca:linee_roma"
  });
  var mobilityRome = {switcherText: "Rome", publicTransportationProvider: mobilityRomePublicTransportationProvider, publicTransportationLayer: undefined};

  var mobilityNaplesPublicTransportationProvider = new Cesium.WebMapServiceImageryProvider({
    url: "http://urban.ithacaweb.org/geoserver/ithaca/wms?transparent=TRUE&format=image/png",
    layers: "ithaca:linee_napoli"
  });
  var mobilityNaples = {switcherText: "Naples", publicTransportationProvider: mobilityNaplesPublicTransportationProvider, publicTransportationLayer: undefined};

  var mobilityTurinPublicTransportationProvider = new Cesium.WebMapServiceImageryProvider({
    url: "http://urban.ithacaweb.org/geoserver/ithaca/wms?transparent=TRUE&format=image/png",
    layers: "ithaca:linee_torino"
  });
  var mobilityTurin = {switcherText: "Turin", publicTransportationProvider: mobilityTurinPublicTransportationProvider, publicTransportationLayer: undefined};

  var mobilityCities = [mobilityMilan, mobilityPadua, mobilityRome, mobilityNaples, mobilityTurin];

  var layerListMobility = new LayerList(useCaseMobility, "layer-list-mobility");

  var layerListMobilityBingAerial = new LayerListItem("mobility-bing-aerial", "Bing Maps Aerial", false, "basemap", new Cesium.ImageryLayer(bingAerialProvider), undefined);
  layerListMobility.add(layerListMobilityBingAerial);

  var layerListMobilityMapboxSatelliteStreets = new LayerListItem("mobility-mapbox-satellite-streets", "Mapbox Satellite Streets", false, "basemap", new Cesium.ImageryLayer(mapboxSatelliteStreetsProvider), undefined);
  layerListMobility.add(layerListMobilityMapboxSatelliteStreets);

  var layerListMobilityOsm = new LayerListItem("mobility-osm", "OpenStreetMap", false, "basemap", new Cesium.ImageryLayer(osmProvider), undefined);
  layerListMobility.add(layerListMobilityOsm);

  var layerListMobilityCartoDark = new LayerListItem("mobility-carto-dark", "CARTO Dark", true, "basemap", new Cesium.ImageryLayer(cartoDarkProvider), undefined);
  layerListMobility.add(layerListMobilityCartoDark);

  var layerListMobilityStamenTerrain = new LayerListItem("mobility-stamen-terrain", "Stamen Terrain", false, "basemap", new Cesium.ImageryLayer(stamenTerrainProvider), undefined);
  layerListMobility.add(layerListMobilityStamenTerrain);

  var layerListMobilityStamenWatercolor = new LayerListItem("mobility-stamen-watercolor", "Stamen Watercolor", false, "basemap", new Cesium.ImageryLayer(stamenWatercolorProvider), undefined);
  layerListMobility.add(layerListMobilityStamenWatercolor);

  $("#cesium-3d-city-milan").click(function() {
    $("#table-water-height").css("visibility", "visible");
    if (!cesiumViewer3dCity.imageryLayers.contains(floodRiskMilan))
      cesiumViewer3dCity.imageryLayers.add(floodRiskMilan);
    if (!cesiumViewer3dCity.entities.contains(water))
      cesiumViewer3dCity.entities.add(water);
    $("#cesium-3d-city").append(milanFloodRiskLegend);
    setTimeout(function() {
      layerListCesium3dCity.styleLegend();
    }, 100);
  });

  $("#cesium-3d-city-padua, #cesium-3d-city-naples, #cesium-3d-city-turin").click(function() {
    $("#table-water-height").css("visibility", "hidden");
    cesiumViewer3dCity.imageryLayers.remove(floodRiskMilan, false);
    cesiumViewer3dCity.entities.remove(water);
    milanFloodRiskLegend.remove();
  });

  function getByValue(array, value) {
    for (var i=0; i<array.length; i++) {
      if (array[i].switcherText == value)
        return array[i];
    }
  }

  function removeOverlayLayers(cesiumViewer) {
    var imageryLayers = cesiumViewer.imageryLayers;
    for (var i=0; i<imageryLayers.length; i++) {
      if (imageryLayers._layers[i].isBaseLayer() == false)
        imageryLayers.remove(imageryLayers._layers[i]);
    }
  }

  $("#switcher-deformation-menu .dropdown-item").click(function() {
    $("#deformation-mean").css("opacity", "0.6");
    $("#deformation-cumulative").css("opacity", "0.6");
    deformationMeanLegend.remove();
    deformationCumulativeLegend.remove();
    removeOverlayLayers(cesiumViewerDeformation);
    useCaseDeformation.resetClockAndTimeline();
  });

  $("#deformation-mean").click(function() {
    var deformationCity = getByValue(deformationCities, $("#switcher-deformation-menu-button").text());
    if (deformationCity != undefined) {
      if ($("#deformation-mean").css("opacity") == 1.0) {
        $("#deformation-mean").css("opacity", "0.6");
        deformationMeanLegend.remove();
        cesiumViewerDeformation.imageryLayers.remove(deformationCity.meanLayer);
      }
      else {
        $("#deformation-mean").css("opacity", "1.0");
        $("#deformation-cumulative").css("opacity", "0.6");
        $("#cesium-deformation").append(deformationMeanLegend);
        deformationCumulativeLegend.remove();
        setTimeout(function() {
          layerListDeformation.styleLegend();
        }, 100);
        if (deformationCity.cumulativeLayer != undefined)
          cesiumViewerDeformation.imageryLayers.remove(deformationCity.cumulativeLayer);
        deformationCity.meanLayer = cesiumViewerDeformation.imageryLayers.addImageryProvider(deformationCity.meanProvider);
        useCaseDeformation.resetClockAndTimeline();
      }
    }
  });

  $("#deformation-cumulative").click(function() {
    var deformationCity = getByValue(deformationCities, $("#switcher-deformation-menu-button").text());
    if (deformationCity != undefined) {
      if ($("#deformation-cumulative").css("opacity") == 1.0) {
        $("#deformation-cumulative").css("opacity", "0.6");
        deformationCumulativeLegend.remove();
        cesiumViewerDeformation.imageryLayers.remove(deformationCity.cumulativeLayer);
        useCaseDeformation.resetClockAndTimeline();
      }
      else {
        $("#deformation-mean").css("opacity", "0.6");
        $("#deformation-cumulative").css("opacity", "1.0");
        $("#cesium-deformation").append(deformationCumulativeLegend);
        deformationMeanLegend.remove();
        setTimeout(function() {
          layerListDeformation.styleLegend();
        }, 100);
        if (deformationCity.meanLayer != undefined)
          cesiumViewerDeformation.imageryLayers.remove(deformationCity.meanLayer);
        deformationCity.cumulativeLayer = cesiumViewerDeformation.imageryLayers.addImageryProvider(deformationCity.imageMosaic.imageryProvider);
        deformationCity.imageMosaic.setClockAndTimeline();
      }
    }
  });

  $("#cesium-lulc-use-case").click(function() {
    glc30Couchdb.add(cesiumViewerLulc);
  });

  $("#lulc-vgi").click(function() {
    if (cesiumViewerLulc.dataSources.length > 0) {
      cesiumViewerLulc.dataSources.removeAll();
      $("#lulc-vgi").css("opacity", "0.6");
    }
    else {
      glc30Couchdb.add(cesiumViewerLulc);
      $("#lulc-vgi").css("opacity", "1.0");
    }
  });

  $("#cesium-lulc").on("click", "#lulc-first-year .dropdown-item", function() {
    var lulcFirstYearIdSplitted = this.id.split("-");
    var lulcFirstYear = lulcFirstYearIdSplitted[lulcFirstYearIdSplitted.length-2];
    $("#lulc-first-year-menu-button").html(lulcFirstYear);
  });

  $("#cesium-lulc").on("click", "#lulc-second-year .dropdown-item", function() {
    var lulcSecondYearIdSplitted = this.id.split("-");
    var lulcSecondYear = lulcSecondYearIdSplitted[lulcSecondYearIdSplitted.length-2];
    $("#lulc-second-year-menu-button").html(lulcSecondYear);
  });

  $("#cesium-lulc").on("click", "#lulc-class .dropdown-item", function() {
    var lulcClassIdSplitted = this.id.split("-");
    var lulcClass = "";
    if (lulcClassIdSplitted[0] == "glc30") {
      for (var i=1; i<lulcClassIdSplitted.length-1; i++) {
        lulcClass += lulcClassIdSplitted[i] + " ";
      }
      lulcClass += lulcClassIdSplitted[lulcClassIdSplitted.length-1];
    }
    else if (lulcClassIdSplitted[0] == "ghs") {
      for (var i=1; i<lulcClassIdSplitted.length-2; i++) {
        lulcClass += lulcClassIdSplitted[i] + " ";
      }
      lulcClass += lulcClassIdSplitted[lulcClassIdSplitted.length-2] + "-" + lulcClassIdSplitted[lulcClassIdSplitted.length-1];
    }
    else {
      for (var i=2; i<lulcClassIdSplitted.length-1; i++) {
        lulcClass += lulcClassIdSplitted[i] + " ";
      }
      lulcClass += lulcClassIdSplitted[lulcClassIdSplitted.length-1];
    }
    $("#lulc-class-menu-button").html(lulcClass);
  });

  cesiumViewerLulc.scene.screenSpaceCameraController.enableLook = false;
  var camera = cesiumViewerLulc.camera;
  var ellipsoid = cesiumViewerLulc.scene.globe.ellipsoid;
  var screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(cesiumViewerLulc.canvas);

  var selection;
  var cartesian;
  var firstPointCartographic = new Cesium.Cartographic(), lastPointCartographic = new Cesium.Cartographic();
  var firstPointCartesian3857, lastPointCartesian3857;
  var x1, x2, y1, y2;

  var firstPointCartographicSet = false;
  var mouseDown = false;
  var drawRectangleEnabled = false;

  function hideRectangle() {
    if (selection != undefined)
      selection.show = false;
    x1 = undefined, x2 = undefined, y1 = undefined, y2 = undefined;
  }

  function disableDrawRectangle() {
    drawRectangleEnabled = false;
    $("#lulc-draw-rectangle").css("background-color", "#303336");

    screenSpaceEventHandler.setInputAction(function () {
      return;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT);

    screenSpaceEventHandler.setInputAction(function (movement) {
      return;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT);

    screenSpaceEventHandler.setInputAction(function () {
      return;
    }, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.SHIFT);

    screenSpaceEventHandler.setInputAction(function () {
      return;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  function enableDrawRectangle() {
    drawRectangleEnabled = true;
    $("#lulc-draw-rectangle").css("background-color", "#48b");

    var rectangle = new Cesium.Rectangle();

    screenSpaceEventHandler.setInputAction(function () {
      mouseDown = true;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT);

    screenSpaceEventHandler.setInputAction(function (movement) {
      if (!mouseDown)
        return;

      cartesian = camera.pickEllipsoid(movement.endPosition, ellipsoid, cartesian);
      lastPointCartographic = Cesium.Cartographic.fromCartesian(cartesian, Cesium.Ellipsoid.WGS84, lastPointCartographic);

      if (!firstPointCartographicSet) {
        Cesium.Cartographic.clone(lastPointCartographic, firstPointCartographic);
        firstPointCartographicSet = true;
      }
      else {
        rectangle.east = Math.max(lastPointCartographic.longitude, firstPointCartographic.longitude);
        rectangle.west = Math.min(lastPointCartographic.longitude, firstPointCartographic.longitude);
        rectangle.north = Math.max(lastPointCartographic.latitude, firstPointCartographic.latitude);
        rectangle.south = Math.min(lastPointCartographic.latitude, firstPointCartographic.latitude);
        selection.show = true;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT);

    screenSpaceEventHandler.setInputAction(function () {
      mouseDown = false;
      firstPointCartographicSet = false;
      firstPointCartesian3857 = new Cesium.WebMercatorProjection(ellipsoid).project(firstPointCartographic);
      lastPointCartesian3857 = new Cesium.WebMercatorProjection(ellipsoid).project(lastPointCartographic);
      x1 = Math.min(firstPointCartesian3857.x, lastPointCartesian3857.x);
      x2 = Math.max(firstPointCartesian3857.x, lastPointCartesian3857.x);
      y1 = Math.min(firstPointCartesian3857.y, lastPointCartesian3857.y);
      y2 = Math.max(firstPointCartesian3857.y, lastPointCartesian3857.y);
    }, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.SHIFT);

    screenSpaceEventHandler.setInputAction(function () {
      hideRectangle();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    var getSelectionCoordinates = new Cesium.CallbackProperty(function () {
      return rectangle;
    }, false);

    selection = cesiumViewerLulc.entities.add({
      show: false,
      rectangle: {
        coordinates: getSelectionCoordinates,
        material: Cesium.Color.WHITE.withAlpha(0.4)
      }
    });
  }

  $("#lulc-draw-rectangle").click(function() {
    if (drawRectangleEnabled == true) {
      hideRectangle();
      disableDrawRectangle();
      return;
    }

    hideRectangle();
    enableDrawRectangle();
  });

  $("#lulc-cogwheel").click(function() {
    disableDrawRectangle();

    if ($("#lulc-first-year-menu-button").html() != "1st year" && $("#lulc-second-year-menu-button").html() != "2nd year" && $("#lulc-first-year-menu-button").html() != $("#lulc-second-year-menu-button").html() && $("#lulc-class-menu-button").html() != "class" && x1 != undefined && x2 != undefined && y1 != undefined && y2 != undefined) {
      var lulcWcpsProcessing = new WcpsProcessing(cesiumViewerLulc, layerListLulc);
      lulcWcpsProcessing.detectChange($("#lulc-first-year-menu-button").html(), $("#lulc-second-year-menu-button").html(), $("#lulc-class-menu-button").html(), x1, x2, y1, y2);
      hideRectangle();
    }
    else
      alert("Please select two different years and a class and draw a rectangle to start processing.");
  });

  var checkHourChange;
  var firstMobilityTrafficLayer;
  $("#switcher-mobility-menu .dropdown-item").click(function() {
    $("#mobility-public-transportation").css("opacity", "0.6");
    $("#mobility-traffic").css("opacity", "0.6");
    publicTransportationLegend.remove();
    trafficLegend.remove();
    clearInterval(checkHourChange);
    removeOverlayLayers(cesiumViewerMobility);
    useCaseMobility.resetClockAndTimeline();
  });

  $("#mobility-public-transportation").click(function() {
    var mobilityCity = getByValue(mobilityCities, $("#switcher-mobility-menu-button").text());
    if (mobilityCity != undefined) {
      if ($("#mobility-public-transportation").css("opacity") == 1.0) {
        $("#mobility-public-transportation").css("opacity", "0.6");
        publicTransportationLegend.remove();
        cesiumViewerMobility.imageryLayers.remove(mobilityCity.publicTransportationLayer);
      }
      else {
        if (mobilityCity.switcherText == "Padua")
          alert("Public transportation data are not available for Padua.");
        else {
          $("#mobility-public-transportation").css("opacity", "1.0");
          $("#mobility-traffic").css("opacity", "0.6");
          $("#cesium-mobility").append(publicTransportationLegend);
          trafficLegend.remove();
          setTimeout(function() {
            layerListMobility.styleLegend();
          }, 100);
          if (firstMobilityTrafficLayer != undefined) {
            clearInterval(checkHourChange);
            cesiumViewerMobility.imageryLayers.remove(firstMobilityTrafficLayer);
          }
          mobilityCity.publicTransportationLayer = cesiumViewerMobility.imageryLayers.addImageryProvider(mobilityCity.publicTransportationProvider);
          useCaseMobility.resetClockAndTimeline();
        }
      }
    }
  });

  $("#mobility-traffic").click(function() {
    var mobilityCity = getByValue(mobilityCities, $("#switcher-mobility-menu-button").text());
    if (mobilityCity != undefined) {
      if ($("#mobility-traffic").css("opacity") == 1.0) {
        $("#mobility-traffic").css("opacity", "0.6");
        trafficLegend.remove();
        clearInterval(checkHourChange);
        cesiumViewerMobility.imageryLayers.remove(firstMobilityTrafficLayer);
        useCaseMobility.resetClockAndTimeline();
      }
      else {
        $("#mobility-public-transportation").css("opacity", "0.6");
        $("#mobility-traffic").css("opacity", "1.0");
        $("#cesium-mobility").append(trafficLegend);
        publicTransportationLegend.remove();
        setTimeout(function() {
          layerListMobility.styleLegend();
        }, 100);
        if (mobilityCity.publicTransportationLayer != undefined)
          cesiumViewerMobility.imageryLayers.remove(mobilityCity.publicTransportationLayer);

        var mobilityTrafficLayer;

        if (mobilityCity.switcherText == "Milan")
          mobilityTrafficLayer = "ithaca:milano_";
        else if (mobilityCity.switcherText == "Padua")
          mobilityTrafficLayer = "ithaca:padova_";
        else if (mobilityCity.switcherText == "Rome")
          mobilityTrafficLayer = "ithaca:roma_";
        else if (mobilityCity.switcherText == "Naples")
          mobilityTrafficLayer = "ithaca:napoli_";
        else
          mobilityTrafficLayer = "ithaca:torino_";

        var firstHour = 0;
        var firstMobilityTrafficProvider = new Cesium.WebMapServiceImageryProvider({
          url: "http://urban.ithacaweb.org/geoserver/ithaca/wms?transparent=TRUE&format=image/png",
          layers: mobilityTrafficLayer + firstHour
        });
        firstMobilityTrafficLayer = cesiumViewerMobility.imageryLayers.addImageryProvider(firstMobilityTrafficProvider);

        checkHourChange = setInterval(function(){
          var secondHour = (Cesium.JulianDate.toDate(cesiumViewerMobility.clock.currentTime).getHours()+23)%24;

          if (firstHour != secondHour) {
            cesiumViewerMobility.imageryLayers.remove(firstMobilityTrafficLayer);
            var secondMobilityTrafficProvider = new Cesium.WebMapServiceImageryProvider({
              url: "http://urban.ithacaweb.org/geoserver/ithaca/wms?transparent=TRUE&format=image/png",
              layers: mobilityTrafficLayer + secondHour
            });
            var secondMobilityTrafficLayer = cesiumViewerMobility.imageryLayers.addImageryProvider(secondMobilityTrafficProvider);
            firstHour = secondHour;
            firstMobilityTrafficLayer = secondMobilityTrafficLayer;
          }
        }, 500);

        var start = new Cesium.JulianDate.fromIso8601("2018-10-09T23:00:00Z");
        var stop = new Cesium.JulianDate.addHours(start, 23, new Cesium.JulianDate());
        stop = new Cesium.JulianDate.addMinutes(stop, 59, new Cesium.JulianDate());
        stop = new Cesium.JulianDate.addSeconds(stop, 59, new Cesium.JulianDate());

        var clock = cesiumViewerMobility.clock;
        clock.currentTime = start;
        clock.startTime = start;
        clock.stopTime = stop;
        clock.multiplier = 300.0;
        clock.clockRange = Cesium.ClockRange.CLAMPED;
        clock.clockStep = Cesium.ClockStep.TICK_DEPENDENT;

        cesiumViewerMobility.timeline.zoomTo(start, stop);
      }
    }
  });

  function styleLightbox(selector) {
    var mobileWidth = 576;

    var width = $(window).width();
    var height = $(window).height();

    var activeUseCaseViewerContainerId;
    header.useCases.forEach(function(useCase) {
      if (useCase.active)
        activeUseCaseViewerContainerId = useCase.viewerContainerId;
    });

    if (width < mobileWidth) {
      $(selector + " > .cesium-credit-lightbox").attr("class", "cesium-credit-lightbox cesium-credit-lightbox-mobile");
      $(selector + " > .cesium-credit-lightbox.cesium-credit-lightbox-mobile").css("margin-top", "0px");
    }
    else {
      $(selector + " > .cesium-credit-lightbox").attr("class", "cesium-credit-lightbox cesium-credit-lightbox-expanded");
      $(selector + " > .cesium-credit-lightbox.cesium-credit-lightbox-expanded").css("margin-top", Math.floor((height - $("#" + activeUseCaseViewerContainerId + " " + selector + " > .cesium-credit-lightbox.cesium-credit-lightbox-expanded").height()) * 0.5) + "px");
    }
  }

  var projectAttributionLink = $("<a></a>");
  projectAttributionLink.addClass("cesium-credit-expand-link project-attribution-link");
  projectAttributionLink.text("Project attribution");
  $(".cesium-widget-credits").append(projectAttributionLink);

  var projectAttributionLightboxOverlay = $("<div></div>");
  projectAttributionLightboxOverlay.addClass("cesium-credit-lightbox-overlay project-attribution-lightbox-overlay");

  var projectAttributionLightbox = $("<div></div>");
  projectAttributionLightbox.addClass("cesium-credit-lightbox");

  var projectTitle = $("<div></div>");
  projectTitle.addClass("cesium-credit-lightbox-title");
  projectTitle.text("URBAN GEO BIG DATA");

  var projectAttributionLightboxClose = $("<a></a>");
  projectAttributionLightboxClose.addClass("cesium-credit-lightbox-close");
  projectAttributionLightboxClose.html("&times;");

  var projectAttributionText = $("<div></div>");
  projectAttributionText.addClass("project-attribution-text");
  projectAttributionText.html("<a href='http://www.urbangeobigdata.it/' target='_blank'>URBAN GEOmatics for Bulk Information Generation, Data Assessment and Technology Awareness (URBAN GEO BIG DATA)</a> is a <a href='http://prin.miur.it/' target='_blank'>Project of National Interest (PRIN)</a> funded by the <a href='http://www.miur.gov.it/web/guest/home' target='_blank'>Italian Ministry of Education, University and Research (MIUR)</a>—id 20159CNLW8. The project contributes to improving the exploitation of new data from EO and mobile sensors, for a better understanding of a number of urban dynamics. It extracts information from data and represents it for better comprehension, aiming an improved public engagement.");

  var projectLogo = $("<img>");
  projectLogo.addClass("project-logo");
  projectLogo.attr("src", "images/urban-geo-big-data.png");

  var projectLogoLink = $("<a></a>");
  projectLogoLink.attr("href", "http://www.urbangeobigdata.it/");
  projectLogoLink.attr("target", "_blank");
  projectLogoLink.append(projectLogo);
  projectAttributionText.append(projectLogoLink);

  projectAttributionLightbox.append(projectTitle);
  projectAttributionLightbox.append(projectAttributionLightboxClose);
  projectAttributionLightbox.append(projectAttributionText);
  projectAttributionLightboxOverlay.append(projectAttributionLightbox);
  $(".cesium-widget").append(projectAttributionLightboxOverlay);

  $(".cesium-widget-credits").on("click", ".project-attribution-link", function() {
    styleLightbox(".project-attribution-lightbox-overlay");
    $(".project-attribution-lightbox-overlay").css("visibility", "visible");
  });

  $(".cesium-widget").on("click", ".cesium-credit-lightbox-close", function() {
    $(".project-attribution-lightbox-overlay").css("visibility", "hidden");
  });

  var vgiAttributionLink = $("<a></a>");
  vgiAttributionLink.addClass("cesium-credit-expand-link");
  vgiAttributionLink.attr("id", "vgi-attribution-link");
  vgiAttributionLink.text("VGI data attribution");
  $("#cesium-lulc .cesium-widget-credits").append(vgiAttributionLink);

  var vgiAttributionLightboxOverlay = $("<div></div>");
  vgiAttributionLightboxOverlay.addClass("cesium-credit-lightbox-overlay");
  vgiAttributionLightboxOverlay.attr("id", "vgi-attribution-lightbox-overlay");

  var vgiAttributionLightbox = $("<div></div>");
  vgiAttributionLightbox.addClass("cesium-credit-lightbox");

  var vgiTitle = $("<div></div>");
  vgiTitle.addClass("cesium-credit-lightbox-title");
  vgiTitle.text("Land Cover Collector");

  var vgiAttributionLightboxClose = $("<a></a>");
  vgiAttributionLightboxClose.addClass("cesium-credit-lightbox-close");
  vgiAttributionLightboxClose.html("&times;");

  var vgiAttributionText = $("<div></div>");
  vgiAttributionText.attr("id", "vgi-attribution-text");
  vgiAttributionText.html("Volunteered Geographic Information (VGI) is collected using Land Cover Collector application. It is published as <a href='https://play.google.com/store/apps/details?id=polimi.geolab.lcc' target='_blank'>Android</a> and <a href='https://itunes.apple.com/it/app/land-cover-collector/id1423068308#?platform=iphone' target='_blank'>iOS</a> mobile applications and also available on <a href='https://landcover.como.polimi.it/collector/' target='_blank'>Web</a>. The data collected can be downloaded within the Web application and the license of the data is <a href='https://opendatacommons.org/licenses/odbl/1.0/' target='_blank'>Open Database License (ODbL) v1.0</a>. The source code of the application can be found <a href='https://github.com/kilsedar/land-cover-collector' target='_blank'>here</a>.<br>" +
                          "This work is supported by <a href='http://www.urbangeobigdata.it/' target='_blank'>URBAN GEOmatics for Bulk Information Generation, Data Assessment and Technology Awareness (URBAN GEO BIG DATA)</a>, a <a href='http://prin.miur.it/' target='_blank'>Project of National Interest (PRIN)</a>, funded by the <a href='http://www.miur.gov.it/web/guest/home' target='_blank'>Italian Ministry of Education, University and Research (MIUR)</a>—id 20159CNLW8.");

  vgiAttributionLightbox.append(vgiTitle);
  vgiAttributionLightbox.append(vgiAttributionLightboxClose);
  vgiAttributionLightbox.append(vgiAttributionText);
  vgiAttributionLightboxOverlay.append(vgiAttributionLightbox);
  $(".cesium-widget").append(vgiAttributionLightboxOverlay);

  $(".cesium-widget-credits").on("click", "#vgi-attribution-link", function() {
    styleLightbox("#vgi-attribution-lightbox-overlay");
    $("#cesium-lulc #vgi-attribution-lightbox-overlay").css("visibility", "visible");
  });

  $(".cesium-widget").on("click", ".cesium-credit-lightbox-close", function() {
    $("#cesium-lulc #vgi-attribution-lightbox-overlay").css("visibility", "hidden");
  });

  $(document).click(function(event) {
    if(!$(event.target).closest(".cesium-credit-expand-link, cesium-credit-lightbox-title, .project-attribution-text, #vgi-attribution-text").length) {
      if($("#cesium-lulc #vgi-attribution-lightbox-overlay").css("visibility") == "visible")
        $("#cesium-lulc #vgi-attribution-lightbox-overlay").css("visibility", "hidden");
      if($(".project-attribution-lightbox-overlay").css("visibility") == "visible")
        $(".project-attribution-lightbox-overlay").css("visibility", "hidden");
    }
  });

  $(window).resize(function() {
    styleLightbox(".project-attribution-lightbox-overlay");
    styleLightbox("#vgi-attribution-lightbox-overlay");
    layerListCesium3dCity.styleLayerList();
    layerListDeformation.styleLayerList();
    layerListLulc.styleLayerList();
    layerListMobility.styleLayerList();
    layerListCesium3dCity.styleLegend();
    layerListDeformation.styleLegend();
    layerListLulc.styleLegend();
    layerListMobility.styleLegend();
  });

  $("#window").on("click", ".first-level-title", function(event) {
    $(this).find("img").toggle();
    $(this).parent().find(".second-level").toggle();
    layerListLulc.styleLegend();
  });

  $("#window").on("click", ".second-level-title", function(event) {
    $(this).find("img").toggle();
    $(this).parent().find(".third-level").toggle();
    layerListLulc.styleLegend();
  });

  $("#window").on("click", ".third-level-title", function(event) {
    $(this).find("img").toggle();
    $(this).parent().find(".fourth-level").toggle();
    layerListLulc.styleLegend();
  });

  $("#window").on("mouseenter", ".first-level-title:has( .caret), .second-level-title:has( .caret), .third-level-title:has( .caret)", function(event) {
    $(this).css("cursor", "pointer");
  });

  $(".cesium-viewer-toolbar button").attr("data-toggle", "tooltip");
  $(".cesium-viewer-toolbar button.cesium-home-button").attr("title", "View home");
  $(".cesium-viewer-toolbar button.cesium-navigation-help-button").attr("title", "Navigation instructions");

  $(document).ready(function(){
    $("[data-toggle='tooltip']").tooltip();
  });
});
