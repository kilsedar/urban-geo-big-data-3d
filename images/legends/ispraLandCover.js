var ispraLandCoverLegend = $("<div></div>");
ispraLandCoverLegend.addClass("legend legend-JS");

/***
1000 (Artificial surfaces)
***/
var class1000 = $("<div></div>");
class1000.addClass("first-level");

var title1000 = $("<div></div>");
title1000.addClass("first-level-title");

var text1000 = $("<p></p>");
text1000.addClass("legend-text");
text1000.text("1. Artificial surfaces");

var colorBox1000 = $("<div></div>");
colorBox1000.addClass("color-box");
colorBox1000.css("background-color", "#e6004d");

title1000.append(text1000);
title1000.append(colorBox1000);

class1000.append(title1000);

ispraLandCoverLegend.append(class1000);
/***
***/

/***
2000 (Agricultural surfaces)
***/
var class2000 = $("<div></div>");
class2000.addClass("first-level");

var title2000 = $("<div></div>");
title2000.addClass("first-level-title");

var text2000 = $("<p></p>");
text2000.addClass("legend-text");
text2000.text("2. Agricultural surfaces");

var caret2000 = $("<div></div>");
caret2000.addClass("caret");
var caretImageDown2000 = $("<img>");
caretImageDown2000.attr("src", "images/caret-down.png");
caret2000.append(caretImageDown2000);
var caretImageUp2000 = $("<img>");
caretImageUp2000.attr("src", "images/caret-up.png");
caretImageUp2000.addClass("caret-image-up");
caret2000.append(caretImageUp2000);

title2000.append(text2000);
title2000.append(caret2000);

class2000.append(title2000);

ispraLandCoverLegend.append(class2000);
/***
***/

var class2x00 = $("<div></div>");
class2x00.addClass("second-level");
class2000.append(class2x00);

/***
2100 (Arable lands)
***/
var class2100 = $("<div></div>");

var title2100 = $("<div></div>");
title2100.addClass("second-level-title");

var text2100 = $("<p></p>");
text2100.addClass("legend-text");
text2100.text("2.1 Arable lands");

var caret2100 = $("<div></div>");
caret2100.addClass("caret");
var caretImageDown2100 = $("<img>");
caretImageDown2100.attr("src", "images/caret-down.png");
caret2100.append(caretImageDown2100);
var caretImageUp2100 = $("<img>");
caretImageUp2100.attr("src", "images/caret-up.png");
caretImageUp2100.addClass("caret-image-up");
caret2100.append(caretImageUp2100);

title2100.append(text2100);
title2100.append(caret2100);

class2100.append(title2100);

class2x00.append(class2100);
/***
***/

/***
2200 (Permanent crops)
***/
var class2200 = $("<div></div>");

var title2200 = $("<div></div>");
title2200.addClass("second-level-title");

var text2200 = $("<p></p>");
text2200.addClass("legend-text");
text2200.text("2.2 Permanent crops");

var caret2200 = $("<div></div>");
caret2200.addClass("caret");
var caretImageDown2200 = $("<img>");
caretImageDown2200.attr("src", "images/caret-down.png");
caret2200.append(caretImageDown2200);
var caretImageUp2200 = $("<img>");
caretImageUp2200.attr("src", "images/caret-up.png");
caretImageUp2200.addClass("caret-image-up");
caret2200.append(caretImageUp2200);

title2200.append(text2200);
title2200.append(caret2200);

class2200.append(title2200);

class2x00.append(class2200);
/***
***/

/***
2300 (Stable meadows (permanent forage))
***/
var class2300 = $("<div></div>");

var title2300 = $("<div></div>");
title2300.addClass("second-level-title");

var text2300 = $("<p></p>");
text2300.addClass("legend-text");
text2300.text("2.3 Stable meadows (permanent forage)");

var colorBox2300 = $("<div></div>");
colorBox2300.addClass("color-box");
colorBox2300.css("background-color", "#e6e64d");

