define([], function () {
  "use strict";

  var SwitcherItem = function (viewerType, viewer, id, text, type, layer, boundingBox, range) {
    this.viewerType = viewerType;
    this.viewer = viewer;
    this.id = id;
    this.text = text;
    this.type = type;
    this.layer = layer;
    this.boundingBox = boundingBox;
    this.range = range;
  };

  return SwitcherItem;
});
