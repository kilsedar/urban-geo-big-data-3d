define([], function () {
  "use strict";

  var LocationSwitcher = function (parentId, id) {
    this.items = [];
    this.parentId = parentId;
    this.id = id;

    var locationSwitcher = $("<div></div>");
    locationSwitcher.attr("id", this.id);

    var button = $("<button></button>");
    button.attr("id", "dropdownMenuButton");
    button.addClass("btn btn-secondary dropdown-toggle");
    button.html("location");
    button.attr("type", "button");
    button.attr("data-toggle", "dropdown");
    button.attr("aria-haspopup", "true");
    button.attr("aria-expanded", "false");

    var dropdownMenu = $("<div></div>");
    dropdownMenu.attr("id", "dropdown-menu");
    dropdownMenu.addClass("dropdown-menu");
    dropdownMenu.attr("aria-labelledby", "dropdownMenuButton");

    locationSwitcher.append(button);
    locationSwitcher.append(dropdownMenu);
    $("#"+this.parentId).append(locationSwitcher);
  };

  LocationSwitcher.prototype.add = function (locationSwitcherItem) {
    this.items.push(locationSwitcherItem);
    var item = $("<a></a>");
    item.attr("id", locationSwitcherItem.id);
    item.addClass("dropdown-item");
    item.attr("href", "#");
    item.html(locationSwitcherItem.text);
    $("#dropdown-menu").append(item);

    $("#"+this.parentId).on("click", "#"+locationSwitcherItem.id, function() {
      locationSwitcherItem.layer.add(locationSwitcherItem.viewer);
      locationSwitcherItem.layer.boundingBox = [9.16479, 45.4553, 9.19573, 45.4802];
      locationSwitcherItem.viewer.navigator.tilt = 50;
      locationSwitcherItem.layer.zoom();
    });
  }

  return LocationSwitcher;
});
