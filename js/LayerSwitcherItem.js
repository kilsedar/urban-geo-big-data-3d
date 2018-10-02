define([], function () {
  "use strict";

  var LayerSwitcherItem = function (viewerType, type, viewer, text, id, layer, boundingBox, range) {
    this.viewerType = viewerType;
    this.type = type;
    this.viewer = viewer;
    this.text = text;
    this.id = id;
    this.layer = layer;
    this.boundingBox = boundingBox;
    this.range = range;
  };

  return LayerSwitcherItem;
});
