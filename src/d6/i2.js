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

// 绘制顶点固定的矩形

// 请谨记，组成三角形的顶点要按照一定的顺序绘制。
// 默认情况下，WebGL 会认为顶点顺序为逆时针时代表正面，反之则是背面，
// 区分正面、背面的目的在于，如果开启了背面剔除功能的话，背面是不会被绘制的。
// 当我们绘制 3D 形体的时候，这个设置很重要。

// 每个三角形由三个顶点组成，两个矩形共需要六个顶点，
// 实际有2个顶点重复，使用drawElements api来节省顶点数量

// void gl.drawElements(mode, count, type, offset);
// mode：指定绘制图元的类型，是画点，还是画线，或者是画三角形。
// count：指定绘制图形的顶点个数。
// type：指定索引缓冲区中的值的类型,常用的两个值：gl.UNSIGNED_BYTE和gl.UNSIGNED_SHORT，前者为无符号8位整数值，后者为无符号16位整数。
// offset：指定索引数组中开始绘制的位置，以字节为单位。

// 除了准备存储顶点信息的数组，还要准备存储顶点索引的数组。

// 存储顶点信息的数组
// prettier-ignore
const positions = [
  30, 30, 255, 0, 0, 1,    //V0
	30, 300, 255, 0, 0, 1,   //V1
	300, 300, 255, 0, 0, 1,  //V2
	300, 30, 0, 255, 0, 1    //V3
]
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 设置 a_Position a_Color 属性从缓冲区读取数据方式
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);

// 存储顶点索引的数组
// prettier-ignore
const indices = [
  0, 1, 2, // 第1个三角形
  0, 2, 3  // 第2个三角形
]
const indicesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

// 绘制
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
