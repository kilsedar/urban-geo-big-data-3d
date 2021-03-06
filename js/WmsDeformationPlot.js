define(["vendor/plotly-latest.min", "jquery"], function (Plotly, $) {
  "use strict";

  var WmsDeformationPlot = function (viewer) {
    this.viewer = viewer;
    this.listener;
  };

  WmsDeformationPlot.prototype.addListener = function (property) {
    var viewerContainerId = $(this.viewer.container).attr("id");
    var _self = this;

    function listener (event) {
      var mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);

      var pickRay = _self.viewer.camera.getPickRay(mousePosition);
      var featuresPromise = _self.viewer.imageryLayers.pickImageryLayerFeatures(pickRay, _self.viewer.scene);

      if (Cesium.defined(featuresPromise)) {
        Cesium.when(featuresPromise, function(features) {
          $.ajax({
            url: "https://ugbd.get-it.it/proxy/?proxyTo=" + features[0].properties[property] + "&outputFormat=application/json",
            success: function(json) {
              var data = [
                {
                  x: json.features[0].properties.date_ts.split(";"),
                  y: json.features[0].properties.vel_ts.split(";"),
                  fill: "tozeroy",
                  fillcolor: "#ffa500",
                  line: {
                    color: "#ff9400"
                  }
                }
              ];
              var layout = {
                title: {
                  text: "Mean deformation velocity is " + features[0].properties["vel"] + " cm/year.",
                  font: {
                    size: 16
                  },
                  x: 0.034
                },
                xaxis: {
                  title: "time"
                },
                yaxis: {
                  title: "deformation (cm)"
                },
                margin: {
                  l: 40,
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

              var widthPercentage = 60;

              var gd3 = d3.select("#" + viewerContainerId)
                  .append("div")
                  .style({
                      width: widthPercentage + "%",
                      "margin-left": (100 - widthPercentage) / 2 + "%",
                      height: "200px"
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
            },
            error: function() {
              console.log("There is an error.");
            }
          });
        });
      }
      /* else
        alert("You didn't click on a feature."); */
    }
    this.viewer.canvas.addEventListener("click", listener);
    this.listener = listener;
  };

  WmsDeformationPlot.prototype.removeListener = function () {
    this.viewer.canvas.removeEventListener("click", this.listener);
  };

  return WmsDeformationPlot;
});
