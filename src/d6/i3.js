import { init } from '../common.js';
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

// 绘制顶点固定的矩形 - 三角带绘制

// prettier-ignore
const positions = [
  30, 300, 0, 255, 0, 1,   //V0  
  300, 300, 255, 0, 255, 1,  //V1
  30, 30, 255, 255, 0, 1,    //V2
  300, 30, 0, 255, 0, 1    //V3
]

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 设置 a_Position a_Color 属性从缓冲区读取数据方式
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
// 创建并初始化缓冲区
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, positions.length / 6);
