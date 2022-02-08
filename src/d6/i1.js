import { init } from '../common.js';
import { shaderVertex, shaderFragment } from './index.glsl.js';

const { gl, program, canvas } = init(shaderVertex, shaderFragment);

// 获取变量 a_Screen_Size
const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
// 将 canvas 尺寸传递给顶点着色器。
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);
// 获取变量a_Position a_Color
const a_Position = gl.getAttribLocation(program, 'a_Position');
gl.enableVertexAttribArray(a_Position);
const a_Color = gl.getAttribLocation(program, 'a_Color');
gl.enableVertexAttribArray(a_Color);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);

// 绘制顶点固定的矩形

// 请谨记，组成三角形的顶点要按照一定的顺序绘制。
// 默认情况下，WebGL 会认为顶点顺序为逆时针时代表正面，反之则是背面，
// 区分正面、背面的目的在于，如果开启了背面剔除功能的话，背面是不会被绘制的。
// 当我们绘制 3D 形体的时候，这个设置很重要。

// 每个三角形由三个顶点组成，两个矩形共需要六个顶点
// prettier-ignore
const positions = [
  30, 30, 255, 0, 0, 1,    //V0
	30, 300, 255, 0, 0, 1,   //V1
	300, 300, 255, 0, 0, 1,  //V2
	30, 30, 0, 255, 0, 1,    //V0
	300, 300, 0, 255, 0, 1,  //V2
	300, 30, 0, 255, 0, 1,    //V3
]

// 开启正反面剔除（多边形剔除功能默认不开启）
gl.enable(gl.CULL_FACE);
// 剔除背面
gl.cullFace(gl.BACK); // 可选值：gl.FRONT gl.BACK gl.FRONT_AND_BACK， 默认值：gl.BACK

gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

gl.drawArrays(gl.TRIANGLES, 0, positions.length / 6);
