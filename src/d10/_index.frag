// 设置浮点数据类型为中等精度
precision mediump float;
// 接收js传过来的颜色值（RGBA）
varying vec4 v_Color;
// 光源颜色
uniform vec3 u_LightColor;
// 环境光强度因子
uniform float u_AmbientFactor;
void main() {
  // gl_FragColor = v_Color;
  vec3 ambientColor = u_AmbientFactor * u_LightColor;
  gl_FragColor = vec4(ambientColor, 1) * v_Color;
}