define([], function () {
  "use strict";

  var LocationSwitcherItem = function (viewerType, viewer, text, id, layer, boundingBox) {
    this.viewerType = viewerType;
    this.viewer = viewer;
    this.text = text;
    this.id = id;
    this.layer = layer;
    this.boundingBox = boundingBox;
  };

  return LocationSwitcherItem;
});
