define([], function () {
  "use strict";

  var TopSection = function (globeId, id, text, tooltip, active) {
    this.globeId = globeId;
    this.id = id;
    this.text = text;
    this.tooltip = tooltip;
    this.active = active;
  };

  return TopSection;
});
