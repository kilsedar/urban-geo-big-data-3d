define([], function () {
  "use strict";

  var LandCoverJson = function (classes, colors, url) {
    this.classes = classes;
    this.colors = colors;
    this.url = url;
  };

  LandCoverJson.prototype.isCommentEmpty = function (comment) {
    if (comment == "")
      return "";
    else
      return "<br><b>Comment:</b> " + comment;
  };

  LandCoverJson.prototype.add = function (viewer) {
    for (var i=0; i<this.classes.length; i++) {
      window["dataSource"+this.classes[i].charAt(0).toUpperCase()+this.classes[i].substr(1)] = new Cesium.CustomDataSource("lcPoints"+this.classes[i].charAt(0).toUpperCase()+this.classes[i].substr(1));
      window["dataSource"+this.classes[i].charAt(0).toUpperCase()+this.classes[i].substr(1)].clustering.pixelRange = 20;
      window["dataSource"+this.classes[i].charAt(0).toUpperCase()+this.classes[i].substr(1)].clustering.minimumClusterSize = 2;
      window["dataSource"+this.classes[i].charAt(0).toUpperCase()+this.classes[i].substr(1)].clustering.enabled = true;
      viewer.dataSources.add(window["dataSource"+this.classes[i].charAt(0).toUpperCase()+this.classes[i].substr(1)]);
    }

    var _self = this;

    $.getJSON(this.url, function(json) {
      for (var i=0; i<json.rows.length-1; i++) {
        var classArray = json.rows[i].doc.classification.split(/(?=[A-Z])/);
        var classWord = "";
        var classWords = "";
        for (var j=0; j<classArray.length; j++) {
          if (j==0)
            classWord = classArray[j].charAt(0).toUpperCase()+classArray[j].substr(1);
          else
            classWord = classArray[j].charAt(0).toLowerCase()+classArray[j].substr(1);
          classWords += " " + classWord;
        }
        window["dataSource"+json.rows[i].doc.classification.charAt(0).toUpperCase()+json.rows[i].doc.classification.substr(1)].entities.add({
          position : Cesium.Cartesian3.fromDegrees(json.rows[i].doc.location[1], json.rows[i].doc.location[0]),
          billboard : {
            image : "images/lc/"+json.rows[i].doc.classification+"WhiteBackgroundPin.png",
            width : 30,
            height : 45,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          name: "VGI Land Cover Point",
          description: "<b>Class:</b> " + classWords + "<br><b>Date:</b> " + new Date(json.rows[i].doc.timestamp).toLocaleString() + "<br><b>Certainty of the classification:</b> " + json.rows[i].doc.certainty + _self.isCommentEmpty(json.rows[i].doc.comment)
                       // + "<br><b>Photo of north:</b><br><img src='https://landcover.como.polimi.it/couchdb/lcc_points/" + json.rows[i].doc._id + "/photo-north-thumbnail.jpeg'>"
        });
      }

      var pinBuilder = new Cesium.PinBuilder();

      function customStyle(dataSource) {
        dataSource.clustering.clusterEvent.addEventListener(function(clusteredEntities, cluster) {
          cluster.label.show = false;
          cluster.billboard.show = true;
          cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
          cluster.billboard.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
          cluster.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;

          for (var i=0; i<_self.classes.length; i++) {
            if (dataSource.name == "lcPoints"+_self.classes[i].charAt(0).toUpperCase()+_self.classes[i].substr(1))
              cluster.billboard.image = pinBuilder.fromText(clusteredEntities.length, _self.colors[i], 48).toDataURL();
          }
        });

        var pixelRange = dataSource.clustering.pixelRange;
        dataSource.clustering.pixelRange = 0;
        dataSource.clustering.pixelRange = pixelRange;
      }

      for (var i=0; i<_self.classes.length; i++) {
        customStyle(window["dataSource"+_self.classes[i].charAt(0).toUpperCase()+_self.classes[i].substr(1)]);
      }
    });

    /* viewer.canvas.addEventListener("click", function(e){
      setTimeout(function () {
        var text = $(viewer.infoBox.frame).contents().find("body").text();
        if (text != "") {
          console.log(text);
        }
      }, 1000);
    }, false); */
  };

  return LandCoverJson;
});
