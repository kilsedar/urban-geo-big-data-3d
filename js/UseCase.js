define([], function () {
  "use strict";

  var UseCase = function (viewer, id, text, tooltip, active) {
    this.viewer = viewer;
    this.id = id;
    this.text = text;
    this.tooltip = tooltip;
    this.active = active;
    if ($(this.viewer.canvas).parent().attr('id') != undefined)
      this.viewerContainerId = $(this.viewer.canvas).parent().attr('id');
    else
      this.viewerContainerId = $(this.viewer.container).attr("id");
    this.animationContainer = $("#"+this.viewerContainerId+ " .cesium-viewer-animationContainer");
  };

  UseCase.prototype.resetClockAndTimeline = function () {
    var now = new Cesium.JulianDate.now;
    var stop = new Cesium.JulianDate.addDays(now, 1, new Cesium.JulianDate());

    var clock = this.viewer.clock;
    clock.currentTime = now;
    clock.startTime = now;
    clock.stopTime = stop;
    clock.multiplier = 1.0;
    clock.clockRange = Cesium.ClockRange.UNBOUNDED;
    clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;

    this.viewer.timeline.zoomTo(now, stop);
  };

  return UseCase;
});
