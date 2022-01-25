// 顶点着色器
export const shaderVertex = `
void main() {
  // 声明顶点位置
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  // 声明待绘制的点的大小
  gl_PointSize = 10.0;
}
`;

// 片元着色器
export const shaderFragment = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
