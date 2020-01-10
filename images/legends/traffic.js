var trafficLegend = $("<div></div>");
trafficLegend.attr("id", "legend-traffic");
trafficLegend.addClass("legend");

var trafficLegendTitle = $("<h6>Number of Vehicles</h6>");
trafficLegendTitle.addClass("legend-title");
trafficLegend.append(trafficLegendTitle);

/***
One
***/
var classOne = $("<div></div>");

var textOne = $("<p></p>");
textOne.addClass("legend-text");
textOne.text("1");

var colorBoxOne = $("<div></div>");
colorBoxOne.addClass("color-box");
colorBoxOne.css("background-color", "#08a9ee");

classOne.append(textOne);
classOne.append(colorBoxOne);

trafficLegend.append(classOne);
/***
***/

/***
Two
***/
var classTwo = $("<div></div>");

var textTwo = $("<p></p>");
textTwo.addClass("legend-text");
textTwo.text("2");

var colorBoxTwo = $("<div></div>");
colorBoxTwo.addClass("color-box");
colorBoxTwo.css("background-color", "#55bc77");

classTwo.append(textTwo);
classTwo.append(colorBoxTwo);

trafficLegend.append(classTwo);
/***
***/

/***
Three
***/
var classThree = $("<div></div>");

var textThree = $("<p></p>");
textThree.addClass("legend-text");
textThree.text("3");

var colorBoxThree = $("<div></div>");
colorBoxThree.addClass("color-box");
colorBoxThree.css("background-color", "#77c542");

classThree.append(textThree);
classThree.append(colorBoxThree);

trafficLegend.append(classThree);
/***
***/

/***
Four
***/
var classFour = $("<div></div>");

var textFour = $("<p></p>");
textFour.addClass("legend-text");
textFour.text("4");

var colorBoxFour = $("<div></div>");
colorBoxFour.addClass("color-box");
colorBoxFour.css("background-color", "#93cc17");

classFour.append(textFour);
classFour.append(colorBoxFour);

trafficLegend.append(classFour);
/***
***/

/***
Five
***/
var classFive = $("<div></div>");

var textFive = $("<p></p>");
textFive.addClass("legend-text");
textFive.text("5");

var colorBoxFive = $("<div></div>");
colorBoxFive.addClass("color-box");
colorBoxFive.css("background-color", "#d0c90a");

classFive.append(textFive);
classFive.append(colorBoxFive);

trafficLegend.append(classFive);
/***
***/

/***
From six to ten
***/
var classSixTen = $("<div></div>");

var textSixTen = $("<p></p>");
textSixTen.addClass("legend-text");
textSixTen.text("6–10");

var colorBoxSixTen = $("<div></div>");
colorBoxSixTen.addClass("color-box");
colorBoxSixTen.css("background-color", "#ffc508");

classSixTen.append(textSixTen);
classSixTen.append(colorBoxSixTen);

trafficLegend.append(classSixTen);
/***
***/

/***
From eleven to twenty
***/
var classElevenTwenty = $("<div></div>");

var textElevenTwenty = $("<p></p>");
textElevenTwenty.addClass("legend-text");
textElevenTwenty.text("11–20");

var colorBoxElevenTwenty = $("<div></div>");
colorBoxElevenTwenty.addClass("color-box");
colorBoxElevenTwenty.css("background-color", "#f29815");

classElevenTwenty.append(textElevenTwenty);
classElevenTwenty.append(colorBoxElevenTwenty);

trafficLegend.append(classElevenTwenty);
/***
***/

/***
From twenty one to forty
***/
var classTwentyOneForty = $("<div></div>");

var textTwentyOneForty = $("<p></p>");
textTwentyOneForty.addClass("legend-text");
textTwentyOneForty.text("21–40");

var colorBoxTwentyOneForty = $("<div></div>");
colorBoxTwentyOneForty.addClass("color-box");
colorBoxTwentyOneForty.css("background-color", "#e46823");

classTwentyOneForty.append(textTwentyOneForty);
classTwentyOneForty.append(colorBoxTwentyOneForty);

trafficLegend.append(classTwentyOneForty);
/***
***/

/***
From forty one to sixty
***/
var classFortyOneSixty = $("<div></div>");

var textFortyOneSixty = $("<p></p>");
textFortyOneSixty.addClass("legend-text");
textFortyOneSixty.text("41–60");

var colorBoxFortyOneSixty = $("<div></div>");
colorBoxFortyOneSixty.addClass("color-box");
colorBoxFortyOneSixty.css("background-color", "#d12736");

classFortyOneSixty.append(textFortyOneSixty);
classFortyOneSixty.append(colorBoxFortyOneSixty);

trafficLegend.append(classFortyOneSixty);
/***
***/

/***
From sixty one to eighty
***/
var classSixtyOneEighty = $("<div></div>");

var textSixtyOneEighty = $("<p></p>");
textSixtyOneEighty.addClass("legend-text");
textSixtyOneEighty.text("61–80");

var colorBoxSixtyOneEighty = $("<div></div>");
colorBoxSixtyOneEighty.addClass("color-box");
colorBoxSixtyOneEighty.css("background-color", "#9e1244");

classSixtyOneEighty.append(textSixtyOneEighty);
classSixtyOneEighty.append(colorBoxSixtyOneEighty);

trafficLegend.append(classSixtyOneEighty);
/***
***/

/***
Greater than eighty
***/
var classMoreThanEighty = $("<div></div>");

var textMoreThanEighty = $("<p></p>");
textMoreThanEighty.addClass("legend-text");
textMoreThanEighty.text(">80");

var colorBoxMoreThanEighty = $("<div></div>");
colorBoxMoreThanEighty.addClass("color-box");
colorBoxMoreThanEighty.css("background-color", "#5d1f4b");

classMoreThanEighty.append(textMoreThanEighty);
classMoreThanEighty.append(colorBoxMoreThanEighty);

trafficLegend.append(classMoreThanEighty);
/***
***/
