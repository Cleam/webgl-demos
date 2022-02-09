// 顶点着色器
export const shaderVertex = `
// 设置浮点数据类型为中等精度
precision mediump float;
// 接收顶点坐标(x, y)
attribute vec3 a_Position;
// 接收 JavaScript 传递的顶点颜色
attribute vec4 a_Color;
// 传往片元着色器的颜色
varying vec4 v_Color;
// 定义一个变换矩阵，用来接收 JavaScript 中传过来的模型投影变换矩阵，同时将变换矩阵左乘顶点坐标。
uniform mat4 u_Matrix;
void main() {
  gl_Position = u_Matrix * vec4(a_Position, 1);
  v_Color = a_Color;
  // 声明待绘制的点的大小
  gl_PointSize = 5.0;
}

`;

// 片元着色器
export const shaderFragment = `
// 设置浮点数据类型为中等精度
precision mediump float;
// 接收js传过来的颜色值（RGBA）
varying vec4 v_Color;
void main() {
  gl_FragColor = v_Color;
}
`;
