var deformationCumulativeLegend = $("<div></div>");
deformationCumulativeLegend.attr("id", "legend-deformation-cumulative");
deformationCumulativeLegend.addClass("legend legend-deformation");

var deformationCumulativeLegendTitle = $("<h6>Cumulative Deformation [mm]</h6>");
deformationCumulativeLegendTitle.addClass("legend-title");
deformationCumulativeLegend.append(deformationCumulativeLegendTitle);

var colorBoxes = $("<div></div>");

var colorBoxMinusFive = $("<div></div>");
colorBoxMinusFive.addClass("color-box");
colorBoxMinusFive.css("background-color", "#40004b");
colorBoxes.append(colorBoxMinusFive);

var colorBoxMinusFour = $("<div></div>");
colorBoxMinusFour.addClass("color-box");
colorBoxMinusFour.css("background-color", "#762a83");
colorBoxes.append(colorBoxMinusFour);

var colorBoxMinusThree = $("<div></div>");
colorBoxMinusThree.addClass("color-box");
colorBoxMinusThree.css("background-color", "#9970ab");
colorBoxes.append(colorBoxMinusThree);

var colorBoxMinusTwo = $("<div></div>");
colorBoxMinusTwo.addClass("color-box");
colorBoxMinusTwo.css("background-color", "#c2a5cf");
colorBoxes.append(colorBoxMinusTwo);

var colorBoxMinusOne = $("<div></div>");
colorBoxMinusOne.addClass("color-box");
colorBoxMinusOne.css("background-color", "#e7d4e8");
colorBoxes.append(colorBoxMinusOne);

var colorBoxZero = $("<div></div>");
colorBoxZero.addClass("color-box");
colorBoxZero.css("background-color", "#f7f7f7");
colorBoxes.append(colorBoxZero);

var colorBoxPlusOne = $("<div></div>");
colorBoxPlusOne.addClass("color-box");
colorBoxPlusOne.css("background-color", "#d9f0d3");
colorBoxes.append(colorBoxPlusOne);

var colorBoxPlusTwo = $("<div></div>");
colorBoxPlusTwo.addClass("color-box");
colorBoxPlusTwo.css("background-color", "#a6dba0");
colorBoxes.append(colorBoxPlusTwo);

var colorBoxPlusThree = $("<div></div>");
colorBoxPlusThree.addClass("color-box");
colorBoxPlusThree.css("background-color", "#5aae61");
colorBoxes.append(colorBoxPlusThree);

var colorBoxPlusFour = $("<div></div>");
colorBoxPlusFour.addClass("color-box");
colorBoxPlusFour.css("background-color", "#1b7837");
colorBoxes.append(colorBoxPlusFour);

var colorBoxPlusFive = $("<div></div>");
colorBoxPlusFive.addClass("color-box");
colorBoxPlusFive.css("background-color", "#00441b");
colorBoxes.append(colorBoxPlusFive);

deformationCumulativeLegend.append(colorBoxes);

var texts = $("<div></div>");

var textMinusThreeHundred = $("<p></p>");
textMinusThreeHundred.attr("id", "legend-deformation-cumulative-text-minus-three-hundred");
textMinusThreeHundred.addClass("legend-text");
textMinusThreeHundred.text("-300");
texts.append(textMinusThreeHundred);

var textMinusTwentyFive = $("<p></p>");
textMinusTwentyFive.attr("id", "legend-deformation-cumulative-text-minus-twenty-five");
textMinusTwentyFive.addClass("legend-text");
textMinusTwentyFive.text("-25");
texts.append(textMinusTwentyFive);

var textMinusTwenty = $("<p></p>");
textMinusTwenty.attr("id", "legend-deformation-cumulative-text-minus-twenty");
textMinusTwenty.addClass("legend-text");
textMinusTwenty.text("-20");
texts.append(textMinusTwenty);

var textMinusFifteen = $("<p></p>");
textMinusFifteen.attr("id", "legend-deformation-cumulative-text-minus-fifteen");
textMinusFifteen.addClass("legend-text");
textMinusFifteen.text("-15");
texts.append(textMinusFifteen);

var textMinusTen = $("<p></p>");
textMinusTen.attr("id", "legend-deformation-cumulative-text-minus-ten");
textMinusTen.addClass("legend-text");
textMinusTen.text("-10");
texts.append(textMinusTen);

var textMinusFive = $("<p></p>");
textMinusFive.attr("id", "legend-deformation-cumulative-text-minus-five");
textMinusFive.addClass("legend-text");
textMinusFive.text("-5");
texts.append(textMinusFive);

var textPlusFive = $("<p></p>");
textPlusFive.attr("id", "legend-deformation-cumulative-text-plus-five");
textPlusFive.addClass("legend-text");
textPlusFive.text("+5");
texts.append(textPlusFive);

var textPlusTen = $("<p></p>");
textPlusTen.attr("id", "legend-deformation-cumulative-text-plus-ten");
textPlusTen.addClass("legend-text");
textPlusTen.text("+10");
texts.append(textPlusTen);

var textPlusFifteen = $("<p></p>");
textPlusFifteen.attr("id", "legend-deformation-cumulative-text-plus-fifteen");
textPlusFifteen.addClass("legend-text");
textPlusFifteen.text("+15");
texts.append(textPlusFifteen);

var textPlusTwenty = $("<p></p>");
textPlusTwenty.attr("id", "legend-deformation-cumulative-text-plus-twenty");
textPlusTwenty.addClass("legend-text");
textPlusTwenty.text("+20");
texts.append(textPlusTwenty);

var textPlusTwentyFive = $("<p></p>");
textPlusTwentyFive.attr("id", "legend-deformation-cumulative-text-plus-twenty-five");
textPlusTwentyFive.addClass("legend-text");
textPlusTwentyFive.text("+25");
texts.append(textPlusTwentyFive);

var textPlusThreeHundred = $("<p></p>");
textPlusThreeHundred.attr("id", "legend-deformation-cumulative-text-plus-twenty-three-hundred");
textPlusThreeHundred.addClass("legend-text");
textPlusThreeHundred.text("+300");
texts.append(textPlusThreeHundred);

deformationCumulativeLegend.append(texts);
