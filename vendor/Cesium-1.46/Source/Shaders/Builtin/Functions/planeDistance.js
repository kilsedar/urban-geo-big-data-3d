//This file is automatically rebuilt by the Cesium build process.
define(function() {
    'use strict';
    return "/**\n\
 * Computes distance from an point to a plane, typically in eye space.\n\
 *\n\
 * @name czm_planeDistance\n\
 * @glslFunction\n\
 *\n\
 * param {vec4} plane A Plane in Hessian Normal Form. See Plane.js\n\
 * param {vec3} point A point in the same space as the plane.\n\
 * returns {float} The distance from the point to the plane.\n\
 */\n\
float czm_planeDistance(vec4 plane, vec3 point) {\n\
    return (dot(plane.xyz, point) + plane.w);\n\
}\n\
";
});