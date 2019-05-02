define(["jquery"], function ($) {
  "use strict";

  /* This class is written for CesiumJS only. */
  var LayerList = function (useCase, id) {
    this.useCase = useCase;
    this.id = id;
    this.viewer = useCase.viewer;
    this.viewerContainerId = this.useCase.viewerContainerId;
    this.items = [];
    this.layerOnTop = undefined;

    var layerList = $("<div></div>");
    layerList.attr("id", this.id);
    layerList.addClass("layer-list");

    $("#"+this.viewerContainerId).append(layerList);

    var _self = this;

    $("#"+this.useCase.id).click(function() {
      setTimeout(function() {
        _self.styleLayerList();
      }, 100);
    });
  };

  LayerList.prototype.styleLegend = function () {
    if ($("#"+this.viewerContainerId+" .legend").is(":visible")) {
      if ($("#"+this.viewerContainerId+" .legend").prop("scrollHeight")+130 > $(window).height()) {
        $("#"+this.viewerContainerId+" .legend").css("height", $(window).height()-130+"px");
        $("#"+this.viewerContainerId+" .legend").css("width", "auto");
        $("#"+this.viewerContainerId+" .legend#legend-lulc-glc30").css("width", $("#legend-lulc-glc30").width()+24+"px");
        $("#"+this.viewerContainerId+" .legend#legend-lulc-ispra-land-cover").css("width", "330px");
      }
      else {
        $("#"+this.viewerContainerId+" .legend").css("height", "auto");
        $("#"+this.viewerContainerId+" .legend").css("width", "auto");
      }
    }
  };

  LayerList.prototype.styleLayerList = function () {
    if ($("#"+this.viewerContainerId+" .layer-list").is(":visible")) {
      var bottomMargin = $("#"+this.viewerContainerId+" .cesium-viewer-animationContainer").height();

      if ($("#"+this.viewerContainerId+" .layer-list").prop("scrollHeight")+bottomMargin+110 > $(window).height()) {
        $("#"+this.viewerContainerId+" .layer-list").css("height", $(window).height()-bottomMargin-110+"px");
        $("#"+this.viewerContainerId+" .layer-list").css("width", "auto");
        $("#"+this.viewerContainerId+" .layer-list").css("width", $("#"+this.id).width()+36+"px");
      }
      else {
        $("#"+this.viewerContainerId+" .layer-list").css("height", "auto");
        $("#"+this.viewerContainerId+" .layer-list").css("width", "auto");
      }
    }
  };

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
      $("#"+this.useCase.id).click(function() {
        setTimeout(function() {
          _self.styleLegend();
        }, 100);
      });
    }
  };

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
        this.viewer.imageryLayers.add(layerListItem.layer);
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
        if (layerListItem.layer.constructor.name == "ImageMosaic") {
          layerListItem.imageMosaicImageryLayer = new Cesium.ImageryLayer(layerListItem.layer.imageryProvider);
          _self.viewer.imageryLayers.add(layerListItem.imageMosaicImageryLayer);
          layerListItem.layer.setClockAndTimeline();
        }
        else {
          _self.viewer.imageryLayers.add(layerListItem.layer);
          _self.useCase.resetClockAndTimeline();
        }
        _self.layerOnTop = _self.viewer.imageryLayers.get(_self.viewer.imageryLayers.length-1);
      }
      else if ($("#"+layerListItem.id+"-input").attr("type") == "checkbox" && $("#"+layerListItem.id+"-input").is(":checked") == false) {
        $("#"+_self.viewerContainerId+" #legend-"+layerListItem.id).remove();
        if (layerListItem.layer.constructor.name == "ImageMosaic") {
          _self.viewer.imageryLayers.remove(layerListItem.imageMosaicImageryLayer);
        }
        else {
          _self.viewer.imageryLayers.remove(layerListItem.layer, false);
        }
        var layerOnTop = _self.viewer.imageryLayers.get(_self.viewer.imageryLayers.length-1);
        if (layerOnTop.isBaseLayer() == false) {
          _self.layerOnTop = layerOnTop;
          for (var i=0; i<_self.items.length; i++) {
            if (_self.items[i].layer.imageryProvider == layerOnTop._imageryProvider) {
              _self.addLegend(_self.items[i]);
              if (_self.items[i].layer.constructor.name == "ImageMosaic")
                _self.items[i].layer.setClockAndTimeline();
              else
                _self.useCase.resetClockAndTimeline();
            }
          }
        }
        else {
          _self.layerOnTop = undefined;
          _self.useCase.resetClockAndTimeline();
        }
      }
      else {
        for (var i=0; i<_self.viewer.imageryLayers.length; i++) {
          if (_self.viewer.imageryLayers._layers[i].isBaseLayer() == true)
            _self.viewer.imageryLayers.remove(_self.viewer.imageryLayers._layers[i], false);
        }
        _self.viewer.imageryLayers.add(layerListItem.layer, 0);
      }
    });
  };

  return LayerList;
});
