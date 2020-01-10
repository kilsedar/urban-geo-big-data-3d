define(["jquery", "bootstrap"], function ($, bootstrap) {
  "use strict";

  var Header = function (backgroundColor, highlightColor) {
    this.backgroundColor = backgroundColor;
    this.highlightColor = highlightColor;
    this.useCases = [];

    var header = $("<div></div>");
    header.attr("id", "header");
    $("body").append(header);

    var _self = this;
    $("body").on("click", ".use-case-button", function() {
      var clickedUseCaseButtonId = $(this).attr("id");
      var activeViewerContainerId = "";
      for (var i=0; i<_self.useCases.length; i++) {
        if (_self.useCases[i].id == clickedUseCaseButtonId) {
          _self.useCases[i].active = true;
          $("#"+_self.useCases[i].id).css("background-color", _self.highlightColor);
          activeViewerContainerId = _self.useCases[i].viewerContainerId;
        }
        else {
          _self.useCases[i].active = false;
          $("#"+_self.useCases[i].id).css("background-color", _self.backgroundColor);
        }
      }
      for (var i = 0; i < _self.useCases.length; i++) {
        if (_self.useCases[i].viewerContainerId != activeViewerContainerId) {
          $("#"+_self.useCases[i].viewerContainerId).css("display", "none");
          $("#"+_self.useCases[i].viewerContainerId+" .cesium-viewer-animationContainer").remove();
        }
        else {
          $("#"+_self.useCases[i].viewerContainerId).css("display", "block");
          $("#"+_self.useCases[i].viewerContainerId+" .cesium-viewer").append(_self.useCases[i].animationContainer);
        }
      }
    });
  };

  Header.prototype.addUseCase = function (useCase) {
    this.useCases.push(useCase);
    var useCaseButtonWidth = 100/this.useCases.length;

    var useCaseButton = $("<div></div>");
    useCaseButton.attr("id", useCase.id);
    useCaseButton.addClass("use-case-button");
    if (useCase.active == false)
      useCaseButton.css("background-color", this.backgroundColor);
    else
      useCaseButton.css("background-color", this.highlightColor);
    useCaseButton.html(useCase.text);
    useCaseButton.attr("data-toggle", "tooltip");
    useCaseButton.attr("title", useCase.tooltip);

    $("#header").append(useCaseButton);
    $(".use-case-button").css("width", useCaseButtonWidth + "vw");
    for (var i = 0; i < this.useCases.length; i++) {
      $(".use-case-button").eq(i).css("left", 100-useCaseButtonWidth*(this.useCases.length-i) + "vw");
    }
  };

  return Header;
});
