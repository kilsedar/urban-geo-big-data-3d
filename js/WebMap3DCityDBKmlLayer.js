define([], function () {
  "use strict";

  var WebMap3DCityDBKmlLayer = function (webMap3DCityDBKml, url, thematicDataUrl) {
    this.webMap3DCityDBKml = webMap3DCityDBKml;
    this.url = url;
    this.thematicDataUrl = thematicDataUrl;
  };

  return WebMap3DCityDBKmlLayer;
});
