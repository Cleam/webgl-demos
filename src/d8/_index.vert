// 设置浮点数据类型为中等精度
precision mediump float;
// 接收顶点坐标(x, y)
attribute vec3 a_Position;
// 接收 JavaScript 传递的顶点颜色
attribute vec4 a_Color;
// 传往片元着色器的颜色
varying vec4 v_Color;
uniform mat4 u_Matrix;
void main() {
  gl_Position = u_Matrix * vec4(a_Position, 1);
  v_Color = a_Color;
  // 声明待绘制的点的大小
  gl_PointSize = 5.0;
}
