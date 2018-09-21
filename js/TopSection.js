define([], function () {
  "use strict";

  var TopSection = function (globeId, viewer, id, text, tooltip, active) {
    this.globeId = globeId;
    this.viewer = viewer;
    this.id = id;
    this.text = text;
    this.tooltip = tooltip;
    this.active = active;
  };

  return TopSection;
});
