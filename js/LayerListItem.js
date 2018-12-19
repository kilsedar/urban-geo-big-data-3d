define([], function () {
  "use strict";

  var LayerListItem = function (viewer, id, text, inputChecked, type, imageryProvider, legend) {
    this.viewer = viewer;
    this.id = id;
    this.text = text;
    this.inputChecked = inputChecked;
    this.type = type;
    this.imageryProvider = imageryProvider;
    this.legend = legend;
    this.imageryLayer;
  };

  return LayerListItem;
});
