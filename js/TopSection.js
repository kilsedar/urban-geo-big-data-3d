define([], function () {
  "use strict";

  var TopSection = function (viewerContainerId, id, text, tooltip, active) {
    this.viewerContainerId = viewerContainerId;
    this.id = id;
    this.text = text;
    this.tooltip = tooltip;
    this.active = active;
    this.animationContainer = $("#"+this.viewerContainerId+ " .cesium-viewer-animationContainer");
  };

  return TopSection;
});