title2300.append(text2300);
title2300.append(colorBox2300);

class2300.append(title2300);

class2x00.append(class2300);
/***
***/

/***
2400 (Heterogeneous agricultural areas)
***/
var class2400 = $("<div></div>");

var title2400 = $("<div></div>");
title2400.addClass("second-level-title");

var text2400 = $("<p></p>");
text2400.addClass("legend-text");
text2400.text("2.4 Heterogeneous agricultural areas");

var caret2400 = $("<div></div>");
caret2400.addClass("caret");
var caretImageDown2400 = $("<img>");
caretImageDown2400.attr("src", "images/caret-down.png");
caret2400.append(caretImageDown2400);
var caretImageUp2400 = $("<img>");
caretImageUp2400.attr("src", "images/caret-up.png");
caretImageUp2400.addClass("caret-image-up");
caret2400.append(caretImageUp2400);

title2400.append(text2400);
title2400.append(caret2400);

class2400.append(title2400);

class2x00.append(class2400);
/***
***/

var class21x0 = $("<div></div>");
class21x0.addClass("third-level");
class2100.append(class21x0);

/***
2110 (Arable lands in non-irrigated areas)
***/
var class2110 = $("<div></div>");

var title2110 = $("<div></div>");
title2110.addClass("third-level-title");

var text2110 = $("<p></p>");
text2110.addClass("legend-text");
text2110.text("2.1.1 Arable lands in non-irrigated areas");

var caret2110 = $("<div></div>");
caret2110.addClass("caret");
var caretImageDown2110 = $("<img>");
caretImageDown2110.attr("src", "images/caret-down.png");
caret2110.append(caretImageDown2110);
var caretImageUp2110 = $("<img>");
caretImageUp2110.attr("src", "images/caret-up.png");
caretImageUp2110.addClass("caret-image-up");
caret2110.append(caretImageUp2110);

title2110.append(text2110);
title2110.append(caret2110);

class2110.append(title2110);

class21x0.append(class2110);
/***
***/

/***
2120 (Arable lands in irrigated areas)
***/
var class2120 = $("<div></div>");

var title2120 = $("<div></div>");
title2120.addClass("third-level-title");

var text2120 = $("<p></p>");
text2120.addClass("legend-text");
text2120.text("2.1.2 Arable lands in irrigated areas");

var colorBox2120 = $("<div></div>");
colorBox2120.addClass("color-box");
colorBox2120.css("background-color", "#ffff00");

title2120.append(text2120);
title2120.append(colorBox2120);

class2120.append(title2120);

class21x0.append(class2120);
/***
***/

/***
2130 (Paddy fields)
***/
var class2130 = $("<div></div>");

var title2130 = $("<div></div>");
title2130.addClass("third-level-title");

var text2130 = $("<p></p>");
text2130.addClass("legend-text");
text2130.text("2.1.3 Paddy fields");

var colorBox2130 = $("<div></div>");
colorBox2130.addClass("color-box");
colorBox2130.css("background-color", "#e6e600");

title2130.append(text2130);
title2130.append(colorBox2130);

class2130.append(title2130);

class21x0.append(class2130);
/***
***/

var class22x0 = $("<div></div>");
class22x0.addClass("third-level");
class2200.append(class22x0);

/***
2210 (Vineyards)
***/
var class2210 = $("<div></div>");

var title2210 = $("<div></div>");
title2210.addClass("third-level-title");

var text2210 = $("<p></p>");
text2210.addClass("legend-text");
text2210.text("2.2.1 Vineyards");

var colorBox2210 = $("<div></div>");
colorBox2210.addClass("color-box");
colorBox2210.css("background-color", "#e68000");

title2210.append(text2210);
title2210.append(colorBox2210);

class2210.append(title2210);

class22x0.append(class2210);
/***
***/

