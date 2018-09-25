define(["js/TopNavigationBar",
        "js/TopSection",
        "js/LocationSwitcher",
        "js/LocationSwitcherItem",
        "js/WmsDeformationPlot",
        "js/LandCoverJson",
        "js/WebMap3DCityDBKml",
        "js/WebMap3DCityDBKmlLayer",
        "vendor/3dosm/src/OSMBuildingLayer"],
       function (TopNavigationBar, TopSection, LocationSwitcher, LocationSwitcherItem, WmsDeformationPlot, LandCoverJson, WebMap3DCityDBKml, WebMap3DCityDBKmlLayer, OSMBuildingLayer) {
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

  Cesium.BingMapsApi.defaultKey = "AkOk-CSt-kcpa4o6S8qZPtUEfPIRh__FfRTCl9nFu51qAMSJklQe8KiFFFNivIRD";
  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZTc0MTUyMS03NTBhLTRlYzItYTk0Ni03MjYzNDlkNWU4ODIiLCJpZCI6MTM5MywiaWF0IjoxNTI4MjEzMTM3fQ.PjFkLZuljzHqMy1g8kSiRV4nmU6piS5UgfABBRaVAKM";

  Cesium.Camera.DEFAULT_VIEW_FACTOR = 2;
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(7.0, 35.0, 19.0, 47.0);

  var cesiumViewer3dCity = new Cesium.Viewer("cesium-3d-city", {
    timeline: false,
    animation: false,
    // terrainProvider: Cesium.createWorldTerrain(),
    infoBox: true,
    navigationHelpButton: false
  });

  var cesiumViewerDeformation = new Cesium.Viewer("cesium-deformation", {
    timeline: false,
    animation: false,
    terrainProvider: Cesium.createWorldTerrain(),
    infoBox: false,
    navigationHelpButton: false
  });

  var naplesWmsDeformationPlot = new WmsDeformationPlot(cesiumViewerDeformation);
  naplesWmsDeformationPlot.addListener("wfs_ts");

  var cesiumViewerLulc = new Cesium.Viewer("cesium-lulc", {
    timeline: false,
    animation: false,
    terrainProvider: Cesium.createWorldTerrain(),
    infoBox: true,
    navigationHelpButton: false
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
  var worldWind3dCitySourceMilan = {type: "GeoJSONFile", path: "data/geojson/milan.geojson"};
  var worldWind3dCityMilan = new OSMBuildingLayer(worldWind3dCityConfigurationMilan, worldWind3dCitySourceMilan);
  var locationSwitcherWorldWind3dCityMilan = new LocationSwitcherItem("world-wind", "renderable", worldWindViewer3dCity, "Milan", "world-wind-3d-city-milan", worldWind3dCityMilan, [9.17356, 45.4561, 9.21089, 45.4907], undefined);
  locationSwitcherWorldWind3dCity.add(locationSwitcherWorldWind3dCityMilan);

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
  var locationSwitcherWorldWind3dCityPadua = new LocationSwitcherItem("world-wind", "renderable", worldWindViewer3dCity, "Padua", "world-wind-3d-city-padua", worldWind3dCityPadua, [11.8657, 45.3996, 11.8882, 45.418], undefined);
  locationSwitcherWorldWind3dCity.add(locationSwitcherWorldWind3dCityPadua);

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
  var locationSwitcherWorldWind3dCityRome = new LocationSwitcherItem("world-wind", "renderable", worldWindViewer3dCity, "Rome", "world-wind-3d-city-rome", worldWind3dCityRome, [12.4431, 41.8855, 12.4934, 41.9086], undefined);
  locationSwitcherWorldWind3dCity.add(locationSwitcherWorldWind3dCityRome);

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
  var locationSwitcherWorldWind3dCityNaples = new LocationSwitcherItem("world-wind", "renderable", worldWindViewer3dCity, "Naples", "world-wind-3d-city-naples", worldWind3dCityNaples, [14.2296, 40.8263, 14.2648, 40.8526], undefined);
  locationSwitcherWorldWind3dCity.add(locationSwitcherWorldWind3dCityNaples);

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
  var locationSwitcherWorldWind3dCityTurin = new LocationSwitcherItem("world-wind", "renderable", worldWindViewer3dCity, "Turin", "world-wind-3d-city-turin", worldWind3dCityTurin, [7.63893, 45.0589, 7.69818, 45.0904], undefined);
  locationSwitcherWorldWind3dCity.add(locationSwitcherWorldWind3dCityTurin);

  var locationSwitcherCesium3dCity = new LocationSwitcher("cesium-3d-city", "location-switcher-cesium-3d-city");

  var webMap3DCityDB = new WebMap3DCityDB(cesiumViewer3dCity);
  webMap3DCityDB.activateMouseMoveEvents(true);
  webMap3DCityDB.activateMouseClickEvents(true);
  var webMap3DCityDBKml = new WebMap3DCityDBKml(webMap3DCityDB);

  var webMap3DCityDBKmlMilan = new WebMap3DCityDBKmlLayer(webMap3DCityDBKml, "data/kml/milan/", "milan", "https://fusiontables.google.com/data?docid=1qsPpWWImxP2v9KT0w6VdxPRjbREsvtZtbaRm233g#rows:id=1");
  var locationSwitcherCesium3dCityMilan = new LocationSwitcherItem("cesium", "kml", cesiumViewer3dCity, "Milan", "cesium-3d-city-milan", webMap3DCityDBKmlMilan, [9.18669478811458, 45.46114471445389, 9.19452789799529, 45.46647583746108], 1000.0);
  locationSwitcherCesium3dCity.add(locationSwitcherCesium3dCityMilan);

  var locationSwitcherDeformation = new LocationSwitcher("cesium-deformation", "location-switcher-deformation");

  var deformationNaples = new Cesium.WebMapServiceImageryProvider({
    url: "http://localhost:8080/geoserver/ugbd/wms",
    layers: "ugbd:deformation_naples",
    parameters: {version: "1.3.0", transparent: "TRUE", format: "image/png", srs: "EPSG:4326"},
    rectangle: Cesium.Rectangle.fromDegrees(14.05072, 40.82471, 14.30817, 40.91915)
  });
  var locationSwitcherDeformationNaples = new LocationSwitcherItem("cesium", "imagery", cesiumViewerDeformation, "Naples", "deformation-naples", deformationNaples, [14.05072, 40.82471, 14.30817, 40.91915], 40000.0);
  locationSwitcherDeformation.add(locationSwitcherDeformationNaples);

  var locationSwitcherLulc = new LocationSwitcher("cesium-lulc", "location-switcher-lulc");

  /*
  artificial surface: rgba(147, 47, 20, 1.0) -> Cesium.Color(0.576470588, 0.184313725, 0.078431373, 1.0)
  bare land: rgba(202, 202, 202, 1.0) -> Cesium.Color(0.792156863, 0.792156863, 0.792156863, 1.0)
  cultivated land: rgba(249, 243, 193, 1.0) -> Cesium.Color(0.976470588, 0.952941176, 0.756862745, 1.0)
  forest: rgba(20, 119, 73, 1.0) -> Cesium.Color(0.078431373, 0.466666667, 0.28627451, 1.0)
  grassland: rgba(169, 208, 95, 1.0) -> Cesium.Color(0.662745098, 0.815686275, 0.37254902, 1.0)
  permanent snow and ice: rgba(211, 237, 251, 1.0) -> Cesium.Color(0.82745098, 0.929411765, 0.984313725, 1.0)
  shrubland: rgba(62, 179, 112, 1.0) -> Cesium.Color(0.243137255, 0.701960784, 0.439215686, 1.0)
  tundra: rgba(100, 100, 50, 1.0) -> Cesium.Color(0.392156863, 0.392156863, 0.196078431, 1.0)
  water body: rgba(0, 68, 154, 1.0) -> Cesium.Color(0.0, 0.266666667, 0.603921569, 1.0)
  wetland: rgba(126, 206, 244, 1.0) -> Cesium.Color(0.494117647, 0.807843137, 0.956862745, 1.0)
  */
  var glc30Classes = ["artificialSurface", "bareLand", "cultivatedLand", "forest", "grassland", "permanentSnowAndIce", "shrubland", "tundra", "waterBody", "wetland"];
  var glc30Colors = [new Cesium.Color(0.576470588, 0.184313725, 0.078431373, 1.0), new Cesium.Color(0.792156863, 0.792156863, 0.792156863, 1.0), new Cesium.Color(0.976470588, 0.952941176, 0.756862745, 1.0), new Cesium.Color(0.078431373, 0.466666667, 0.28627451, 1.0), new Cesium.Color(0.662745098, 0.815686275, 0.37254902, 1.0), new Cesium.Color(0.82745098, 0.929411765, 0.984313725, 1.0), new Cesium.Color(0.243137255, 0.701960784, 0.439215686, 1.0), new Cesium.Color(0.392156863, 0.392156863, 0.196078431, 1.0), new Cesium.Color(0.0, 0.266666667, 0.603921569, 1.0), new Cesium.Color(0.494117647, 0.807843137, 0.956862745, 1.0)];
  var urlCouchdb = "https://landcover.como.polimi.it/couchdb/lcc_points/_all_docs?include_docs=true";
  var glc30Couchdb = new LandCoverJson(glc30Classes, glc30Colors, urlCouchdb);
  var locationSwitcherLulcVgi = new LocationSwitcherItem("cesium", "entities", cesiumViewerLulc, "Italy - VGI", "lulc-vgi", glc30Couchdb, [7.0, 35.0, 19.0, 47.0], 1100000.0);
  locationSwitcherLulc.add(locationSwitcherLulcVgi);

  var topNavigationBar = new TopNavigationBar("rgba(67, 173, 97, 1.0)", "rgba(51, 132, 74, 1.0)");

  var topSectionWorldWind3dCity = new TopSection("world-wind-3d-city", worldWindViewer3dCity, "world-wind-3d-city-section", "3D City <img id='top-section-nasa-image' src='images/nasa.png'>", "3D OpenStreetMap Buildings on NASA Web WorldWind", true);
  var topSectionCesium3dCity = new TopSection("cesium-3d-city", cesiumViewer3dCity, "cesium-3d-city-section", "3D City <img id='top-section-cesium-image' src='images/cesium_white.png'>", "CityGML on Cesium", false);
  var topSectionDeformation = new TopSection("cesium-deformation", cesiumViewerDeformation, "deformation-section", "Deformation", "Deformation Maps on Cesium", false);
  var topSectionLulc = new TopSection("cesium-lulc", cesiumViewerLulc, "lulc-section", "LULC", "Land Cover Land Use (LULC) on Cesium", false);

  topNavigationBar.addSection(topSectionWorldWind3dCity);
  topNavigationBar.addSection(topSectionCesium3dCity);
  topNavigationBar.addSection(topSectionDeformation);
  topNavigationBar.addSection(topSectionLulc);

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
  projectAttributionText.html("<a href='http://www.urbangeobigdata.it/' target='_blank'>URBAN GEOmatics for Bulk Information Generation, Data Assessment and Technology Awareness (URBAN GEO BIG DATA)</a> is a <a href='http://prin.miur.it/' target='_blank'>Project of National Interest (PRIN)</a> funded by the <a href='http://www.miur.gov.it/web/guest/home' target='_blank'>Italian Ministry of Education, University and Research (MIUR)</a> – id. 20159CNLW8. The project contributes to improving the exploitation of new data from EO and mobile sensors, for a better understanding of a number of urban dynamics. It extracts information from data and represents it for better comprehension, aiming an improved public engagement.");

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
    styleLightbox();
    $(".project-attribution-lightbox-overlay").css("visibility", "visible");
  });

  $(".cesium-widget").on("click", ".cesium-credit-lightbox-close", function() {
    $(".project-attribution-lightbox-overlay").css("visibility", "hidden");
  });

  function styleLightbox() {
    var mobileWidth = 576;

    var width = $(window).width();
    var height = $(window).height();

    var activeSectionViewerContainerId;
    topNavigationBar.sections.forEach(function(section) {
      if (section.active)
        activeSectionViewerContainerId = section.viewerContainerId;
    });

    if (width < mobileWidth) {
      $(".project-attribution-lightbox-overlay > .cesium-credit-lightbox").attr("class", "cesium-credit-lightbox cesium-credit-lightbox-mobile");
      $(".project-attribution-lightbox-overlay > .cesium-credit-lightbox.cesium-credit-lightbox-mobile").css("margin-top", "0px");
    }
    else {
      $(".project-attribution-lightbox-overlay > .cesium-credit-lightbox").attr("class", "cesium-credit-lightbox cesium-credit-lightbox-expanded");
      $(".project-attribution-lightbox-overlay > .cesium-credit-lightbox.cesium-credit-lightbox-expanded").css("margin-top", Math.floor((height - $("#" + activeSectionViewerContainerId + " .project-attribution-lightbox-overlay > .cesium-credit-lightbox.cesium-credit-lightbox-expanded").height()) * 0.5) + "px");
    }
  }

  $(window).resize(function() {
    styleLightbox();
  });

  $(document).ready(function(){
    $("[data-toggle='tooltip']").tooltip();
  });
});
