define([], function () {
  "use strict";

  var LayerListItem = function (viewer, id, text, layer, legendURL) {
    this.viewer = viewer;
    this.id = id;
    this.text = text;
    this.layer = layer;
    this.legendURL = legendURL;
  };

  return LayerListItem;
});
