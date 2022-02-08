// 顶点着色器
export const shaderVertex = `
// 设置精度
precision mediump float;
// 接收顶点坐标 (x, y)
attribute vec2 a_Position;
// 接收 canvas 尺寸 (width, height)
attribute vec2 a_Screen_Size;
// 接收js传递过来的顶点 UV 坐标
attribute vec2 a_Uv;
// 将接收的uv坐标传递给片元着色器
varying vec2 v_Uv;
void main() {
  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
  position = position * vec2(1.0, -1.0);
  gl_Position = vec4(position, 0.0, 1.0);
  // 将接收到的uv坐标传递给片元着色器
  v_Uv = a_Uv;
}
`;

// 片元着色器
export const shaderFragment = `
// 设置精度
precision mediump float;
// 接收顶点着色器传递过来的uv值。
varying vec2 v_Uv;
// 接收 js 传递过来的纹理。
uniform sampler2D u_Texture;
void main() {
  // 提取纹理对应uv坐标上的颜色，赋值给当前片元（像素）。
  gl_FragColor = texture2D(u_Texture, vec2(v_Uv.x, v_Uv.y));
}
`;
