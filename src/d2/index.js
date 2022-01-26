import { shaderVertex, shaderFragment } from './index.glsl.js';
import { createShader, createProgram, randomColor } from '../webgl-helper.js';

const { gl, program, canvas } = init(shaderVertex, shaderFragment);

const vertexShader = createShader(gl, gl.VERTEX_SHADER, shaderVertex);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shaderFragment);
const program = createProgram(gl, vertexShader, fragmentShader);

// 有时候一个 WebGL 应用包含多个 program，
// 所以在使用某个 program 绘制之前，我们要先启用它。
gl.useProgram(program);

// 开始绘制
// 设置清空画布颜色为黑色
gl.clearColor(0.0, 0.0, 0.0, 1.0);
// 用上一步设置的清空画布颜色清空画布
gl.clear(gl.COLOR_BUFFER_BIT);
// // 绘制点
// gl.drawArrays(gl.POINTS, 0, 1);

// 获取变量a_Position a_Screen_Size u_Color
const a_Position = gl.getAttribLocation(program, 'a_Position');
const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
const u_Color = gl.getUniformLocation(program, 'u_Color');

// 为顶点着色器中的 a_Screen_Size 传递 canvas 的宽高信息
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

// 存储点击位置的数组
const points = [];
canvas.addEventListener('click', (e) => {
  console.log('e :>> ', e);
  const x = e.pageX;
  const y = e.pageY;
  const color = randomColor();

  points.push({ x, y, color });

  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (const p of points) {
    const c = p.color;
    console.log(p);
    // 为片元着色器中的 u_Color 传递随机颜色
    // gl.uniform4f(u_Color, 255, 0, 0, 1);
    gl.uniform4f(u_Color, c.r, c.g, c.b, c.a);
    // 为顶点着色器中的 a_Position 传递顶点坐标。
    gl.vertexAttrib2f(a_Position, p.x, p.y);
    // 绘制点
    gl.drawArrays(gl.POINTS, 0, 1);
  }
});