/***
2220 (Orchards and smaller fruits)
***/
var class2220 = $("<div></div>");

var title2220 = $("<div></div>");
title2220.addClass("third-level-title");

var text2220 = $("<p></p>");
text2220.addClass("legend-text");
text2220.text("2.2.2 Orchards and smaller fruits");

var colorBox2220 = $("<div></div>");
colorBox2220.addClass("color-box");
colorBox2220.css("background-color", "#f2a64d");

title2220.append(text2220);
title2220.append(colorBox2220);

class2220.append(title2220);

class22x0.append(class2220);
/***
***/

/***
2230 (Olive groves)
***/
var class2230 = $("<div></div>");

var title2230 = $("<div></div>");
title2230.addClass("third-level-title");

var text2230 = $("<p></p>");
text2230.addClass("legend-text");
text2230.text("2.2.3 Olive groves");

var colorBox2230 = $("<div></div>");
colorBox2230.addClass("color-box");
colorBox2230.css("background-color", "#e6a600");

title2230.append(text2230);
title2230.append(colorBox2230);

class2230.append(title2230);

class22x0.append(class2230);
/***
***/

/***
2240 (Arboriculture from wood)
***/
var class2240 = $("<div></div>");

var title2240 = $("<div></div>");
title2240.addClass("third-level-title");

var text2240 = $("<p></p>");
text2240.addClass("legend-text");
text2240.text("2.2.4 Arboriculture from wood");

var colorBox2240 = $("<div></div>");
colorBox2240.addClass("color-box");
colorBox2240.css("background-color", "#e6b41e");

title2240.append(text2240);
title2240.append(colorBox2240);

class2240.append(title2240);

class22x0.append(class2240);
/***
***/

var class24x0 = $("<div></div>");
class24x0.addClass("third-level");
class2400.append(class24x0);

/***
2410 (Temporary crops associated with permanent crops)
***/
var class2410 = $("<div></div>");

var title2410 = $("<div></div>");
title2410.addClass("third-level-title");

var text2410 = $("<p></p>");
text2410.addClass("legend-text");
text2410.text("2.4.1 Temporary crops associated with permanent crops");

var colorBox2410 = $("<div></div>");
colorBox2410.addClass("color-box");
colorBox2410.css("background-color", "#ffe6a6");

title2410.append(text2410);
title2410.append(colorBox2410);

class2410.append(title2410);

class24x0.append(class2410);
/***
***/

/***
2420 (Cultivation systems and complex particles)
***/
var class2420 = $("<div></div>");

var title2420 = $("<div></div>");
title2420.addClass("third-level-title");

var text2420 = $("<p></p>");
text2420.addClass("legend-text");
text2420.text("2.4.2 Cultivation systems and complex particles");

var colorBox2420 = $("<div></div>");
colorBox2420.addClass("color-box");
colorBox2420.css("background-color", "#ffe64d");

title2420.append(text2420);
title2420.append(colorBox2420);

class2420.append(title2420);

class24x0.append(class2420);
/***
***/

/***
2430 (Areas occupied by agricultural crops with important natural areas)
***/
var class2430 = $("<div></div>");

var title2430 = $("<div></div>");
title2430.addClass("third-level-title");

var text2430 = $("<p></p>");
text2430.addClass("legend-text");
text2430.text("2.4.3 Areas occupied by agricultural crops with important natural areas");

var colorBox2430 = $("<div></div>");
colorBox2430.addClass("color-box");
colorBox2430.css("background-color", "#e6cc4d");

title2430.append(text2430);
title2430.append(colorBox2430);

class2430.append(title2430);

class24x0.append(class2430);
/***
***/

/***
2440 (Agroforestry areas)
***/
var class2440 = $("<div></div>");

var title2440 = $("<div></div>");
title2440.addClass("third-level-title");

var text2440 = $("<p></p>");
text2440.addClass("legend-text");
text2440.text("2.4.4 Agroforestry areas");

