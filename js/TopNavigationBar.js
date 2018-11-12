define(["jquery", "bootstrap"], function ($, bootstrap) {
  "use strict";

  var TopNavigationBar = function (backgroundColor, highlightColor) {
    this.sections = [];
    this.backgroundColor = backgroundColor;
    this.highlightColor = highlightColor;

    var topNavigationBar = $("<div></div>");
    topNavigationBar.attr("id", "top-navigation-bar");
    $("body").append(topNavigationBar);

    var sections = this.sections, backgroundColor = this.backgroundColor, highlightColor = this.highlightColor;
    $("body").on("click", ".section", function() {
      var clickedSectionId = $(this).attr("id");
      var activeViewerContainerId = "";
      for (var i=0; i<sections.length; i++) {
        if (sections[i].id == clickedSectionId) {
          sections[i].active = true;
          $("#"+sections[i].id).css("background-color", highlightColor);
          activeViewerContainerId = sections[i].viewerContainerId;
        }
        else {
          sections[i].active = false;
          $("#"+sections[i].id).css("background-color", backgroundColor);
        }
      }
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].viewerContainerId != activeViewerContainerId) {
          $("#"+sections[i].viewerContainerId).css("display", "none");
          $("#"+sections[i].viewerContainerId+" .cesium-viewer-animationContainer").remove();
        }
        else {
          $("#"+sections[i].viewerContainerId).css("display", "block");
          $("#"+sections[i].viewerContainerId+" .cesium-viewer").append(sections[i].animationContainer);
        }
      }
    });
  };

  TopNavigationBar.prototype.addSection = function (topSection) {
    this.sections.push(topSection);
    var sectionWidth = 100/this.sections.length;

    var section = $("<div></div>");
    section.attr("id", topSection.id);
    section.html(topSection.text);
    if (topSection.active == false)
      section.css("background-color", this.backgroundColor);
    else
      section.css("background-color", this.highlightColor);
    section.addClass("section");

    section.attr("data-toggle", "tooltip");
    section.attr("title", topSection.tooltip);

    $("#top-navigation-bar").append(section);
    $(".section").css("width", sectionWidth + "vw");
    for (var i = 0; i < this.sections.length; i++) {
      $(".section").eq(i).css("left", 100-sectionWidth*(this.sections.length-i) + "vw");
    }
  }

  return TopNavigationBar;
});
