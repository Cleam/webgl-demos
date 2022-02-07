import { init } from '../common.js';
import { createBuffer, randomColor } from '../webgl-helper.js';
import { shaderVertex, shaderFragment } from './index.glsl.js';
import { throttle } from '/node_modules/lodash-es/lodash.js';

const { gl, program, canvas } = init(shaderVertex, shaderFragment);

// 获取变量 a_Screen_Size
const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
// 将 canvas 尺寸传递给顶点着色器。
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

// ==== 使用2个buffer的方案

// // 获取变量 a_Color a_Position
// const a_Color = gl.getAttribLocation(program, 'a_Color');
// const a_Position = gl.getAttribLocation(program, 'a_Position');

// // 创建缓冲区
// const positionBuffer = createBuffer(gl, a_Position, 2);
// const colorBuffer = createBuffer(gl, a_Color, 4);

// // 保存顶点坐标
// const positions = [];
// const colors = [];
// canvas.addEventListener(
//   'click',
//   throttle((e) => {
//     positions.push(e.pageX, e.pageY);
//     // 随机颜色
//     const color = randomColor();
//     // 将随机颜色 RGBA 值添加到顶点的颜色数组中。
//     colors.push(color.r, color.g, color.b, color.a);
//     // 顶点数量是 3 的整数倍时，执行绘制操作。
//     if (positions.length % 6 === 0) {
//       gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

//       gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);

//       render(gl);
//     }
//   }, 100)
// );

// function render(gl) {
//   // 用设置的清空画布颜色清空画布。
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   // 绘制图元设置为三角形。
//   const primitiveType = gl.TRIANGLES;
//   if (positions.length > 0) {
//   // 因为我们要绘制三个点，所以执行三次顶点绘制操作。
//   gl.drawArrays(primitiveType, 0, positions.length / 2);
//   }
// }

// ==== 使用1个buffer的方案

// 获取变量 a_Color a_Position
const a_Color = gl.getAttribLocation(program, 'a_Color');
const a_Position = gl.getAttribLocation(program, 'a_Position');
gl.enableVertexAttribArray(a_Color);
gl.enableVertexAttribArray(a_Position);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// a_Position：坐标信息占用 2 个元素，故 size 设置为 2。
// 坐标信息是从第一个元素开始读取，偏移值为 0 ，所以 offset 设置为 0.

// a_Color：由于 color 信息占用 4 个元素，所以 size 设置为 4 。
// color 信息是在坐标信息之后，偏移两个元素所占的字节（2 * 4 = 8）。所以，offset 设置为 8。

// stride：代表一个顶点信息所占用的字节数，我们的示例，一个顶点占用 6 个元素，
// 每个元素占用 4 字节，所以，stride = 4 * 6 = 24 个字节。
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
// 保存顶点坐标
const posColors = [];
canvas.addEventListener(
  'click',
  throttle((e) => {
    posColors.push(e.pageX, e.pageY);
    const color = randomColor();
    posColors.push(color.r, color.g, color.b, color.a);
    // 顶点数量是 3 的整数倍时，执行绘制操作。
    if (posColors.length % 18 === 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posColors), gl.STATIC_DRAW);

      render(gl);
    }
  }, 100)
);

function render(gl) {
  // 用设置的清空画布颜色清空画布。
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 绘制图元设置为三角形。
  const primitiveType = gl.TRIANGLES;
  if (posColors.length > 0) {
    // 因为我们要绘制三个点，所以执行三次顶点绘制操作。
    gl.drawArrays(primitiveType, 0, posColors.length / 6);
  }
}

render(gl);
