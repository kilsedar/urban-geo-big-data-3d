var deformationMeanLegend = $("<div></div>");
deformationMeanLegend.attr("id", "legend-deformation-mean");
deformationMeanLegend.addClass("legend");

var deformationMeanLegendTitle = $("<h6>Mean Deformation Velocity [mm/year]</h6>");
deformationMeanLegendTitle.addClass("legend-title");
deformationMeanLegend.append(deformationMeanLegendTitle);

var colorBoxes = $("<div></div>");

var colorBoxMinusFive = $("<div></div>");
colorBoxMinusFive.addClass("color-box");
colorBoxMinusFive.css("background-color", "#67001f");
colorBoxes.append(colorBoxMinusFive);

var colorBoxMinusFour = $("<div></div>");
colorBoxMinusFour.addClass("color-box");
colorBoxMinusFour.css("background-color", "#b2182b");
colorBoxes.append(colorBoxMinusFour);

var colorBoxMinusThree = $("<div></div>");
colorBoxMinusThree.addClass("color-box");
colorBoxMinusThree.css("background-color", "#d6604d");
colorBoxes.append(colorBoxMinusThree);

var colorBoxMinusTwo = $("<div></div>");
colorBoxMinusTwo.addClass("color-box");
colorBoxMinusTwo.css("background-color", "#f4a582");
colorBoxes.append(colorBoxMinusTwo);

var colorBoxMinusOne = $("<div></div>");
colorBoxMinusOne.addClass("color-box");
colorBoxMinusOne.css("background-color", "#fddbc7");
colorBoxes.append(colorBoxMinusOne);

var colorBoxZero = $("<div></div>");
colorBoxZero.addClass("color-box");
colorBoxZero.css("background-color", "#f7f7f7");
colorBoxes.append(colorBoxZero);

var colorBoxPlusOne = $("<div></div>");
colorBoxPlusOne.addClass("color-box");
colorBoxPlusOne.css("background-color", "#6bacd1");
colorBoxes.append(colorBoxPlusOne);

var colorBoxPlusTwo = $("<div></div>");
colorBoxPlusTwo.addClass("color-box");
colorBoxPlusTwo.css("background-color", "#053061");
colorBoxes.append(colorBoxPlusTwo);

deformationMeanLegend.append(colorBoxes);

var texts = $("<div></div>");

var textMinusFifteen = $("<p></p>");
textMinusFifteen.attr("id", "legend-text-minus-fifteen");
textMinusFifteen.addClass("legend-text");
textMinusFifteen.text("-15");
texts.append(textMinusFifteen);

var textMinusEleven = $("<p></p>");
textMinusEleven.attr("id", "legend-text-minus-eleven");
textMinusEleven.addClass("legend-text");
textMinusEleven.text("-11");
texts.append(textMinusEleven);

var textMinusSeven = $("<p></p>");
textMinusSeven.attr("id", "legend-text-minus-seven");
textMinusSeven.addClass("legend-text");
textMinusSeven.text("-7");
texts.append(textMinusSeven);

var textMinusFive = $("<p></p>");
textMinusFive.attr("id", "legend-text-minus-five");
textMinusFive.addClass("legend-text");
textMinusFive.text("-5");
texts.append(textMinusFive);

var textMinusThree = $("<p></p>");
textMinusThree.attr("id", "legend-text-minus-three");
textMinusThree.addClass("legend-text");
textMinusThree.text("-3");
texts.append(textMinusThree);

var textMinusOne = $("<p></p>");
textMinusOne.attr("id", "legend-text-minus-one");
textMinusOne.addClass("legend-text");
textMinusOne.text("-1");
texts.append(textMinusOne);

var textPlusOne = $("<p></p>");
textPlusOne.attr("id", "legend-text-plus-one");
textPlusOne.addClass("legend-text");
textPlusOne.text("+1");
texts.append(textPlusOne);

var textPlusTwo = $("<p></p>");
textPlusTwo.attr("id", "legend-text-plus-two");
textPlusTwo.addClass("legend-text");
textPlusTwo.text("+2");
texts.append(textPlusTwo);

var textPlusThree = $("<p></p>");
textPlusThree.attr("id", "legend-text-plus-three");
textPlusThree.addClass("legend-text");
textPlusThree.text("+3");
texts.append(textPlusThree);

deformationMeanLegend.append(texts);
