//This file is automatically rebuilt by the Cesium build process.
define(function() {
    'use strict';
    return "/**\n\
 * Branchless ternary operator to be used when it's inexpensive to explicitly\n\
 * evaluate both possibilities for a float expression.\n\
 *\n\
 * @name czm_branchFreeTernaryFloat\n\
 * @glslFunction\n\
 *\n\
 * @param {bool} comparison A comparison statement\n\
 * @param {float} a Value to return if the comparison is true.\n\
 * @param {float} b Value to return if the comparison is false.\n\
 *\n\
 * @returns {float} equivalent of comparison ? a : b\n\
 */\n\
float czm_branchFreeTernaryFloat(bool comparison, float a, float b) {\n\
    float useA = float(comparison);\n\
    return a * useA + b * (1.0 - useA);\n\
}\n\
";
});