define(["js/LayerSwitcher"], function (LayerSwitcher) {
  "use strict";

  /* This class is written for Cesium and imagery only, as a result it will work only for LULC use case. */
  var LayerSwitcherItem = function (viewerType, viewer, id, text, type, layer, boundingBox, range, legendURL) {
    this.viewerType = viewerType;
    this.viewer = viewer;
    this.id = id;
    this.text = text;
    this.type = type;
    this.layer = layer;
    this.boundingBox = boundingBox;
    this.range = range;
    this.legendURL = legendURL;
  };

  LayerSwitcherItem.prototype.add = function (items) {
    $("#"+this.id).addClass("dropdown-toggle");
    var dropdownMenu = $("<div></div>");
    dropdownMenu.addClass("dropdown-menu");

    for (var i=0; i<items.length; i++) {
      var item = $("<a></a>");
      item.attr("id", this.id+"-"+items[i].text);
      item.addClass("dropdown-item");
      item.attr("href", "#");
      item.html(items[i].text);
      dropdownMenu.append(item);
    }

    $("#"+this.id).append(dropdownMenu);

    $("#"+this.id).hover(
      function() {
        dropdownMenu.addClass("show");
      }, function() {
        dropdownMenu.removeClass("show");
      }
    );

    var viewerContainerId = $(this.viewer.container).attr("id");
    var _self = this;
    $("#"+this.id+" .dropdown-item").click(function(event) {
      if (_self.viewer.imageryLayers.length == 1)
        _self.viewer.imageryLayers.addImageryProvider(_self.layer);
      if ($("#"+viewerContainerId+" .legend").length == 0 && _self.legendURL != undefined) {
        var legend = $("<div></div>");
        legend.addClass("legend");

        var legendImage = $("<img>");
        legendImage.attr("src", _self.legendURL);

        legend.append(legendImage);
        $("#"+viewerContainerId).append(legend);
        
        setTimeout(function() {
          if ($("#"+viewerContainerId+" .legend").prop("scrollHeight")+126 > $(window).height()) {
            $("#"+viewerContainerId+" .legend").css("height", $(window).height()-126 + "px");
            $("#"+viewerContainerId+" .legend").css("width", $("#"+viewerContainerId+" .legend img").width()+10 + "px");
          }
          else {
            $("#"+viewerContainerId+" .legend").css("height", "auto");
            $("#"+viewerContainerId+" .legend").css("width", "auto");
          }
        }, 100);
      }


       for (var i=0; i<items.length; i++) {
         if (items[i].text == $(this).attr("id").split(_self.id+"-")[1]) {
           var heading = Cesium.Math.toRadians(0.0);
           var pitch = Cesium.Math.toRadians(-50.0);

           _self.viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees((items[i].boundingBox[0]+items[i].boundingBox[2])/2, (items[i].boundingBox[1]+items[i].boundingBox[3])/2), new Cesium.HeadingPitchRange(heading, pitch, 90000.0));
           _self.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

           $(".dropdown-menu").removeClass("show");

           event.stopPropagation();
           event.preventDefault();
         }
       }
    });
  }

  return LayerSwitcherItem;
});
