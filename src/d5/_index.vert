// 设置浮点数据类型为中等精度
precision mediump float;
// 接收顶点坐标(x, y)
attribute vec2 a_Position;
// 接收 canvas 尺寸 (width, height)
attribute vec2 a_Screen_Size;
// 接收 JavaScript 传递的顶点颜色
attribute vec4 a_Color;
// 传往片元着色器的颜色
varying vec4 v_Color;
void main() {
  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
  position = position * vec2(1.0, -1.0);
  gl_Position = vec4(position, 0, 1);
  v_Color = a_Color;
}