define([], function () {
  "use strict";

  var WebMap3DCityDBKmlLayer = function (webMap3DCityDBKml, url, layerName, thematicDataUrl) {
    this.webMap3DCityDBKml = webMap3DCityDBKml;
    this.url = url;
    this.layerName = layerName;
    this.thematicDataUrl = thematicDataUrl;
  };

  return WebMap3DCityDBKmlLayer;
});
