define(["jquery"], function ($) {
  "use strict";

  var Switcher = function (viewerContainerId, id) {
    this.items = [];
    this.viewerContainerId = viewerContainerId;
    this.id = id;
    this.dropdownMenuButtonId = this.id + "-menu-button";
    this.dropdownMenuId = this.id + "-menu";

    var switcher = $("<div></div>");
    switcher.attr("id", this.id);
    switcher.addClass("switcher");

    var button = $("<button></button>");
    button.attr("id", this.dropdownMenuButtonId);
    button.addClass("btn btn-secondary dropdown-toggle");
    button.html("location");
    button.attr("type", "button");
    button.attr("data-toggle", "dropdown");

    var dropdownMenu = $("<div></div>");
    dropdownMenu.attr("id", this.dropdownMenuId);
    dropdownMenu.addClass("dropdown-menu");

    switcher.append(button);
    switcher.append(dropdownMenu);
    $("#"+this.viewerContainerId).append(switcher);
  };

  Switcher.prototype.styleLegend = function () {
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

  Switcher.prototype.add = function (switcherItem) {
    this.items.push(switcherItem);

    var item = $("<a></a>");
    item.attr("id", switcherItem.id);
    item.addClass("dropdown-item");
    item.attr("href", "#");
    item.html(switcherItem.text);
    $("#" + this.dropdownMenuId).append(item);

    var _self = this;

    $("#"+this.viewerContainerId).on("click", "#"+switcherItem.id, function() {
      $("#"+_self.dropdownMenuButtonId).html(switcherItem.text);

      $("#"+_self.viewerContainerId+" #legend-"+switcherItem.id).remove();
      if (switcherItem.legendURL != undefined) {
        var legend = $("<div></div>");
        legend.attr("id", "legend-"+switcherItem.id);
        legend.addClass("legend");

        var legendImage = $("<img>");
        legendImage.attr("src", switcherItem.legendURL);

        legend.append(legendImage);
        $("#"+_self.viewerContainerId).append(legend);

        setTimeout(function() {
          _self.styleLegend();
        }, 100);
      }

      if (switcherItem.viewerType == "world-wind") {
        if (switcherItem.layer != undefined) {
          for (var i=0; i<_self.items.length; i++) {
            switcherItem.viewer.removeLayer(_self.items[i].layer.renderableLayer);
          }
          switcherItem.layer.add(switcherItem.viewer);
        }
        switcherItem.layer.boundingBox = switcherItem.boundingBox;
        switcherItem.viewer.navigator.tilt = 50;
        switcherItem.layer.zoom();
      }
      else {
        if (switcherItem.layer != undefined) {
          if (switcherItem.type == "imagery") {
            for (var i=0; i<switcherItem.viewer.imageryLayers.length; i++) {
              if (switcherItem.viewer.imageryLayers._layers[i].isBaseLayer() == false)
                switcherItem.viewer.imageryLayers.remove(switcherItem.viewer.imageryLayers._layers[i]);
            }
            switcherItem.viewer.imageryLayers.addImageryProvider(switcherItem.layer);
          }
          else if (switcherItem.type == "kml") {
            switcherItem.layer.webMap3DCityDBKml.removeAll();
            switcherItem.layer.webMap3DCityDBKml.add(switcherItem.viewer, switcherItem.layer);
          }
        }
        var heading = Cesium.Math.toRadians(0.0);
        var pitch = Cesium.Math.toRadians(-50.0);
        var range = switcherItem.range;
        switcherItem.viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees((switcherItem.boundingBox[0]+switcherItem.boundingBox[2])/2, (switcherItem.boundingBox[1]+switcherItem.boundingBox[3])/2), new Cesium.HeadingPitchRange(heading, pitch, range));
        switcherItem.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      }
    });
  }

  return Switcher;
});