var colorBox2440 = $("<div></div>");
colorBox2440.addClass("color-box");
colorBox2440.css("background-color", "#f2cca6");

title2440.append(text2440);
title2440.append(colorBox2440);

class2440.append(title2440);

class24x0.append(class2440);
/***
***/

var class211x = $("<div></div>");
class211x.addClass("fourth-level");
class2110.append(class211x);

/***
2111 (Intensive crops)
***/
var class2111 = $("<div></div>");

var title2111 = $("<div></div>");
title2111.addClass("fourth-level-title");

var text2111 = $("<p></p>");
text2111.addClass("legend-text");
text2111.text("2.1.1.1 Intensive crops");

var colorBox2111 = $("<div></div>");
colorBox2111.addClass("color-box");
colorBox2111.css("background-color", "#ffffa8");

title2111.append(text2111);
title2111.append(colorBox2111);

class2111.append(title2111);

class211x.append(class2111);
/***
***/

/***
2112 (Extensive crops)
***/
var class2112 = $("<div></div>");

var title2112 = $("<div></div>");
title2112.addClass("fourth-level-title");

var text2112 = $("<p></p>");
text2112.addClass("legend-text");
text2112.text("2.1.1.2 Extensive crops");

var colorBox2112 = $("<div></div>");
colorBox2112.addClass("color-box");
colorBox2112.css("background-color", "#ffeba8");

title2112.append(text2112);
title2112.append(colorBox2112);

class2112.append(title2112);

class211x.append(class2112);
/***
***/

/***
3000 (Woods and tree-covered areas)
***/
var class3000 = $("<div></div>");
class3000.addClass("first-level");

var title3000 = $("<div></div>");
title3000.addClass("first-level-title");

var text3000 = $("<p></p>");
text3000.addClass("legend-text");
text3000.text("3. Woods and tree-covered areas");

var caret3000 = $("<div></div>");
caret3000.addClass("caret");
var caretImageDown3000 = $("<img>");
caretImageDown3000.attr("src", "images/caret-down.png");
caret3000.append(caretImageDown3000);
var caretImageUp3000 = $("<img>");
caretImageUp3000.attr("src", "images/caret-up.png");
caretImageUp3000.addClass("caret-image-up");
caret3000.append(caretImageUp3000);

title3000.append(text3000);
title3000.append(caret3000);

class3000.append(title3000);

ispraLandCoverLegend.append(class3000);
/***
***/

var class3x00 = $("<div></div>");
class3x00.addClass("second-level");
class3000.append(class3x00);

/***
3100 (Woods and areas covered with broad-leaved trees)
***/
var class3100 = $("<div></div>");

var title3100 = $("<div></div>");
title3100.addClass("second-level-title");

var text3100 = $("<p></p>");
text3100.addClass("legend-text");
text3100.text("3.1 Woods and areas covered with broad-leaved trees");

var colorBox3100 = $("<div></div>");
colorBox3100.addClass("color-box");
colorBox3100.css("background-color", "#80ff00");

title3100.append(text3100);
title3100.append(colorBox3100);

class3100.append(title3100);

class3x00.append(class3100);
/***
***/

/***
3200 (Woods and areas covered with coniferous trees)
***/
var class3200 = $("<div></div>");

var title3200 = $("<div></div>");
title3200.addClass("second-level-title");

var text3200 = $("<p></p>");
text3200.addClass("legend-text");
text3200.text("3.2 Woods and areas covered with coniferous trees");

var colorBox3200 = $("<div></div>");
colorBox3200.addClass("color-box");
colorBox3200.css("background-color", "#00a600");

title3200.append(text3200);
title3200.append(colorBox3200);

class3200.append(title3200);

class3x00.append(class3200);
/***
***/

/***
3300 (Woods and areas covered with mixed coniferous and broad-leaved trees)
***/
var class3300 = $("<div></div>");

