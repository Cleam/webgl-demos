// 设置浮点数据类型为中等精度
precision mediump float;
// 接收js传过来的颜色值（RGBA）
varying vec4 v_Color;
void main() {
  vec4 color = v_Color / vec4(255, 255, 255, 1);
  gl_FragColor = color;
}