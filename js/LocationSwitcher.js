define([], function () {
  "use strict";

  var LocationSwitcher = function (parentId, id) {
    this.items = [];
    this.parentId = parentId;
    this.id = id;
    this.dropdownMenuButtonId = this.id + "-menu-button";
    this.dropdownMenuId = this.id + "-menu";

    var locationSwitcher = $("<div></div>");
    locationSwitcher.attr("id", this.id);
    locationSwitcher.addClass("location-switcher");

    var button = $("<button></button>");
    button.attr("id", this.dropdownMenuButtonId);
    button.addClass("btn btn-secondary dropdown-toggle");
    button.html("location");
    button.attr("type", "button");
    button.attr("data-toggle", "dropdown");

    var dropdownMenu = $("<div></div>");
    dropdownMenu.attr("id", this.dropdownMenuId);
    dropdownMenu.addClass("dropdown-menu");

    locationSwitcher.append(button);
    locationSwitcher.append(dropdownMenu);
    $("#"+this.parentId).append(locationSwitcher);
  };

  LocationSwitcher.prototype.add = function (locationSwitcherItem) {
    var item = $("<a></a>");
    item.attr("id", locationSwitcherItem.id);
    item.addClass("dropdown-item");
    item.attr("href", "#");
    item.html(locationSwitcherItem.text);
    $("#" + this.dropdownMenuId).append(item);

    var _self = this;

    $("#"+this.parentId).on("click", "#"+locationSwitcherItem.id, function() {
      $("#" + _self.dropdownMenuButtonId).html(locationSwitcherItem.text);

      if (locationSwitcherItem.viewerType == "world-wind") {
        for (var i=0; i<_self.items.length; i++) {
          locationSwitcherItem.viewer.removeLayer(_self.items[i].layer.renderableLayer);
        }

        locationSwitcherItem.layer.add(locationSwitcherItem.viewer);
        locationSwitcherItem.layer.boundingBox = locationSwitcherItem.boundingBox;
        locationSwitcherItem.viewer.navigator.tilt = 50;
        locationSwitcherItem.layer.zoom();
        _self.items.push(locationSwitcherItem);
      }
      else {
        locationSwitcherItem.viewer.imageryLayers.addImageryProvider(locationSwitcherItem.layer);
        /* var heading = Cesium.Math.toRadians(0.0);
        var pitch = Cesium.Math.toRadians(-50.0);
        var range = 40000.0;
        locationSwitcherItem.viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees(locationSwitcherItem.boundingBox[0], locationSwitcherItem.boundingBox[1]), new Cesium.HeadingPitchRange(heading, pitch, range)); */
        /* locationSwitcherItem.viewer.camera.flyTo({
          destination : Cesium.Cartesian3.fromDegrees(locationSwitcherItem.boundingBox[0], locationSwitcherItem.boundingBox[1], 60000.0),
          orientation : {
            heading : 0.0,
            pitch : Cesium.Math.toRadians(-50.0),
            roll : 0.0
          }
        }); */
        /* locationSwitcherItem.viewer.camera.setView({
          destination : Cesium.Rectangle.fromDegrees(locationSwitcherItem.boundingBox[0], locationSwitcherItem.boundingBox[1], locationSwitcherItem.boundingBox[2], locationSwitcherItem.boundingBox[3]),
          orientation : {
            heading : Cesium.Math.toRadians(0.0),
            pitch : Cesium.Math.toRadians(-50.0),
            roll : 0.0
          }
        }); */
        /* _self.items.push(locationSwitcherItem);
        setTimeout(function(){
          locationSwitcherItem.viewer.imageryLayers.remove(_self.items[0].layer);
          console.log(_self.items[0]);
          console.log("removed");
        }, 180000); */
        /* for (var i=0; i<_self.items.length; i++) {
          locationSwitcherItem.viewer.imageryLayers.remove(_self.items[i].layer);
        } */
      }
    });
  }

  return LocationSwitcher;
});
