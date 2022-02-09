// 设置浮点数据类型为中等精度
precision mediump float;
attribute vec4 a_Positions;
// attribute vec3 a_Normals;
// attribute vec2 a_Texcoords;
attribute vec4 a_Colors;
// 传往片元着色器的颜色
varying vec4 v_Color;
// 定义一个变换矩阵，用来接收 JavaScript 中传过来的模型投影变换矩阵，同时将变换矩阵左乘顶点坐标。
uniform mat4 u_Matrix;
void main() {
  gl_Position = u_Matrix * a_Positions;
  v_Color = a_Colors;
  // 声明待绘制的点的大小
  gl_PointSize = 5.0;
}