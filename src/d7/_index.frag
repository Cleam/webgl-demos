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