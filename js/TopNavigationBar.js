define([], function () {
  "use strict";

  var TopNavigationBar = function (parentId, id, backgroundColor, highlightColor) {
    this.sectionCount = 0;
    this.sections = [];
    this.parentId = parentId;
    this.id = id;
    this.backgroundColor = backgroundColor;
    this.highlightColor = highlightColor;

    var topNavigationBar = $("<div></div>");
    topNavigationBar.attr("id", this.id);
    $("#"+this.parentId).append(topNavigationBar);

    var sections = this.sections, backgroundColor = this.backgroundColor, highlightColor = this.highlightColor;
    $("#"+parentId).on("click", ".section", function() {
      var clickedSectionId = $(this).attr("id");
      var globeId = "";
      for (var i=0; i<sections.length; i++) {
        if (sections[i].id == clickedSectionId) {
          sections[i].active = true;
          $("#"+sections[i].id).css("background-color", highlightColor);
          globeId = sections[i].globeId;
        }
        else {
          sections[i].active = false;
          $("#"+sections[i].id).css("background-color", backgroundColor);
        }
      }
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].globeId != globeId)
          $("#"+sections[i].globeId).css("display", "none");
        else
          $("#"+sections[i].globeId).css("display", "block");
      }
    });
  };

  TopNavigationBar.prototype.incrementSectionCount = function () {
    this.sectionCount += 1;
  }

  TopNavigationBar.prototype.addSection = function (topSection) {
    this.incrementSectionCount();
    this.sections.push(topSection);
    var sectionWidth = 100/this.sectionCount;

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

    $("#"+this.id).append(section);
    $(".section").css("width", sectionWidth + "vw");
    for (var i = 0; i < this.sectionCount; i++) {
      $(".section").eq(i).css("left", 100-sectionWidth*(this.sectionCount-i) + "vw");
    }
  }

  return TopNavigationBar;
});
