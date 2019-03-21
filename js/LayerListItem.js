define([], function () {
  "use strict";

  /* "layer" can be an ImageryLayer of CesiumJS or ImageMosaic. */
  var LayerListItem = function (id, text, inputChecked, type, layer, legend) {
    this.id = id;
    this.text = text;
    this.inputChecked = inputChecked;
    this.type = type;
    this.layer = layer;
    this.legend = legend;
    this.imageMosaicImageryLayer;
  };

  return LayerListItem;
});
