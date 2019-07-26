define(["jquery"], function ($) {
  "use strict";

  var WcpsProcessing = function (viewer, layerList) {
    this.viewer = viewer;
    this.layerList = layerList;
  };

  WcpsProcessing.prototype.getGlc30ClassificationCode = function (classification) {
    var code = "";
    if (classification == "cultivated land")
      code = "10";
    else if (classification == "forest")
      code = "20";
    else if (classification == "grassland")
      code = "30";
    else if (classification == "shrubland")
      code = "40";
    else if (classification == "wetland")
      code = "50";
    else if (classification == "water body")
      code = "60";
    else if (classification == "tundra")
      code = "70";
    else if (classification == "artificial surface")
      code = "80";
    else if (classification == "bare land")
      code = "90";
    else if (classification == "permanent snow and ice")
      code = "100";

    return code;
  }

  WcpsProcessing.prototype.getGhsClassificationCode = function (classification) {
    var code = "";
    if (classification == "settled")
      code = "101";
    else if (classification == "unsettled")
      code = "1";

    return code;
  }

  WcpsProcessing.prototype.getIspraBuClassificationCode = function (classification) {
    var code = "";
    if (classification == "built-up")
      code = "1";
    else if (classification == "not built-up")
      code = "2";

    return code;
  }

  WcpsProcessing.prototype.calculateBounds = function (x1, x2, y1, y2, xMin, xMax, yMin, yMax) {
    if (x1 < xMin)
      x1 = xMin;
    if (x2 > xMax)
      x2 = xMax;
    if (y1 < yMin)
      y1 = yMin;
    if (y2 > yMax)
      y2 = yMax;

    return [x1, x2, y1, y2];
  }

  WcpsProcessing.prototype.process = function (result1, result2) {
    var processingResult = ((result2-result1)/result1*100).toFixed(5);
    if (processingResult == "NaN")
      processingResult = "0";
    this.viewer.selectedEntity = new Cesium.Entity({
      name: "Processing Result",
      description: "The amount of change is " + processingResult + "%."
    });
  }

  WcpsProcessing.prototype.detectChange = function (lulcFirstYear, lulcSecondYear, lulcClass, x1, x2, y1, y2) {
    if (this.layerList.layerOnTop != undefined) {
      var _self = this;
      var result1, result2;
      var xMin, xMax, yMin, yMax, bounds;
      if (_self.layerList.layerOnTop._imageryProvider._layer == "ugbd:glc30_mosaic") {
        xMin = 737762.1329;
        xMax = 2061551.2702;
        yMin = 4231094.5345;
        yMax = 5957062.8874;
        bounds = _self.calculateBounds(x1, x2, y1, y2, xMin, xMax, yMin, yMax);
        $.when(
          $.get('http://localhost:8081/rasdaman/ows?query=for $c in (glc30_2000_2010) return encode(count($c[X(' + bounds[0] + ':' + bounds[1] + '), Y(' + bounds[2] + ':' + bounds[3] + '), ansi("' + lulcFirstYear + '-01-01T00:00:00.000Z")]=' + _self.getGlc30ClassificationCode(lulcClass) + '), "text/csv")', function(result) {
            result1 = result;
          }),
          $.get('http://localhost:8081/rasdaman/ows?query=for $c in (glc30_2000_2010) return encode(count($c[X(' + bounds[0] + ':' + bounds[1] + '), Y(' + bounds[2] + ':' + bounds[3] + '), ansi("' + lulcSecondYear + '-01-01T00:00:00.000Z")]=' + _self.getGlc30ClassificationCode(lulcClass) + '), "text/csv")', function(result) {
            result2 = result;
          })
        ).then(function() {
          _self.process(result1, result2);
        });
      }
      else if (_self.layerList.layerOnTop._imageryProvider._layer == "ugbd:ghs_mosaic") {
        xMin = 737762;
        xMax = 2061574.8929;
        yMin = 4231076.6828;
        yMax = 5957063;
        bounds = _self.calculateBounds(x1, x2, y1, y2, xMin, xMax, yMin, yMax);
        $.when(
          $.get('http://localhost:8081/rasdaman/ows?query=for $c in (ghs_1975_1990_2000_2014) return encode(count($c[X(' + bounds[0] + ':' + bounds[1] + '), Y(' + bounds[2] + ':' + bounds[3] + '), ansi("' + lulcFirstYear + '-01-01T00:00:00.000Z")]=' + _self.getGhsClassificationCode(lulcClass) + '), "text/csv")', function(result) {
            result1 = result;
          }),
          $.get('http://localhost:8081/rasdaman/ows?query=for $c in (ghs_1975_1990_2000_2014) return encode(count($c[X(' + bounds[0] + ':' + bounds[1] + '), Y(' + bounds[2] + ':' + bounds[3] + '), ansi("' + lulcSecondYear + '-01-01T00:00:00.000Z")]=' + _self.getGhsClassificationCode(lulcClass) + '), "text/csv")', function(result) {
            result2 = result;
          })
        ).then(function() {
          _self.process(result1, result2);
        });
      }
      else if (_self.layerList.layerOnTop._imageryProvider._layer == "ugbd:ispra_bu_mosaic") {
        xMin = 727890.719;
        xMax = 2122177.39401;
        yMin = 4190273.66833199961887541136;
        yMax = 5964333.5071;
        bounds = _self.calculateBounds(x1, x2, y1, y2, xMin, xMax, yMin, yMax);
        $.when(
          $.get('http://localhost:8081/rasdaman/ows?query=for $c in (ispra_bu_2012_2015_2016_2017) return encode(count($c[X(' + bounds[0] + ':' + bounds[1] + '), Y(' + bounds[2] + ':' + bounds[3] + '), ansi("' + lulcFirstYear + '-01-01T00:00:00.000Z")]=' + _self.getIspraBuClassificationCode(lulcClass) + '), "text/csv")', function(result) {
            result1 = result;
          }),
          $.get('http://localhost:8081/rasdaman/ows?query=for $c in (ispra_bu_2012_2015_2016_2017) return encode(count($c[X(' + bounds[0] + ':' + bounds[1] + '), Y(' + bounds[2] + ':' + bounds[3] + '), ansi("' + lulcSecondYear + '-01-01T00:00:00.000Z")]=' + _self.getIspraBuClassificationCode(lulcClass) + '), "text/csv")', function(result) {
            result2 = result;
          })
        ).then(function() {
          _self.process(result1, result2);
        });
      }
    }
  };

  return WcpsProcessing;
});
