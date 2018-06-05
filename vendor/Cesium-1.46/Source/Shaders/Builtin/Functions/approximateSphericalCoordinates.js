//This file is automatically rebuilt by the Cesium build process.
define(function() {
    'use strict';
    return "// Based on Michal Drobot's approximation from ShaderFastLibs, which in turn is based on\n\
// \"Efficient approximations for the arctangent function,\" Rajan, S. Sichun Wang Inkol, R. Joyal, A., May 2006.\n\
// Adapted from ShaderFastLibs under MIT License.\n\
//\n\
// Chosen for the following characteristics over range [0, 1]:\n\
// - basically no error at 0 and 1, important for getting around range limit (naive atan2 via atan requires infinite range atan)\n\
// - no visible artifacts from first-derivative discontinuities, unlike latitude via range-reduced sqrt asin approximations (at equator)\n\
//\n\
// The original code is x * (-0.1784 * abs(x) - 0.0663 * x * x + 1.0301);\n\
// Removed the abs() in here because it isn't needed, the input range is guaranteed as [0, 1] by how we're approximating atan2.\n\
float fastApproximateAtan01(float x) {\n\
    return x * (-0.1784 * x - 0.0663 * x * x + 1.0301);\n\
}\n\
\n\
// Range reduction math based on nvidia's cg reference implementation for atan2: http://developer.download.nvidia.com/cg/atan2.html\n\
// However, we replaced their atan curve with Michael Drobot's.\n\
float fastApproximateAtan2(float x, float y) {\n\
    // atan approximations are usually only reliable over [-1, 1], or, in our case, [0, 1] due to modifications.\n\
    // So range-reduce using abs and by flipping whether x or y is on top.\n\
    float t = abs(x); // t used as swap and atan result.\n\
    float opposite = abs(y);\n\
    float adjacent = max(t, opposite);\n\
    opposite = min(t, opposite);\n\
\n\
    t = fastApproximateAtan01(opposite / adjacent);\n\
\n\
    // Undo range reduction\n\
    t = czm_branchFreeTernaryFloat(abs(y) > abs(x), czm_piOverTwo - t, t);\n\
    t = czm_branchFreeTernaryFloat(x < 0.0, czm_pi - t, t);\n\
    t = czm_branchFreeTernaryFloat(y < 0.0, -t, t);\n\
    return t;\n\
}\n\
\n\
/**\n\
 * Approximately computes spherical coordinates given a normal.\n\
 * Uses approximate inverse trigonometry for speed and consistency,\n\
 * since inverse trigonometry can differ from vendor-to-vendor and when compared with the CPU.\n\
 *\n\
 * @name czm_approximateSphericalCoordinates\n\
 * @glslFunction\n\
 *\n\
 * @param {vec3} normal arbitrary-length normal.\n\
 *\n\
 * @returns {vec2} Approximate latitude and longitude spherical coordinates.\n\
 */\n\
vec2 czm_approximateSphericalCoordinates(vec3 normal) {\n\
    // Project into plane with vertical for latitude\n\
    float latitudeApproximation = fastApproximateAtan2(sqrt(normal.x * normal.x + normal.y * normal.y), normal.z);\n\
    float longitudeApproximation = fastApproximateAtan2(normal.x, normal.y);\n\
    return vec2(latitudeApproximation, longitudeApproximation);\n\
}\n\
";
});