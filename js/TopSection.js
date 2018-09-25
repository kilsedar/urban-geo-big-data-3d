define([], function () {
  "use strict";

  var TopSection = function (viewerContainerId, viewer, id, text, tooltip, active) {
    this.viewerContainerId = viewerContainerId;
    this.viewer = viewer;
    this.id = id;
    this.text = text;
    this.tooltip = tooltip;
    this.active = active;
  };

  return TopSection;
});
