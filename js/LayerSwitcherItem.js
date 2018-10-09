define([], function () {
  "use strict";

  var LayerSwitcherItem = function (viewerType, viewer, id, text, type, layer, boundingBox, range, legendURL) {
    this.viewerType = viewerType;
    this.viewer = viewer;
    this.id = id;
    this.text = text;
    this.type = type;
    this.layer = layer;
    this.boundingBox = boundingBox;
    this.range = range;
    this.legendURL = legendURL;
  };

  return LayerSwitcherItem;
});
