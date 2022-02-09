import { init } from '../lib/common.js';
import { shaderVertex, shaderFragment } from './index.glsl.js';

const { gl, program, canvas } = init(shaderVertex, shaderFragment);

// 获取变量 a_Screen_Size
const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
// 将 canvas 尺寸传递给顶点着色器。
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

// 获取变量a_Position a_Color
const a_Position = gl.getAttribLocation(program, 'a_Position');
const a_Color = gl.getAttribLocation(program, 'a_Color');
// 启用
gl.enableVertexAttribArray(a_Position);
gl.enableVertexAttribArray(a_Color);

// 绘制顶点固定的圆形

// 生成园顶点的函数
// x：圆心的 x 坐标
// y：圆心的 y 坐标
// radius：半径
// n：三角形的数量
function createCircleVertex(x, y, radius, n) {
  const positions = [x, y, 255, 255, 0, 1];
  for (let i = 0; i <= n; i++) {
    const angle = (i * Math.PI * 2) / n;
    positions.push(x + radius * Math.sin(angle), y + radius * Math.cos(angle), 255, 0, 0, 1);
  }
  return positions;
}

const positions = createCircleVertex(200, 200, 150, 15);
console.log('positions :>> ', positions);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 设置 a_Position a_Color 属性从缓冲区读取数据方式
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
// 创建并初始化缓冲区
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 三角带
// gl.drawArrays(gl.TRIANGLE_STRIP, 0, positions.length / 6);
// 三角扇
gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 6);
