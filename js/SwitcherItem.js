define([], function () {
  "use strict";

  var SwitcherItem = function (viewerType, viewer, id, text, type, layer, boundingBox, range, legendUrl) {
    this.viewerType = viewerType;
    this.viewer = viewer;
    this.id = id;
    this.text = text;
    this.type = type;
    this.layer = layer;
    this.boundingBox = boundingBox;
    this.range = range;
    this.legendUrl = legendUrl;
  };

  return SwitcherItem;
});
