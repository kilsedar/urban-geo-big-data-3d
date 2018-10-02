define(["jquery"], function ($) {
  "use strict";

  var LayerSwitcher = function (viewerContainerId, id, text) {
    this.items = [];
    this.viewerContainerId = viewerContainerId;
    this.id = id;
    this.text = text;
    this.dropdownMenuButtonId = this.id + "-menu-button";
    this.dropdownMenuId = this.id + "-menu";

    var layerSwitcher = $("<div></div>");
    layerSwitcher.attr("id", this.id);
    layerSwitcher.addClass("location-switcher");

    var button = $("<button></button>");
    button.attr("id", this.dropdownMenuButtonId);
    button.addClass("btn btn-secondary dropdown-toggle");
    button.html(this.text);
    button.attr("type", "button");
    button.attr("data-toggle", "dropdown");

    var dropdownMenu = $("<div></div>");
    dropdownMenu.attr("id", this.dropdownMenuId);
    dropdownMenu.addClass("dropdown-menu");

    layerSwitcher.append(button);
    layerSwitcher.append(dropdownMenu);
    $("#"+this.viewerContainerId).append(layerSwitcher);
  };

  LayerSwitcher.prototype.add = function (layerSwitcherItem) {
    var item = $("<a></a>");
    item.attr("id", layerSwitcherItem.id);
    item.addClass("dropdown-item");
    item.attr("href", "#");
    item.html(layerSwitcherItem.text);
    $("#" + this.dropdownMenuId).append(item);

    var _self = this;

    $("#"+this.viewerContainerId).on("click", "#"+layerSwitcherItem.id, function() {
      $("#"+_self.dropdownMenuButtonId).html(layerSwitcherItem.text);

      if (layerSwitcherItem.viewerType == "world-wind") {
        for (var i=0; i<_self.items.length; i++) {
          layerSwitcherItem.viewer.removeLayer(_self.items[i].layer.renderableLayer);
        }

        layerSwitcherItem.layer.add(layerSwitcherItem.viewer);
        layerSwitcherItem.layer.boundingBox = layerSwitcherItem.boundingBox;
        layerSwitcherItem.viewer.navigator.tilt = 50;
        layerSwitcherItem.layer.zoom();
        _self.items.push(layerSwitcherItem);
      }
      else {
        if (layerSwitcherItem.type == "imagery") {
          // Following may not always work, as it assumes base layer will always be in index 0.
          for (var i=1; i<layerSwitcherItem.viewer.imageryLayers.length; i++) {
            layerSwitcherItem.viewer.imageryLayers.remove(layerSwitcherItem.viewer.imageryLayers._layers[i], true);
          }
          layerSwitcherItem.viewer.imageryLayers.addImageryProvider(layerSwitcherItem.layer);
        }
        else if (layerSwitcherItem.type == "entities")
          layerSwitcherItem.layer.add(layerSwitcherItem.viewer);
        else if (layerSwitcherItem.type == "kml") {
          layerSwitcherItem.layer.webMap3DCityDBKml.removeAll();
          layerSwitcherItem.layer.webMap3DCityDBKml.add(layerSwitcherItem.viewer, layerSwitcherItem.layer);
        }
        var heading = Cesium.Math.toRadians(0.0);
        var pitch = Cesium.Math.toRadians(-50.0);
        var range = layerSwitcherItem.range;
        layerSwitcherItem.viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees((layerSwitcherItem.boundingBox[0]+layerSwitcherItem.boundingBox[2])/2, (layerSwitcherItem.boundingBox[1]+layerSwitcherItem.boundingBox[3])/2), new Cesium.HeadingPitchRange(heading, pitch, range));
        layerSwitcherItem.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

        _self.items.push(layerSwitcherItem);
      }
    });
  }

  return LayerSwitcher;
});
