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
    var heightOutsideLegend;
    if (this.viewerContainerId == "cesium-3d-city")
      heightOutsideLegend = 176
    else
      heightOutsideLegend = 130;

     if ($("#"+this.viewerContainerId+" .legend").is(":visible")) {
       if ($("#"+this.viewerContainerId+" .legend:visible").prop("scrollHeight")+heightOutsideLegend > $(window).height()) {
         $("#"+this.viewerContainerId+" .legend:visible").css("height", $(window).height()-heightOutsideLegend+"px");
         $("#"+this.viewerContainerId+" .legend:visible").css("width", "auto");
         $("#"+this.viewerContainerId+" .legend:visible").css("width", $(".legend:visible").width()+24+"px");
       }
       else {
         $("#"+this.viewerContainerId+" .legend:visible").css("height", "auto");
         $("#"+this.viewerContainerId+" .legend:visible").css("width", "auto");
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

  LayerList.prototype.fillWcpsMenu = function () {
    var lulcYears, lulcFirstYear, lulcSecondYear, lulcClasses, lulcClass;
    $("#lulc-first-year-menu-button").html("1st year");
    $("#lulc-second-year-menu-button").html("2nd year");
    $("#lulc-class-menu-button").html("class");
    $("#lulc-first-year, #lulc-second-year, #lulc-class, #lulc-draw-rectangle, #lulc-cogwheel").css("opacity", "1");
    $("#lulc-draw-rectangle, #lulc-cogwheel").attr("disabled", false);
    if (this.layerOnTop.imageryProvider._layer == "ugbd:ghs_mosaic") {
      lulcYears = ["1975", "1990", "2000", "2014"];
      lulcClasses = ["built-up", "not built-up"];
    }
    else if (this.layerOnTop.imageryProvider._layer == "ugbd:ispra_bu_mosaic") {
      lulcYears = ["2012", "2015", "2016", "2017"];
      lulcClasses = ["consumed", "not consumed"];
    }
    else {
      lulcYears = ["2000", "2010"];
      lulcClasses = ["artificial surface", "cultivated land", "bare land", "permanent snow and ice", "forest", "grassland", "tundra", "shrubland", "wetland", "water body"];
    }
    $("#lulc-first-year-menu, #lulc-second-year-menu, #lulc-class-menu").empty();
    for (var i=0; i<lulcYears.length; i++) {
      lulcFirstYear = $("<a></a>");
      lulcFirstYear.attr("id", this.layerOnTop.imageryProvider._layer.split(":")[1].split("_mosaic")[0].replace("_", "-")+"-"+lulcYears[i]+"-1");
      lulcFirstYear.addClass("dropdown-item");
      lulcFirstYear.attr("href", "#");
      lulcFirstYear.html(lulcYears[i]);
      $("#lulc-first-year-menu").append(lulcFirstYear);
      lulcSecondYear = $("<a></a>");
      lulcSecondYear.attr("id", this.layerOnTop.imageryProvider._layer.split(":")[1].split("_mosaic")[0].replace("_", "-")+"-"+lulcYears[i]+"-2");
      lulcSecondYear.addClass("dropdown-item");
      lulcSecondYear.attr("href", "#");
      lulcSecondYear.html(lulcYears[i]);
      $("#lulc-second-year-menu").append(lulcSecondYear);
    }
    for (var i=0; i<lulcClasses.length; i++) {
      lulcClass = $("<a></a>");
      lulcClass.attr("id", this.layerOnTop.imageryProvider._layer.split(":")[1].split("_mosaic")[0].replace("_", "-")+"-"+lulcClasses[i].replace(" ", "-"));
      lulcClass.addClass("dropdown-item");
      lulcClass.attr("href", "#");
      lulcClass.html(lulcClasses[i]);
      $("#lulc-class-menu").append(lulcClass);
    }
  };

  LayerList.prototype.disableWcpsMenu = function () {
    $("#lulc-first-year-menu-button").html("1st year");
    $("#lulc-second-year-menu-button").html("2nd year");
    $("#lulc-class-menu-button").html("class");
    $("#lulc-draw-rectangle").css("background-color", "#303336");
    $("#lulc-first-year, #lulc-second-year, #lulc-class, #lulc-draw-rectangle, #lulc-cogwheel").css("opacity", "0.6");
    $("lulc-draw-rectangle, #lulc-cogwheel").attr("disabled", true);
    $("#lulc-first-year-menu, #lulc-second-year-menu, #lulc-class-menu").empty();
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
        if(_self.layerOnTop.imageryProvider._layer == "ugbd:ghs_mosaic" || _self.layerOnTop.imageryProvider._layer == "ugbd:ispra_bu_mosaic" || _self.layerOnTop.imageryProvider._layer == "ugbd:glc30_mosaic")
          _self.fillWcpsMenu();
        else
          _self.disableWcpsMenu();
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
          if(_self.layerOnTop.imageryProvider._layer == "ugbd:ghs_mosaic" || _self.layerOnTop.imageryProvider._layer == "ugbd:ispra_bu_mosaic" || _self.layerOnTop.imageryProvider._layer == "ugbd:glc30_mosaic")
            _self.fillWcpsMenu();
          else
            _self.disableWcpsMenu();
        }
        else {
          _self.layerOnTop = undefined;
          _self.useCase.resetClockAndTimeline();
          _self.disableWcpsMenu();
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
