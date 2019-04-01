var milanFloodRiskLegend = $("<div></div>");
milanFloodRiskLegend.attr("id", "legend-milan-flood-risk");
milanFloodRiskLegend.addClass("legend legend-JS");

var milanFloodRiskLegendTitle = $("<h6>Flood Risk</h6>");
milanFloodRiskLegendTitle.attr("id", "legend-milan-flood-risk-title");
milanFloodRiskLegend.append(milanFloodRiskLegendTitle);

/***
Moderate or none
***/
var classModerateOrNone = $("<div></div>");

var textModerateOrNone = $("<p></p>");
textModerateOrNone.addClass("legend-text");
textModerateOrNone.text("Moderate or none");

var colorBoxModerateOrNone = $("<div></div>");
colorBoxModerateOrNone.addClass("color-box");
colorBoxModerateOrNone.css("background-color", "#fee5d9");

classModerateOrNone.append(textModerateOrNone);
classModerateOrNone.append(colorBoxModerateOrNone);

milanFloodRiskLegend.append(classModerateOrNone);
/***
***/

/***
Medium
***/
var classMedium = $("<div></div>");

var textMedium = $("<p></p>");
textMedium.addClass("legend-text");
textMedium.text("Medium");

var colorBoxMedium = $("<div></div>");
colorBoxMedium.addClass("color-box");
colorBoxMedium.css("background-color", "#fcae91");

classMedium.append(textMedium);
classMedium.append(colorBoxMedium);

milanFloodRiskLegend.append(classMedium);
/***
***/

/***
High
***/
var classHigh = $("<div></div>");

var textHigh = $("<p></p>");
textHigh.addClass("legend-text");
textHigh.text("High");

var colorBoxHigh = $("<div></div>");
colorBoxHigh.addClass("color-box");
colorBoxHigh.css("background-color", "#fb6a4a");

classHigh.append(textHigh);
classHigh.append(colorBoxHigh);

milanFloodRiskLegend.append(classHigh);
/***
***/

/***
Very high
***/
var classVeryHigh = $("<div></div>");

var textVeryHigh = $("<p></p>");
textVeryHigh.addClass("legend-text");
textVeryHigh.text("Very high");

var colorBoxVeryHigh = $("<div></div>");
colorBoxVeryHigh.addClass("color-box");
colorBoxVeryHigh.css("background-color", "#cb181d");

classVeryHigh.append(textVeryHigh);
classVeryHigh.append(colorBoxVeryHigh);

milanFloodRiskLegend.append(classVeryHigh);
/***
***/