var title3300 = $("<div></div>");
title3300.addClass("second-level-title");

var text3300 = $("<p></p>");
text3300.addClass("legend-text");
text3300.text("3.3 Woods and areas covered with mixed coniferous and broad-leaved trees");

var colorBox3300 = $("<div></div>");
colorBox3300.addClass("color-box");
colorBox3300.css("background-color", "#4dff00");

title3300.append(text3300);
title3300.append(colorBox3300);

class3300.append(title3300);

class3x00.append(class3300);
/***
***/

/***
4000 (Other natural and semi-natural surfaces)
***/
var class4000 = $("<div></div>");
class4000.addClass("first-level");

var title4000 = $("<div></div>");
title4000.addClass("first-level-title");

var text4000 = $("<p></p>");
text4000.addClass("legend-text");
text4000.text("4. Other natural and semi-natural surfaces");

var caret4000 = $("<div></div>");
caret4000.addClass("caret");
var caretImageDown4000 = $("<img>");
caretImageDown4000.attr("src", "images/caret-down.png");
caret4000.append(caretImageDown4000);
var caretImageUp4000 = $("<img>");
caretImageUp4000.attr("src", "images/caret-up.png");
caretImageUp4000.addClass("caret-image-up");
caret4000.append(caretImageUp4000);

title4000.append(text4000);
title4000.append(caret4000);

class4000.append(title4000);

ispraLandCoverLegend.append(class4000);
/***
***/

var class4x00 = $("<div></div>");
class4x00.addClass("second-level");
class4000.append(class4x00);

/***
4100 (Natural grazing areas and grasslands)
***/
var class4100 = $("<div></div>");

var title4100 = $("<div></div>");
title4100.addClass("second-level-title");

var text4100 = $("<p></p>");
text4100.addClass("legend-text");
text4100.text("4.1 Natural grazing areas and grasslands");

var colorBox4100 = $("<div></div>");
colorBox4100.addClass("color-box");
colorBox4100.css("background-color", "#ccf24d");

title4100.append(text4100);
title4100.append(colorBox4100);

class4100.append(title4100);

class4x00.append(class4100);
/***
***/

/***
4200 (Open urban areas)
***/
var class4200 = $("<div></div>");

var title4200 = $("<div></div>");
title4200.addClass("second-level-title");

var text4200 = $("<p></p>");
text4200.addClass("legend-text");
text4200.text("4.2 Open urban areas");

var colorBox4200 = $("<div></div>");
colorBox4200.addClass("color-box");
colorBox4200.css("background-color", "#ffa6ff");

title4200.append(text4200);
title4200.append(colorBox4200);

class4200.append(title4200);

class4x00.append(class4200);
/***
***/

/***
4300 (Moorlands and bushes)
***/
var class4300 = $("<div></div>");

var title4300 = $("<div></div>");
title4300.addClass("second-level-title");

var text4300 = $("<p></p>");
text4300.addClass("legend-text");
text4300.text("4.3 Moorlands and bushes");

var colorBox4300 = $("<div></div>");
colorBox4300.addClass("color-box");
colorBox4300.css("background-color", "#a6ff80");

title4300.append(text4300);
title4300.append(colorBox4300);

class4300.append(title4300);

class4x00.append(class4300);
/***
***/

/***
4400 (Sclerophyll vegetation areas)
***/
var class4400 = $("<div></div>");

var title4400 = $("<div></div>");
title4400.addClass("second-level-title");

var text4400 = $("<p></p>");
text4400.addClass("legend-text");
text4400.text("4.4 Sclerophyll vegetation areas");

var caret4400 = $("<div></div>");
caret4400.addClass("caret");
var caretImageDown4400 = $("<img>");
caretImageDown4400.attr("src", "images/caret-down.png");
caret4400.append(caretImageDown4400);
var caretImageUp4400 = $("<img>");
caretImageUp4400.attr("src", "images/caret-up.png");
caretImageUp4400.addClass("caret-image-up");
caret4400.append(caretImageUp4400);

