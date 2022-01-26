// 设置浮点数据类型为中等精度
precision mediump float;
// 接收顶点坐标(x, y)
attribute vec2 a_Position;
// 接收 canvas 尺寸 (width, height)
attribute vec2 a_Screen_Size;
void main() {
  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
  position = position * vec2(1.0, -1.0);
  gl_Position = vec4(position, 0, 1);
}