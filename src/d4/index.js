import { init } from '../common.js';
import { randomColor } from '../webgl-helper.js';
import { shaderVertex, shaderFragment } from './index.glsl.js';
import { throttle } from '/node_modules/lodash-es/lodash.js';

const { gl, program, canvas } = init(shaderVertex, shaderFragment);

// 获取变量 a_Screen_Size
const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
// 将 canvas 尺寸传递给顶点着色器。
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

// 获取变量 u_Color
const u_Color = gl.getUniformLocation(program, 'u_Color');
// 生成随机颜色
const { r, g, b, a } = randomColor();
// 将随机颜色传递给给全局变量
gl.uniform4f(u_Color, r, g, b, a);

// 获取变量 a_Position
const a_Position = gl.getAttribLocation(program, 'a_Position');
// 我们需要告诉 WebGL 如何从之前创建的缓冲区中获取数据，并且传递给顶点着色器中的 a_Position 属性。 那么，首先启用对应属性 a_Position：
gl.enableVertexAttribArray(a_Position);

// 创建缓冲区
const buffer = gl.createBuffer();
// 绑定缓冲区为WebGl当前缓冲区 gl.ARRAY_BUFFER
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 设置从缓冲区中取数据的方式： 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

// 设置清屏颜色为黑色
gl.clearColor(0, 0, 0, 1.0);

// 保存顶点坐标
const positions = [];
// 渲染
function render(e) {
  // 用上一步设置的清空画布颜色清空画布。
  gl.clear(gl.COLOR_BUFFER_BIT);
  positions.push(e.pageX, e.pageY);
  if (positions.length > 0) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 向缓冲区中复制新的顶点数据。
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
    // const { r, g, b, a } = randomColor();
    // gl.uniform4f(u_Color, r, g, b, a);
    // 设置图元类型
    // const primitiveType = gl.LINES;
    const primitiveType = gl.LINE_STRIP;
    // const primitiveType = gl.LINE_LOOP;
    // 绘制
    gl.drawArrays(primitiveType, 0, positions.length / 2);
  }
}

let mousedown = false;
canvas.addEventListener('mousedown', () => {
  mousedown = true;
});

canvas.addEventListener('mouseup', () => {
  mousedown = false;
});

canvas.addEventListener(
  'mousemove',
  throttle((e) => {
    if (mousedown) {
      render(e);
    }
  }, 0)
);
// canvas.addEventListener('click', throttle(render, 100));
