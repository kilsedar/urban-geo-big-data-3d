define([], function () {
  "use strict";

  var WebMap3DCityDBKml = function (webMap3DCityDB) {
    this.webMap3DCityDB = webMap3DCityDB;
  };

  WebMap3DCityDBKml.prototype.add = function (viewer, webMap3DCityDBKmlLayer) {
    var _self = this;

    var observable = Cesium.knockout.getObservable(viewer, '_selectedEntity');
    observable.subscribe(function(entity) {
      if (!Cesium.defined(entity)) {
        var layers = _self.webMap3DCityDB._layers;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].active)
            layers[i].unHighlightAllObjects();
        }
      }
    });

    var dataLayer = new CitydbKmlLayer({
      url: webMap3DCityDBKmlLayer.url + "milan_collada_MasterJSON.json",
      cityobjectsJsonUrl: webMap3DCityDBKmlLayer.url + "milan.json",
      thematicDataUrl: webMap3DCityDBKmlLayer.thematicDataUrl,
      minLodPixels: "",
      maxLodPixels: "",
      maxSizeOfCachedTiles: 200,
      maxCountOfVisibleTiles: 200
    });

    dataLayer.highlightColor = new Cesium.Color(0.0, 0.3, 0.0, 1.0);
    dataLayer.mouseOverhighlightColor = new Cesium.Color(0.4, 0.4, 0.0, 1.0);

    Cesium.when(this.webMap3DCityDB.addLayer(dataLayer), function(loadedCityDBLayer){
      _self.addEventListeners(loadedCityDBLayer);
    });
  };

  WebMap3DCityDBKml.prototype.removeAll = function () {
    var layers = this.webMap3DCityDB._layers;
    for (var i = 0; i < layers.length; i++) {
      this.webMap3DCityDB.removeLayer(layers[i].id);
    }
  };

  WebMap3DCityDBKml.prototype.addEventListeners = function (layer) {
    var _self = this;
    layer.registerEventHandler("CLICK", function (object) {
      var objectId;
      var targetEntity;
      if (layer instanceof CitydbKmlLayer) {
        targetEntity = object.id;
        objectId = targetEntity.name;
      }
      else if (layer instanceof Cesium3DTilesDataLayer) {
        if (!(object._content instanceof Cesium.Batched3DModel3DTileContent))
          return;

        var idArray = object._batchTable.batchTableJson.id;
        if (!Cesium.defined(idArray))
          return;
        var objectId = idArray[object._batchId];

        targetEntity = new Cesium.Entity({
          id: objectId
        });
        cesiumViewer.selectedEntity = targetEntity;
      }

      _self.createInfoTable(objectId, targetEntity, layer);
    });
  };

  WebMap3DCityDBKml.prototype.createInfoTable = function (gmlId, cesiumEntity, cityDBLayer) {
    var thematicDataUrl = cityDBLayer.thematicDataUrl;
    cesiumEntity.description = "Loading feature information...";

    this.fetchDataFromGoogleFusionTable(gmlId, thematicDataUrl).then(function (kvp) {
      var html = '<table class="cesium-infoBox-defaultTable" style="font-size:10.5pt"><tbody>';
      for (var key in kvp) {
        html += '<tr><td>' + key + '</td><td>' + kvp[key] + '</td></tr>';
      }
      html += '</tbody></table>';

      cesiumEntity.description = html;
    }).otherwise(function (error) {
      cesiumEntity.description = 'No feature information found.';
    });
  };

  WebMap3DCityDBKml.prototype.fetchDataFromGoogleFusionTable = function (gmlId, thematicDataUrl) {
    var kvp = {};
    var deferred = Cesium.when.defer();

    var tableID = CitydbUtil.parse_query_string('docid', thematicDataUrl);
    var sql = "SELECT * FROM " + tableID + " WHERE GMLID = '" + gmlId + "'";
    var apiKey = "AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ";

    Cesium.Resource.fetchJson({url: "https://www.googleapis.com/fusiontables/v2/query?", queryParameters: {sql: sql, key: apiKey}}).then(function (data) {
      var columns = data.columns;
      var rows = data.rows;
      for (var i = 0; i < columns.length; i++) {
        var key = columns[i];
        var value = rows[0][i];
        kvp[key] = value;
      }
      deferred.resolve(kvp);
    }).otherwise(function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  return WebMap3DCityDBKml;
});
