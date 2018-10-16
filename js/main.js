define(["js/TopNavigationBar",
        "js/TopSection",
        "js/Switcher",
        "js/SwitcherItem",
        "js/WmsDeformationPlot",
        "js/LandCoverJson",
        "js/WebMap3DCityDBKml",
        "js/WebMap3DCityDBKmlLayer",
        "js/LayerList",
        "js/LayerListItem",
        "vendor/3dosm/src/OSMBuildingLayer",
        "jquery"],
       function (TopNavigationBar, TopSection, Switcher, SwitcherItem, WmsDeformationPlot, LandCoverJson, WebMap3DCityDBKml, WebMap3DCityDBKmlLayer, LayerList, LayerListItem, OSMBuildingLayer, $) {
  "use strict";

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

  /* Cesium.BingMapsApi.defaultKey = "AkOk-CSt-kcpa4o6S8qZPtUEfPIRh__FfRTCl9nFu51qAMSJklQe8KiFFFNivIRD";
  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZTc0MTUyMS03NTBhLTRlYzItYTk0Ni03MjYzNDlkNWU4ODIiLCJpZCI6MTM5MywiaWF0IjoxNTI4MjEzMTM3fQ.PjFkLZuljzHqMy1g8kSiRV4nmU6piS5UgfABBRaVAKM"; */

  Cesium.Camera.DEFAULT_VIEW_FACTOR = 2;
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(7.0, 35.0, 19.0, 47.0);

  /* var cesiumViewer3dCity = new Cesium.Viewer("cesium-3d-city", {
    timeline: false,
    animation: false,
    // terrainProvider: Cesium.createWorldTerrain(),
    infoBox: true,
    navigationHelpButton: false
  }); */

  var cesiumViewer3dCity = new Cesium.Viewer("cesium-3d-city", {
    /* imageryProvider: Cesium.createTileMapServiceImageryProvider({
      url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII/"),
      credit: "Imagery courtesy Natural Earth"
    }), */
    imageryProvider: Cesium.createTileMapServiceImageryProvider({
      url: Cesium.buildModuleUrl("http://localhost/urban-geo-big-data-3d/vendor/Cesium-1.50/Source/Assets/Textures/NaturalEarthII-GitHub/"),
      credit: "Imagery courtesy Natural Earth"
    }),
    skyBox: new Cesium.SkyBox({
      sources: {
        positiveX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_px.jpg",
        negativeX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg",
        positiveY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_py.jpg",
        negativeY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_my.jpg",
        positiveZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg",
        negativeZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg"
      }
    }),
    baseLayerPicker: false,
    geocoder: false,
    timeline: false,
    animation: false,
    infoBox: true,
    navigationHelpButton: false
  });

  /* var cesiumViewerDeformation = new Cesium.Viewer("cesium-deformation", {
    timeline: false,
    animation: false,
    terrainProvider: Cesium.createWorldTerrain(),
    infoBox: false,
    navigationHelpButton: false
  }); */

  var cesiumViewerDeformation = new Cesium.Viewer("cesium-deformation", {
    /* imageryProvider: Cesium.createTileMapServiceImageryProvider({
      url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII/"),
      credit: "Imagery courtesy Natural Earth"
    }), */
    imageryProvider: Cesium.createTileMapServiceImageryProvider({
      url: Cesium.buildModuleUrl("http://localhost/urban-geo-big-data-3d/vendor/Cesium-1.50/Source/Assets/Textures/NaturalEarthII-GitHub/"),
      credit: "Imagery courtesy Natural Earth"
    }),
    skyBox: new Cesium.SkyBox({
      sources: {
        positiveX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_px.jpg",
        negativeX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg",
        positiveY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_py.jpg",
        negativeY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_my.jpg",
        positiveZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg",
        negativeZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg"
      }
    }),
    baseLayerPicker: false,
    geocoder: false,
    timeline: false,
    animation: false,
    infoBox: false,
    navigationHelpButton: false
  });

  var naplesWmsDeformationPlot = new WmsDeformationPlot(cesiumViewerDeformation);
  naplesWmsDeformationPlot.addListener("wfs_ts");

  /* var cesiumViewerLulc = new Cesium.Viewer("cesium-lulc", {
    timeline: false,
    animation: false,
    terrainProvider: Cesium.createWorldTerrain(),
    infoBox: true,
    navigationHelpButton: false
  }); */

  var cesiumViewerLulc = new Cesium.Viewer("cesium-lulc", {
    /* imageryProvider: Cesium.createTileMapServiceImageryProvider({
      url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII/"),
      credit: "Imagery courtesy Natural Earth"
    }), */
    imageryProvider: Cesium.createTileMapServiceImageryProvider({
      url: Cesium.buildModuleUrl("http://localhost/urban-geo-big-data-3d/vendor/Cesium-1.50/Source/Assets/Textures/NaturalEarthII-GitHub/"),
      credit: "Imagery courtesy Natural Earth"
    }),
    skyBox: new Cesium.SkyBox({
      sources: {
        positiveX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_px.jpg",
        negativeX: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg",
        positiveY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_py.jpg",
        negativeY: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_my.jpg",
        positiveZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg",
        negativeZ: "vendor/Cesium-1.50/Source/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg"
      }
    }),
    baseLayerPicker: false,
    geocoder: false,
    timeline: false,
    animation: false,
    infoBox: true,
    navigationHelpButton: false
  });

  var topNavigationBar = new TopNavigationBar("rgba(67, 173, 97, 1.0)", "rgba(51, 132, 74, 1.0)");

  var topSectionWorldWind3dCity = new TopSection("world-wind-3d-city", worldWindViewer3dCity, "world-wind-3d-city-section", "3D City <img id='top-section-nasa-image' src='images/nasa.png'>", "3D OpenStreetMap Buildings on NASA Web WorldWind", true);
  var topSectionCesium3dCity = new TopSection("cesium-3d-city", cesiumViewer3dCity, "cesium-3d-city-section", "3D City <img id='top-section-cesium-image' src='images/cesium_white.png'>", "CityGML on Cesium", false);
  var topSectionDeformation = new TopSection("cesium-deformation", cesiumViewerDeformation, "cesium-deformation-section", "Deformation", "Deformation Maps on Cesium", false);
  var topSectionLulc = new TopSection("cesium-lulc", cesiumViewerLulc, "cesium-lulc-section", "LULC", "Land Cover Land Use (LULC) on Cesium", false);

  topNavigationBar.addSection(topSectionWorldWind3dCity);
  topNavigationBar.addSection(topSectionCesium3dCity);
  topNavigationBar.addSection(topSectionDeformation);
  topNavigationBar.addSection(topSectionLulc);

  var switcherWorldWind3dCity = new Switcher("world-wind-3d-city", "switcher-world-wind-3d-city", "location");

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
  var switcherWorldWind3dCityMilan = new SwitcherItem("world-wind", worldWindViewer3dCity, "world-wind-3d-city-milan", "Milan", "renderable", worldWind3dCityMilan, [9.17356, 45.4561, 9.21089, 45.4907], undefined, undefined);
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
  var switcherWorldWind3dCityPadua = new SwitcherItem("world-wind", worldWindViewer3dCity, "world-wind-3d-city-padua", "Padua", "renderable", worldWind3dCityPadua, [11.8641, 45.3994, 11.8935, 45.414], undefined, undefined);
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
  var switcherWorldWind3dCityRome = new SwitcherItem("world-wind", worldWindViewer3dCity, "world-wind-3d-city-rome", "Rome", "renderable", worldWind3dCityRome, [12.4431, 41.8855, 12.4934, 41.9086], undefined, undefined);
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
  var switcherWorldWind3dCityNaples = new SwitcherItem("world-wind", worldWindViewer3dCity, "world-wind-3d-city-naples", "Naples", "renderable", worldWind3dCityNaples, [14.2296, 40.8263, 14.2645, 40.85], undefined, undefined);
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
  var switcherWorldWind3dCityTurin = new SwitcherItem("world-wind", worldWindViewer3dCity, "world-wind-3d-city-turin", "Turin", "renderable", worldWind3dCityTurin, [7.66429, 45.0589, 7.70738, 45.0898], undefined, undefined);
  switcherWorldWind3dCity.add(switcherWorldWind3dCityTurin);

  var switcherCesium3dCity = new Switcher("cesium-3d-city", "switcher-cesium-3d-city", "location");

  var webMap3DCityDB = new WebMap3DCityDB(cesiumViewer3dCity);
  webMap3DCityDB.activateMouseMoveEvents(true);
  webMap3DCityDB.activateMouseClickEvents(true);
  var webMap3DCityDBKml = new WebMap3DCityDBKml(webMap3DCityDB);

  /* var cesium3dCityMilan = new WebMap3DCityDBKmlLayer(webMap3DCityDBKml, "data/kml/milan/", "milan", "https://fusiontables.google.com/data?docid=1qsPpWWImxP2v9KT0w6VdxPRjbREsvtZtbaRm233g#rows:id=1");
  var switcherCesium3dCityMilan = new SwitcherItem("cesium", cesiumViewer3dCity, "cesium-3d-city-milan", "Milan", "kml", cesium3dCityMilan, [9.18669478811458, 45.46114471445389, 9.19452789799529, 45.46647583746108], 1000.0, undefined); */
  var cesium3dCityMilan = new WebMap3DCityDBKmlLayer(webMap3DCityDBKml, "data/kml/milan-big/", "milan", "https://fusiontables.google.com/data?docid=10HLrEbV5xt2dPwcdc9Q613ect-y_k-0yOuTCQe-z#rows:id=1");
  var switcherCesium3dCityMilan = new SwitcherItem("cesium", cesiumViewer3dCity, "cesium-3d-city-milan", "Milan", "kml", cesium3dCityMilan, [9.10295703422859, 45.3997645330947, 9.3158554307893, 45.54952166494336], 1000.0, undefined);
  switcherCesium3dCity.add(switcherCesium3dCityMilan);

  var cesium3dCityPadua = new WebMap3DCityDBKmlLayer(webMap3DCityDBKml, "data/kml/padua/", "padua", "https://fusiontables.google.com/data?docid=1GM70wAFjKpNU45XXlCUTmDmpVIHKeM_3TAgOroPQ#rows:id=1");
  var switcherCesium3dCityPadua = new SwitcherItem("cesium", cesiumViewer3dCity, "cesium-3d-city-padua", "Padua", "kml", cesium3dCityPadua, [11.80612772728434, 45.34376992018347, 11.978210343773, 45.45392090970208], 1000.0, undefined);
  switcherCesium3dCity.add(switcherCesium3dCityPadua);

  var switcherDeformation = new Switcher("cesium-deformation", "switcher-deformation", "location");

  var deformationNaples = new Cesium.WebMapServiceImageryProvider({
    url: "http://localhost:8080/geoserver/ugbd/wms",
    layers: "ugbd:deformation_naples",
    parameters: {version: "1.3.0", transparent: "TRUE", format: "image/png", srs: "EPSG:4326"},
    rectangle: Cesium.Rectangle.fromDegrees(14.05072, 40.82471, 14.30817, 40.91915)
  });
  var switcherDeformationNaples = new SwitcherItem("cesium", cesiumViewerDeformation, "deformation-naples", "Naples", "imagery", deformationNaples, [14.05072, 40.82471, 14.30817, 40.91915], 40000.0, "images/legends/deformation_naples.png");
  switcherDeformation.add(switcherDeformationNaples);

  var switcherLulc = new Switcher("cesium-lulc", "switcher-lulc");

  var switcherLulcMilan = new SwitcherItem("cesium", cesiumViewerLulc, "lulc-milan", "Milan", undefined, undefined, [9.04284, 45.3871, 9.27791, 45.536], 40000.0, undefined);
  switcherLulc.add(switcherLulcMilan);

  var switcherLulcPadua = new SwitcherItem("cesium", cesiumViewerLulc, "lulc-padua", "Padua", undefined, undefined, [11.8054, 45.34, 11.976, 45.4575], 40000.0, undefined);
  switcherLulc.add(switcherLulcPadua);

  var switcherLulcRome = new SwitcherItem("cesium", cesiumViewerLulc, "lulc-rome", "Rome", undefined, undefined, [12.2342, 41.6555, 12.8558, 42.141], 40000.0, undefined);
  switcherLulc.add(switcherLulcRome);

  var switcherLulcNaples = new SwitcherItem("cesium", cesiumViewerLulc, "lulc-naples", "Naples", undefined, undefined, [14.1367, 40.7912, 14.3537, 40.915], 40000.0, undefined);
  switcherLulc.add(switcherLulcNaples);

  var switcherLulcTurin = new SwitcherItem("cesium", cesiumViewerLulc, "lulc-turin", "Turin", undefined, undefined, [7.57783, 45.008, 7.77271, 45.1402], 40000.0, undefined);
  switcherLulc.add(switcherLulcTurin);

  var layerListLulc = new LayerList("cesium-lulc", "layer-list-lulc");

  var lulcGlc302010 = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://localhost:8080/geoserver/gwc/service/wmts",
    layer: "ugbd:glc30_2010",
    style: "ugbd:glc30",
    format: "image/png",
    tileMatrixSetID: "EPSG:900913",
    tileMatrixLabels: ["EPSG:900913:0", "EPSG:900913:1", "EPSG:900913:2", "EPSG:900913:3", "EPSG:900913:4", "EPSG:900913:5", "EPSG:900913:6", "EPSG:900913:7", "EPSG:900913:8", "EPSG:900913:9", "EPSG:900913:10", "EPSG:900913:11", "EPSG:900913:12", "EPSG:900913:13", "EPSG:900913:14", "EPSG:900913:15", "EPSG:900913:16", "EPSG:900913:17", "EPSG:900913:18", "EPSG:900913:19", "EPSG:900913:20", "EPSG:900913:21", "EPSG:900913:22", "EPSG:900913:23", "EPSG:900913:24", "EPSG:900913:25", "EPSG:900913:26", "EPSG:900913:27", "EPSG:900913:28", "EPSG:900913:29", "EPSG:900913:30"],
    rectangle: Cesium.Rectangle.fromDegrees(6.6270874466178977, 35.4921528520647342, 18.5207271989720503, 47.0917262219610677)
  });
  var layerListLulcGlc30 = new LayerListItem(cesiumViewerLulc, "lulc-glc30", "GlobeLand30", lulcGlc302010, "images/legends/glc30.png");
  layerListLulc.add(layerListLulcGlc30);

  var lulcIspraLandCover2012 = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://localhost:8080/geoserver/gwc/service/wmts",
    layer: "ugbd:ispra_land_cover_2012",
    style: "ugbd:ispra_land_cover_2012",
    format: "image/png",
    tileMatrixSetID: "EPSG:900913",
    tileMatrixLabels: ["EPSG:900913:0", "EPSG:900913:1", "EPSG:900913:2", "EPSG:900913:3", "EPSG:900913:4", "EPSG:900913:5", "EPSG:900913:6", "EPSG:900913:7", "EPSG:900913:8", "EPSG:900913:9", "EPSG:900913:10", "EPSG:900913:11", "EPSG:900913:12", "EPSG:900913:13", "EPSG:900913:14", "EPSG:900913:15", "EPSG:900913:16", "EPSG:900913:17", "EPSG:900913:18", "EPSG:900913:19", "EPSG:900913:20", "EPSG:900913:21", "EPSG:900913:22", "EPSG:900913:23", "EPSG:900913:24", "EPSG:900913:25", "EPSG:900913:26", "EPSG:900913:27", "EPSG:900913:28", "EPSG:900913:29", "EPSG:900913:30"],
    rectangle: Cesium.Rectangle.fromDegrees(6.5022543122834735, 35.18884195920269, 19.544459557604412, 47.11391665478447)
  });
  var layerListLulcIspraLandCover = new LayerListItem(cesiumViewerLulc, "lulc-ispra-land-cover", "ISPRA Land Cover", lulcIspraLandCover2012, undefined);
  layerListLulc.add(layerListLulcIspraLandCover);

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

  $("#cesium-lulc-section").click(function() {
    glc30Couchdb.add(cesiumViewerLulc);
  });

  $("#switcher-lulc-menu .dropdown-item").click(function() {
    setTimeout(function() {
      $("#lulc-vgi").css("left", $("#switcher-lulc-menu-button").width()+40 + "px");
    }, 100);
  });

  $("#lulc-vgi").click(function() {
    if (cesiumViewerLulc.dataSources.length > 0) {
      cesiumViewerLulc.dataSources.removeAll();
      $("#lulc-vgi").css("background-color", "rgba(48, 51, 54, 0.6)");
      $("#lulc-vgi").css("color", "rgba(255, 255, 255, 0.6)");
    }
    else {
      glc30Couchdb.add(cesiumViewerLulc);
      $("#lulc-vgi").css("background-color", "rgba(48, 51, 54, 1.0)");
      $("#lulc-vgi").css("color", "rgba(255, 255, 255, 1.0)");
    }
  });

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
  projectLogo.attr("src", "images/urban_geo_big_data.png");

  var projectLogoLink = $("<a></a>");
  projectLogoLink.attr("href", "http://www.urbangeobigdata.it/");
  projectLogoLink.attr("target", "_blank");
  projectLogoLink.append(projectLogo);

  projectAttributionLightbox.append(projectTitle);
  projectAttributionLightbox.append(projectAttributionLightboxClose);
  projectAttributionLightbox.append(projectAttributionText);
  projectAttributionLightbox.append(projectLogoLink);
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

  function styleLightbox(selector) {
    var mobileWidth = 576;

    var width = $(window).width();
    var height = $(window).height();

    var activeSectionViewerContainerId;
    topNavigationBar.sections.forEach(function(section) {
      if (section.active)
        activeSectionViewerContainerId = section.viewerContainerId;
    });

    if (width < mobileWidth) {
      $(selector + " > .cesium-credit-lightbox").attr("class", "cesium-credit-lightbox cesium-credit-lightbox-mobile");
      $(selector + " > .cesium-credit-lightbox.cesium-credit-lightbox-mobile").css("margin-top", "0px");
    }
    else {
      $(selector + " > .cesium-credit-lightbox").attr("class", "cesium-credit-lightbox cesium-credit-lightbox-expanded");
      $(selector + " > .cesium-credit-lightbox.cesium-credit-lightbox-expanded").css("margin-top", Math.floor((height - $("#" + activeSectionViewerContainerId + " " + selector + " > .cesium-credit-lightbox.cesium-credit-lightbox-expanded").height()) * 0.5) + "px");
    }
  }

  $(window).resize(function() {
    styleLightbox(".project-attribution-lightbox-overlay");
    styleLightbox("#vgi-attribution-lightbox-overlay");
    switcherDeformation.styleLegend();
    layerListLulc.styleLegend();
    layerListLulc.styleLayerList();
  });

  $(".cesium-viewer-toolbar button").attr("data-toggle", "tooltip");
  $(".cesium-viewer-fullscreenContainer button").attr("data-toggle", "tooltip");

  $(document).ready(function(){
    $("[data-toggle='tooltip']").tooltip();
  });
});