title4400.append(text4400);
title4400.append(caret4400);

class4400.append(title4400);

class4x00.append(class4400);
/***
***/

/***
4500 (Areas with evolving wooded and shrubby vegetation)
***/
var class4500 = $("<div></div>");

var title4500 = $("<div></div>");
title4500.addClass("second-level-title");

var text4500 = $("<p></p>");
text4500.addClass("legend-text");
text4500.text("4.5 Areas with evolving wooded and shrubby vegetation");

var colorBox4500 = $("<div></div>");
colorBox4500.addClass("color-box");
colorBox4500.css("background-color", "#a6f200");

title4500.append(text4500);
title4500.append(colorBox4500);

class4500.append(title4500);

class4x00.append(class4500);
/***
***/

/***
4600 (Open areas with sparse or absent vegetation)
***/
var class4600 = $("<div></div>");

var title4600 = $("<div></div>");
title4600.addClass("second-level-title");

var text4600 = $("<p></p>");
text4600.addClass("legend-text");
text4600.text("4.6 Open areas with sparse or absent vegetation");

var colorBox4600 = $("<div></div>");
colorBox4600.addClass("color-box");
colorBox4600.css("background-color", "#cccccc");

title4600.append(text4600);
title4600.append(colorBox4600);

class4600.append(title4600);

class4x00.append(class4600);
/***
***/

var class44x0 = $("<div></div>");
class44x0.addClass("third-level");
class4400.append(class44x0);

/***
4410 (High scrub)
***/
var class4410 = $("<div></div>");

var title4410 = $("<div></div>");
title4410.addClass("third-level-title");

var text4410 = $("<p></p>");
text4410.addClass("legend-text");
text4410.text("4.4.1 High scrub");

var colorBox4410 = $("<div></div>");
colorBox4410.addClass("color-box");
colorBox4410.css("background-color", "#a6e64d");

title4410.append(text4410);
title4410.append(colorBox4410);

class4410.append(title4410);

class44x0.append(class4410);
/***
***/

/***
4420 (Low scrub and garrigue)
***/
var class4420 = $("<div></div>");

var title4420 = $("<div></div>");
title4420.addClass("third-level-title");

var text4420 = $("<p></p>");
text4420.addClass("legend-text");
text4420.text("4.4.2 Low scrub and garrigue");

var colorBox4420 = $("<div></div>");
colorBox4420.addClass("color-box");
colorBox4420.css("background-color", "#a6d24d");

title4420.append(text4420);
title4420.append(colorBox4420);

class4420.append(title4420);

class44x0.append(class4420);
/***
***/

/***
5000 (Wetlands)
***/
var class5000 = $("<div></div>");
class5000.addClass("first-level");

var title5000 = $("<div></div>");
title5000.addClass("first-level-title");

var text5000 = $("<p></p>");
text5000.addClass("legend-text");
text5000.text("5. Wetlands");

var colorBox5000 = $("<div></div>");
colorBox5000.addClass("color-box");
colorBox5000.css("background-color", "#a6a6ff");

title5000.append(text5000);
title5000.append(colorBox5000);

class5000.append(title5000);

ispraLandCoverLegend.append(class5000);
/***
***/

/***
6000 (Permanent water bodies)
***/
var class6000 = $("<div></div>");
class6000.addClass("first-level");

var title6000 = $("<div></div>");
title6000.addClass("first-level-title");

var text6000 = $("<p></p>");
text6000.addClass("legend-text");
text6000.text("6. Permanent water bodies");

var colorBox6000 = $("<div></div>");
colorBox6000.addClass("color-box");
colorBox6000.css("background-color", "#00ccf2");

title6000.append(text6000);
title6000.append(colorBox6000);

class6000.append(title6000);

ispraLandCoverLegend.append(class6000);
/***
***/
