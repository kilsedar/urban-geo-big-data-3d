define([], function () {
  "use strict";

  var ImageMosaic = function (viewer, url, layerName, dates, boundingBox, timelineMultiplier) {
    this.viewer = viewer;
    this.url = url;
    this.layerName = layerName;
    this.dates = dates;
    this.boundingBox = boundingBox;
    this.timelineMultiplier = timelineMultiplier;
    this.imageryProvider;

    var rectangle = Cesium.Rectangle.fromDegrees(this.boundingBox[0], this.boundingBox[1], this.boundingBox[2], this.boundingBox[3]);

    var dataCallback = function(interval, index) {
      var time;
      if (index === 0)
        time = Cesium.JulianDate.toIso8601(interval.stop);
      else
        time = Cesium.JulianDate.toIso8601(interval.start);

      return {
        Time: time
      };
    };

    var times = Cesium.TimeIntervalCollection.fromIso8601DateArray({
      iso8601Dates: this.dates,
      leadingInterval: true,
      trailingInterval: true,
      isStopIncluded: false,
      dataCallback: dataCallback
    });

    this.imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
      url: this.url,
      layer: this.layerName,
      style: "",
      format: "image/png",
      tileMatrixSetID: "EPSG:900913",
      tileMatrixLabels: ["EPSG:900913:0", "EPSG:900913:1", "EPSG:900913:2", "EPSG:900913:3", "EPSG:900913:4", "EPSG:900913:5", "EPSG:900913:6", "EPSG:900913:7", "EPSG:900913:8", "EPSG:900913:9", "EPSG:900913:10", "EPSG:900913:11", "EPSG:900913:12", "EPSG:900913:13", "EPSG:900913:14", "EPSG:900913:15", "EPSG:900913:16", "EPSG:900913:17", "EPSG:900913:18", "EPSG:900913:19", "EPSG:900913:20", "EPSG:900913:21", "EPSG:900913:22", "EPSG:900913:23", "EPSG:900913:24", "EPSG:900913:25", "EPSG:900913:26", "EPSG:900913:27", "EPSG:900913:28", "EPSG:900913:29", "EPSG:900913:30"],
      clock: this.viewer.clock,
      rectangle: rectangle,
      times: times
    });
  };

  ImageMosaic.prototype.setClockAndTimeline = function () {
    var start = Cesium.JulianDate.fromIso8601(this.dates[0]);
    var stop = Cesium.JulianDate.fromIso8601(this.dates[this.dates.length-1]);

    var clock = this.viewer.clock;
    clock.currentTime = start;
    clock.startTime = start;
    clock.stopTime = stop;
    clock.multiplier = this.timelineMultiplier;
    clock.clockRange = Cesium.ClockRange.CLAMPED;
    clock.clockStep = Cesium.ClockStep.TICK_DEPENDENT;

    this.viewer.timeline.zoomTo(start, stop);
  };

  return ImageMosaic;
});
