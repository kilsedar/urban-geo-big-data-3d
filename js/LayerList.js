define(["jquery"], function ($) {
  "use strict";

  /* This class is written for Cesium only. */
  var LayerList = function (viewerContainerId, id) {
    this.items = [];
    this.viewerContainerId = viewerContainerId;
    this.id = id;

    var layerList = $("<div></div>");
    layerList.attr("id", this.id);
    layerList.addClass("layer-list");

    $("#"+this.viewerContainerId).append(layerList);

    var _self = this;

    $("#"+this.viewerContainerId+"-section").click(function() {
      setTimeout(function() {
        _self.styleLayerList();
      }, 100);
    });
  };

  LayerList.prototype.styleLegend = function () {
    if ($("#"+this.viewerContainerId+" .legend").is(":visible")) {
      if ($("#"+this.viewerContainerId+" .legend").prop("scrollHeight")+126 > $(window).height()) {
        $("#"+this.viewerContainerId+" .legend").css("height", $(window).height()-126 + "px");
        $("#"+this.viewerContainerId+" .legend#legend-lulc-glc30").css("width", "auto");
        $("#"+this.viewerContainerId+" .legend#legend-lulc-glc30").css("width", $("#"+this.id).width()+28+"px");
      }
      else {
        $("#"+this.viewerContainerId+" .legend").css("height", "auto");
        $("#"+this.viewerContainerId+" .legend").css("width", "auto");
        $("#"+this.viewerContainerId+" .legend#legend-lulc-ispra-land-cover").css("width", "300px");
      }
    }
  }

  LayerList.prototype.styleLayerList = function () {
    if ($("#"+this.viewerContainerId+" .layer-list").is(":visible")) {
      var bottomMargin = $("#"+this.viewerContainerId+" .cesium-viewer-animationContainer").height();

      if ($("#"+this.viewerContainerId+" .layer-list").prop("scrollHeight")+bottomMargin+110 > $(window).height()) {
        $("#"+this.viewerContainerId+" .layer-list").css("height", $(window).height()-bottomMargin-110+"px");
        $("#"+this.viewerContainerId+" .layer-list").css("width", "auto");
        $("#"+this.viewerContainerId+" .layer-list").css("width", $("#"+this.id).width()+34+"px");
      }
      else {
        $("#"+this.viewerContainerId+" .layer-list").css("height", "auto");
        $("#"+this.viewerContainerId+" .layer-list").css("width", "auto");
      }
    }
  }

  LayerList.prototype.addLegend = function (layerListItem) {
    if (layerListItem.legend != undefined) {
      var legend = layerListItem.legend;
      legend.attr("id", "legend-"+layerListItem.id);
      legend.addClass("legend");
      $("#"+this.viewerContainerId).append(legend);

      var _self = this;

      /* For the times clicked on the checkbox. */
      setTimeout(function() {
        _self.styleLegend();
      }, 100);

      /* For the times the layer is added by default. */
      $("#"+this.viewerContainerId+"-section").click(function() {
        setTimeout(function() {
          _self.styleLegend();
        }, 100);
      });
    }
  }

  LayerList.prototype.add = function (layerListItem) {
    this.items.push(layerListItem);

    if (layerListItem.type == "basemap" && $("#"+this.id+" .basemaps-container").length == 0) {
      var basemapsContainer = $("<div></div>");
      basemapsContainer.addClass("basemaps-container");
      var basemapsTitle = $("<h5></h5>");
      basemapsTitle.html("Basemaps");
      basemapsContainer.append(basemapsTitle);
      $("#"+this.id).prepend(basemapsContainer);
    }
    else if (layerListItem.type == "overlay" && $("#"+this.id+" .overlays-container").length == 0) {
      var overlaysContainer = $("<div></div>");
      overlaysContainer.addClass("overlays-container");
      var overlaysTitle = $("<h5></h5>");
      overlaysTitle.html("Overlays");
      overlaysContainer.append(overlaysTitle);

      $("#"+this.id).append("<hr>");
      $("#"+this.id).append(overlaysContainer);
    }

    var item = $("<div></div>");
    item.attr("id", layerListItem.id);

    var input = $("<input></input>");
    input.attr("id", layerListItem.id+"-input");
    if (layerListItem.type == "overlay")
      input.attr("type", "checkbox");
    else if (layerListItem.type == "basemap") {
      input.attr("type", "radio");
      input.attr("name", this.id+"-basemap");
    }
    if (layerListItem.inputChecked == true) {
      input.prop("checked", true);
      if (layerListItem.type == "overlay") {
        this.addLegend(layerListItem);
        var imageryLayer = layerListItem.viewer.imageryLayers.addImageryProvider(layerListItem.imageryProvider);
        layerListItem.imageryLayer = imageryLayer;
      }
    }

    var label = $("<label></label>");
    label.attr("for", layerListItem.id+"-input");
    label.text(layerListItem.text);

    item.append(input);
    item.append(label);

    if (layerListItem.type == "overlay")
      $("#"+this.id+" .overlays-container").append(item);
    if (layerListItem.type == "basemap")
      $("#"+this.id+" .basemaps-container").append(item);

    var _self = this;

    $("#"+this.viewerContainerId).on("click", "#"+layerListItem.id+"-input", function() {
      if ($("#"+layerListItem.id+"-input").attr("type") == "checkbox" && $("#"+layerListItem.id+"-input").is(":checked")) {
        if ($("#"+_self.viewerContainerId+" .legend").length > 0)
          $("#"+_self.viewerContainerId+" .legend").remove();
        _self.addLegend(layerListItem);
        var imageryLayer = layerListItem.viewer.imageryLayers.addImageryProvider(layerListItem.imageryProvider);
        layerListItem.imageryLayer = imageryLayer;
      }
      else if ($("#"+layerListItem.id+"-input").attr("type") == "checkbox" && $("#"+layerListItem.id+"-input").is(":checked") == false) {
        $("#"+_self.viewerContainerId+" #legend-"+layerListItem.id).remove();
        layerListItem.viewer.imageryLayers.remove(layerListItem.imageryLayer);
        var layerOnTop = layerListItem.viewer.imageryLayers.get(layerListItem.viewer.imageryLayers.length-1);
        if (layerOnTop.isBaseLayer() == false) {
          for (var i=0; i<_self.items.length; i++) {
            if (_self.items[i].imageryProvider == layerOnTop._imageryProvider)
              _self.addLegend(_self.items[i]);
          }
        }
      }
      else {
        for (var i=0; i<layerListItem.viewer.imageryLayers.length; i++) {
          if (layerListItem.viewer.imageryLayers._layers[i].isBaseLayer() == true)
            layerListItem.viewer.imageryLayers.remove(layerListItem.viewer.imageryLayers._layers[i]);
        }
        layerListItem.viewer.imageryLayers.addImageryProvider(layerListItem.imageryProvider, 0);
      }
    });
  }

  return LayerList;
});
