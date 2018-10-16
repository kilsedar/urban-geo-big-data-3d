define([], function () {
  "use strict";

  /* This class is written for Cesium and imagery only, as a result it works only for LULC use case. */
  var LayerList = function (viewerContainerId, id) {
    this.items = [];
    this.viewerContainerId = viewerContainerId;
    this.id = id;
    this.width;

    var layerList = $("<div></div>");
    layerList.attr("id", this.id);
    layerList.addClass("layer-list");

    $("#"+this.viewerContainerId).append(layerList);

    var _self = this;

    $("#"+this.viewerContainerId+"-section").click(function() {
      setTimeout(function() {
        _self.width = $("#"+_self.id).width()+24;
        _self.styleLayerList();
      }, 100);
    });
  };

  LayerList.prototype.styleLegend = function () {
    if ($("#"+this.viewerContainerId+" .legend").is(":visible")) {
      if ($("#"+this.viewerContainerId+" .legend").prop("scrollHeight")+126 > $(window).height()) {
        $("#"+this.viewerContainerId+" .legend").css("height", $(window).height()-126 + "px");
        $("#"+this.viewerContainerId+" .legend").css("width", $("#"+this.viewerContainerId+" .legend img").width()+10 + "px");
      }
      else {
        $("#"+this.viewerContainerId+" .legend").css("height", "auto");
        $("#"+this.viewerContainerId+" .legend").css("width", "auto");
      }
    }
  }

  LayerList.prototype.styleLayerList = function () {
    if ($("#"+this.viewerContainerId+" .layer-list").is(":visible")) {
      if ($("#"+this.viewerContainerId+" .layer-list").prop("scrollHeight")+126 > $(window).height()) {
        $("#"+this.viewerContainerId+" .layer-list").css("height", $(window).height()-126+"px");
        $("#"+this.viewerContainerId+" .layer-list").css("width", this.width+15+"px");
      }
      else {
        $("#"+this.viewerContainerId+" .layer-list").css("height", "auto");
        $("#"+this.viewerContainerId+" .layer-list").css("width", "auto");
      }
    }
  }

  LayerList.prototype.add = function (layerListItem) {
    var item = $("<div></div>");
    item.attr("id", layerListItem.id);
    item.addClass("layer-list-item");

    var input = $("<input></input>");
    input.attr("id", layerListItem.id+"-input");
    input.attr("type", "radio");
    input.attr("name", "layer-list-item-input");

    var label = $("<label></label>");
    label.attr("for", layerListItem.id+"-input");
    label.text(layerListItem.text);

    item.append(input);
    item.append(label);
    $("#"+this.id).append(item);

    var _self = this;

    $("#"+this.viewerContainerId).on("click", "#"+layerListItem.id, function() {

      $("#"+_self.viewerContainerId+" .legend").remove();
      if (layerListItem.legendURL != undefined) {
        var legend = $("<div></div>");
        legend.addClass("legend");

        var legendImage = $("<img>");
        legendImage.attr("src", layerListItem.legendURL);

        legend.append(legendImage);
        $("#"+_self.viewerContainerId).append(legend);

        setTimeout(function() {
          _self.styleLegend();
        }, 100);
      }

      for (var i=1; i<layerListItem.viewer.imageryLayers.length; i++) {
        layerListItem.viewer.imageryLayers.remove(layerListItem.viewer.imageryLayers._layers[i], true);
      }
      layerListItem.viewer.imageryLayers.addImageryProvider(layerListItem.layer);

      _self.items.push(layerListItem);
    });
  }

  return LayerList;
});
