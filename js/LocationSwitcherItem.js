define([], function () {
  "use strict";

  var LocationSwitcherItem = function (text, id, viewer, layer, boundingBox) {
    this.text = text;
    this.id = id;
    this.viewer = viewer;
    this.layer = layer;
    this.boundingBox = boundingBox;
  };

  return LocationSwitcherItem;
});
