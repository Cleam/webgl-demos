export const shaderVertex = `
// 设置浮点数精度为中等精度
precision mediump float;
// 接收点在 canvas 坐标系上的坐标(x, y)
attribute vec2 a_Position;
// 接收 canvas 的宽高尺寸
attribute vec2 a_Screen_Size;
void main() {
  // start 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
  position = position * vec2(1.0, -1.0);
  gl_Position = vec4(position, 0.0, 1.0);
  // end 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）

  // 声明要绘制的点的大小
  gl_PointSize = 10.0;
}

// vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
// 上面这句代码用来将浏览器窗口坐标转换成裁剪坐标，之后通过透视除法，
// 除以 w 值（此处为 1 ）转变成设备坐标（NDC坐标系）。
// 这个算法首先将(x,y) 转化到【0, 1】区间，再将 【0, 1】之间的值乘以 2 转化到 【0, 2】区间，
// 之后再减去 1 ，转化到 【-1, 1】之间的值，即 NDC 坐标。
`;

export const shaderFragment = `
// 设置浮点数精度为中等精度
precision mediump float;
// 接收JavaScript传过来的颜色值（RGBA）
uniform vec4 u_Color;
void main() {
  // 将普通的颜色表示转化为 WebGL 需要的表示方式，即将【0-255】转化到【0,1】之间。
  vec4 color = u_Color / vec4(255, 255, 255, 1);
  gl_FragColor = color;
}
`