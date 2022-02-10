// 顶点着色器
export const shaderVertex = `
// 设置浮点数据类型为中等精度
precision mediump float;
// 接收顶点坐标(x, y, z)
attribute vec3 a_Position;
// 接收 JavaScript 传递的顶点颜色
attribute vec4 a_Color;
// 传往片元着色器的颜色
varying vec4 v_Color;
// 接收模型-视图-投影矩阵。
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
// 光源颜色
uniform vec3 u_LightColor;
// 环境光强度因子
uniform float u_AmbientFactor;
void main() {
  // gl_FragColor = v_Color;
  vec3 ambientColor = u_AmbientFactor * u_LightColor;
  gl_FragColor = vec4(ambientColor, 1) * v_Color;
}
`;
