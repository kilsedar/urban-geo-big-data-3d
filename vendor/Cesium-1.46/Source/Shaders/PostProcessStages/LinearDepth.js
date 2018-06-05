//This file is automatically rebuilt by the Cesium build process.
define(function() {
    'use strict';
    return "uniform sampler2D depthTexture;\n\
\n\
varying vec2 v_textureCoordinates;\n\
\n\
float linearDepth(float depth)\n\
{\n\
    float far = czm_currentFrustum.y;\n\
    float near = czm_currentFrustum.x;\n\
    return (2.0 * near) / (far + near - depth * (far - near));\n\
}\n\
\n\
void main(void)\n\
{\n\
    float depth = czm_readDepth(depthTexture, v_textureCoordinates);\n\
    gl_FragColor = vec4(linearDepth(depth));\n\
}\n\
";
});