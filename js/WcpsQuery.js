define(["vendor/plotly-latest.min", "jquery"], function (Plotly, $) {
  "use strict";

  var WcpsQuery = function (viewer, layerList) {
    this.viewer = viewer;
    this.layerList = layerList;
    this.listener;
  };

  WcpsQuery.prototype.getGlc30ClassificationName = function (code) {
    var classification = "";
    if (code == "10")
      classification = "Cultivated land";
    else if (code == "20")
      classification = "Forest";
    else if (code == "30")
      classification = "Grassland";
    else if (code == "40")
      classification = "Shrubland";
    else if (code == "50")
      classification = "Wetland";
    else if (code == "60")
      classification = "Water body";
    else if (code == "70")
      classification = "Tundra";
    else if (code == "80")
      classification = "Artificial surface";
    else if (code == "90")
      classification = "Bare land";
    else if (code == "100")
      classification = "Permanent snow and ice";

    return classification;
  }

  WcpsQuery.prototype.getIspraLandCoverClassificationName = function (code) {
    var classification = "";
    if (code == "1000")
      classification = "Artificial surfaces";
    else if (code == "2111")
      classification = "Intensive crops";
    else if (code == "2112")
      classification = "Extensive crops";
    else if (code == "2120")
      classification = "Permanently irrigated land";
    else if (code == "2130")
      classification = "Rice fields";
    else if (code == "2210")
      classification = "Vineyards";
    else if (code == "2220")
      classification = "Fruit trees and berry plantations";
    else if (code == "2230")
      classification = "Olive groves";
    else if (code == "2240")
      classification = "Forestry";
    else if (code == "2300")
      classification = "Stable meadows (permanent forage)";
    else if (code == "2410")
      classification = "Annual crops associated with permanent crops";
    else if (code == "2420")
      classification = "Complex cultivation patterns";
    else if (code == "2430")
      classification = "Land principally occupied by agriculture, with significant areas of natural vegetation";
    else if (code == "2440")
      classification = "Agro-forestry areas";
    else if (code == "3110" || code == "3120" || code == "3130" || code == "3140" || code == "3150" || code == "3160" || code == "3170")
      classification = "Woods and areas covered with broad-leaved trees";
    else if (code == "3210" || code == "3220" || code == "3230" || code == "3240" || code == "3250")
      classification = "Woods and areas covered with coniferous trees";
    else if (code == "3311" || code == "3312" || code == "3313" || code == "3314" || code == "3315" || code == "3316" || code == "3317" || code == "3321" || code == "3322" || code == "3323" || code == "3324" || code == "3325")
      classification = "Woods and areas covered with mixed coniferous and broad-leaved trees";
    else if (code == "4100")
      classification = "Natural grasslands";
    else if (code == "4200")
      classification = "Open urban areas";
    else if (code == "4300")
      classification = "Moors and heathland";
    else if (code == "4400")
      classification = "Sclerophyllous vegetation";
    else if (code == "4410")
      classification = "High scrub";
    else if (code == "4420")
      classification = "Low scrub and garrigue";
    else if (code == "4500")
      classification = "Transitional woodland-shrub";
    else if (code == "4600")
      classification = "Open spaces with little or no vegetation";
    else if (code == "4610")
      classification = "Beaches, dunes, sands";
    else if (code == "5000")
      classification = "Wetlands";
    else if (code == "6000")
      classification = "Permanent water bodies";

    return classification;
  }

  WcpsQuery.prototype.addListener = function () {
    var viewerContainerId = $(this.viewer.container).attr("id");
    var _self = this;

    function listener (event) {
      var mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
      var ellipsoid = _self.viewer.scene.globe.ellipsoid;
      var cartographic = ellipsoid.cartesianToCartographic(_self.viewer.camera.pickEllipsoid(mousePosition, ellipsoid));
      var cartesian3857 = new Cesium.WebMercatorProjection(ellipsoid).project(cartographic);
      var x = cartesian3857.x;
      var y = cartesian3857.y;

      if (_self.layerList.layerOnTop != undefined) {
        if (_self.layerList.layerOnTop._imageryProvider._layer == "ugbd:glc30_mosaic") {
          $.ajax({
            url: 'http://localhost:8081/rasdaman/ows?query=for $c in (glc30_2000_2010) return encode($c[X(' + x + '), Y(' + y + '), ansi("2000-01-01T00:00:00.000Z":"2010-01-01T00:00:00.000Z")], "text/csv")',
            success: function(result){
              result = result.split(",");
              if ((result[0] != "0" || result[1] != "0") && $(".cesium-infoBox-visible").length == 0) {
                _self.viewer.selectedEntity = new Cesium.Entity({
                  name: "GlobeLand30 Classes",
                  description: "<b>2000</b>: " + _self.getGlc30ClassificationName(result[0]) + "<br><b>2010</b>: " + _self.getGlc30ClassificationName(result[1])
                });
              }
              /* else
                alert("You clicked outside Italy."); */
            }/* ,
            error: function(){
              alert("You clicked outside Italy.");
            } */
          });
        }
        else if (_self.layerList.layerOnTop._imageryProvider._layer == "ugbd:ghs_mosaic") {
          $.ajax({
            url: 'http://localhost:8081/rasdaman/ows?query=for $c in (ghs_1975_1990_2000_2014) return encode($c[X(' + x + '), Y(' + y + '), ansi("1975-01-01T00:00:00.000Z":"2014-01-01T00:00:00.000Z")], "text/csv")',
            success: function(result){
              result = result.split(",");
              if ((result[0] != "0" || result[1] != "0" || result[2] != "0" || result[3] != "0") && $(".cesium-infoBox-visible").length == 0) {
                for (var i=0; i<result.length; i++) {
                  if (result[i] == "101")
                    result[i] = "settled";
                  else if (result[i] == "1")
                    result[i] = "unsettled";
                }

                var data = [
                  {
                    x: ["1975", "1990", "2000", "2014"],
                    y: result,
                    line: {
                      color: "#ff9400"
                    }
                  }
                ];
                var layout = {
                  xaxis: {
                    title: "time"
                  },
                  margin: {
                    l: 54,
                    r: 4,
                    b: 40,
                    t: 30,
                    pad: 4
                  },
                  plot_bgcolor: "#fff9ef",
                  font: {
                    family: "Do Hyeon"
                  },
                  hoverlabel: {
                    font: {
                      family: "Do Hyeon",
                    }
                  }
                };

                var d3 = Plotly.d3;

                var widthPercentage = 30;

                var gd3 = d3.select("#" + viewerContainerId)
                .append("div")
                .style({
                  width: widthPercentage + "%",
                  "margin-left": (100 - widthPercentage) / 2 + "%",
                  height: "120px"
                });

                var gd = gd3.node();

                $(".js-plotly-plot").remove();
                Plotly.plot(gd, data, layout);

                var modebarGroup = $("<div></div>");
                modebarGroup.addClass("modebar-group");

                var modebarButton = $("<a></a>");
                modebarButton.addClass("modebar-btn");
                modebarButton.attr("rel", "tooltip");
                modebarButton.attr("data-title", "Close");
                modebarButton.attr("data-toggle", "false");
                modebarButton.attr("data-gravity", "n");

                var modebarButtonImage = $("<img>");
                modebarButtonImage.attr("height", "16px");
                modebarButtonImage.attr("width", "16px");
                modebarButtonImage.attr("src", "images/close-small.png");
                modebarButtonImage.css("margin-bottom", "3px");

                modebarButton.append(modebarButtonImage);
                modebarGroup.append(modebarButton);
                $(".modebar").prepend(modebarGroup);

                $("#" + viewerContainerId).on("click", ".modebar .modebar-group:nth-child(1)", function() {
                  $(".js-plotly-plot").remove();
                });

                $("#" + viewerContainerId).on("mouseenter", ".modebar .modebar-group:nth-child(1)", function() {
                  modebarButtonImage.attr("src", "images/close-hover-small.png");
                });

                $("#" + viewerContainerId).on("mouseleave", ".modebar .modebar-group:nth-child(1)", function() {
                  modebarButtonImage.attr("src", "images/close-small.png");
                });

                window.onresize = function() {
                  if ($(".js-plotly-plot").is(":visible"))
                  Plotly.Plots.resize(gd);
                };
              }
              /* else
                alert("You clicked outside Italy."); */
            }/* ,
            error: function(){
              alert("You clicked outside Italy.");
            } */
          });
        }
        else if (_self.layerList.layerOnTop._imageryProvider._layer == "ugbd:ispra_bu_mosaic") {
          $.ajax({
            url: 'http://localhost:8081/rasdaman/ows?query=for $c in (ispra_bu_2012_2015_2016_2017) return encode($c[X(' + x + '), Y(' + y + '), ansi("2012-01-01T00:00:00.000Z":"2017-01-01T00:00:00.000Z")], "text/csv")',
            success: function(result){
              result = result.split(",");
              if ((result[0] != "-nan" || result[1] != "-nan" || result[2] != "-nan" || result[3] != "-nan") && $(".cesium-infoBox-visible").length == 0) {
                for (var i=0; i<result.length; i++) {
                  if (result[i] == "1")
                    result[i] = "built-up";
                  else if (result[i] == "2")
                    result[i] = "not built-up";
                }

                var data = [
                  {
                    x: ["2012", "2015", "2016", "2017"],
                    y: result,
                    line: {
                      color: "#ff9400"
                    }
                  }
                ];
                var layout = {
                  xaxis: {
                    title: "time"
                  },
                  margin: {
                    l: 65,
                    r: 4,
                    b: 40,
                    t: 30,
                    pad: 4
                  },
                  plot_bgcolor: "#fff9ef",
                  font: {
                    family: "Do Hyeon"
                  },
                  hoverlabel: {
                    font: {
                      family: "Do Hyeon",
                    }
                  }
                };

                var d3 = Plotly.d3;

                var widthPercentage = 30;

                var gd3 = d3.select("#" + viewerContainerId)
                .append("div")
                .style({
                  width: widthPercentage + "%",
                  "margin-left": (100 - widthPercentage) / 2 + "%",
                  height: "120px"
                });

                var gd = gd3.node();

                $(".js-plotly-plot").remove();
                Plotly.plot(gd, data, layout);

                var modebarGroup = $("<div></div>");
                modebarGroup.addClass("modebar-group");

                var modebarButton = $("<a></a>");
                modebarButton.addClass("modebar-btn");
                modebarButton.attr("rel", "tooltip");
                modebarButton.attr("data-title", "Close");
                modebarButton.attr("data-toggle", "false");
                modebarButton.attr("data-gravity", "n");

                var modebarButtonImage = $("<img>");
                modebarButtonImage.attr("height", "16px");
                modebarButtonImage.attr("width", "16px");
                modebarButtonImage.attr("src", "images/close-small.png");
                modebarButtonImage.css("margin-bottom", "3px");

                modebarButton.append(modebarButtonImage);
                modebarGroup.append(modebarButton);
                $(".modebar").prepend(modebarGroup);

                $("#" + viewerContainerId).on("click", ".modebar .modebar-group:nth-child(1)", function() {
                  $(".js-plotly-plot").remove();
                });

                $("#" + viewerContainerId).on("mouseenter", ".modebar .modebar-group:nth-child(1)", function() {
                  modebarButtonImage.attr("src", "images/close-hover-small.png");
                });

                $("#" + viewerContainerId).on("mouseleave", ".modebar .modebar-group:nth-child(1)", function() {
                  modebarButtonImage.attr("src", "images/close-small.png");
                });

                window.onresize = function() {
                  if ($(".js-plotly-plot").is(":visible"))
                  Plotly.Plots.resize(gd);
                };
              }
              /* else
                alert("You clicked outside Italy."); */
            }/* ,
            error: function(){
              alert("You clicked outside Italy.");
            } */
          });
        }
        else if (_self.layerList.layerOnTop._imageryProvider._layer == "ugbd:ispra_land_cover_2012") {
          $.ajax({
            url: 'http://localhost:8081/rasdaman/ows?query=for $c in (ispra_land_cover_2012) return encode($c[X(' + x + '), Y(' + y + ')], "text/csv")',
            success: function(result){
              if (result != "65535" && $(".cesium-infoBox-visible").length == 0) {
                _self.viewer.selectedEntity = new Cesium.Entity({
                  name: "ISPRA Land Cover Class",
                  description: _self.getIspraLandCoverClassificationName(result)
                });
              }
              /* else
                alert("You clicked outside Italy."); */
            }/* ,
            error: function(){
              alert("You clicked outside Italy.");
            } */
          });
        }
      }
    }
    this.viewer.canvas.addEventListener("click", listener);
    this.listener = listener;
  };

  WcpsQuery.prototype.removeListener = function () {
    this.viewer.canvas.removeEventListener("click", this.listener);
  };

  return WcpsQuery;
});
