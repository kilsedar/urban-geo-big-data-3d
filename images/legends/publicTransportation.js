var publicTransportationLegend = $("<div></div>");
publicTransportationLegend.addClass("legend");

/***
Bus
***/
var classBus = $("<div></div>");

var textBus = $("<p></p>");
textBus.addClass("legend-text");
textBus.text("Bus");

var colorBoxBus = $("<div></div>");
colorBoxBus.addClass("color-box");
colorBoxBus.css("background-color", "#f4a528");

classBus.append(textBus);
classBus.append(colorBoxBus);

publicTransportationLegend.append(classBus);
/***
***/

/***
Ferry, gondola and cable car
***/
var classFerryGondolaCableCar = $("<div></div>");

var textFerryGondolaCableCar = $("<p></p>");
textFerryGondolaCableCar.addClass("legend-text");
textFerryGondolaCableCar.text("Ferry, gondola and cable car");

var colorBoxFerryGondolaCableCar = $("<div></div>");
colorBoxFerryGondolaCableCar.addClass("color-box");
colorBoxFerryGondolaCableCar.css("background-color", "#4291c7");

classFerryGondolaCableCar.append(textFerryGondolaCableCar);
classFerryGondolaCableCar.append(colorBoxFerryGondolaCableCar);

publicTransportationLegend.append(classFerryGondolaCableCar);
/***
***/

/***
Tram
***/
var classTram = $("<div></div>");

var textTram = $("<p></p>");
textTram.addClass("legend-text");
textTram.text("Tram");

var colorBoxTram = $("<div></div>");
colorBoxTram.addClass("color-box");
colorBoxTram.css("background-color", "#42d17e");

classTram.append(textTram);
classTram.append(colorBoxTram);

publicTransportationLegend.append(classTram);
/***
***/

/***
Metro
***/
var classMetro = $("<div></div>");

var textMetro = $("<p></p>");
textMetro.addClass("legend-text");
textMetro.text("Metro");

var colorBoxMetro = $("<div></div>");
colorBoxMetro.addClass("color-box");
colorBoxMetro.css("background-color", "#2ca990");

classMetro.append(textMetro);
classMetro.append(colorBoxMetro);

publicTransportationLegend.append(classMetro);
/***
***/

/***
Rails
***/
var classRails = $("<div></div>");

var textRails = $("<p></p>");
textRails.addClass("legend-text");
textRails.text("Rails");

var colorBoxRails = $("<div></div>");
colorBoxRails.addClass("color-box");
colorBoxRails.css("background-color", "#e95d4e");

classRails.append(textRails);
classRails.append(colorBoxRails);

publicTransportationLegend.append(classRails);
/***
***/

/***
Funicular
***/
var classFunicular = $("<div></div>");

var textFunicular = $("<p></p>");
textFunicular.addClass("legend-text");
textFunicular.text("Funicular");

var colorBoxFunicular = $("<div></div>");
colorBoxFunicular.addClass("color-box");
colorBoxFunicular.css("background-color", "#9956b5");

classFunicular.append(textFunicular);
classFunicular.append(colorBoxFunicular);

publicTransportationLegend.append(classFunicular);
/***
***/
