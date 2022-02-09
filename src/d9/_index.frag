// 设置浮点数据类型为中等精度
precision mediump float;
// 接收js传过来的颜色值（RGBA）
varying vec4 v_Color;
void main() {
  gl_FragColor = v_Color;
}