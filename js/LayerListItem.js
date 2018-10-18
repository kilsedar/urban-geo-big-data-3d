define([], function () {
  "use strict";

  var LayerListItem = function (viewer, id, text, inputChecked, type, imageryProvider, legendURL) {
    this.viewer = viewer;
    this.id = id;
    this.text = text;
    this.inputChecked = inputChecked;
    this.type = type;
    this.imageryProvider = imageryProvider;
    this.legendURL = legendURL;
    this.imageryLayer;
  };

  return LayerListItem;
});
