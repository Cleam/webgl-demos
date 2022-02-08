import { init } from '../common.js';
import { loadTexture } from '../webgl-helper.js';
import { shaderVertex, shaderFragment } from './index.glsl.js';

const { gl, program, canvas } = init(shaderVertex, shaderFragment);

// 获取变量 a_Screen_Size
const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
// 将 canvas 尺寸传递给顶点着色器。
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);
// 获取变量a_Position a_Uv
const a_Position = gl.getAttribLocation(program, 'a_Position');
gl.enableVertexAttribArray(a_Position);
const a_Uv = gl.getAttribLocation(program, 'a_Uv');
gl.enableVertexAttribArray(a_Uv);

const u_Texture = gl.getUniformLocation(program, 'u_Texture');

// 定义六个顶点，这六个顶点能够组成一个矩形，并为顶点指定纹理坐标。
// prettier-ignore
const positions = [
    30, 30, 0, 0,    //V0
    30, 300, 0, 1,   //V1
    300, 300, 1, 1,  //V2
    30, 30, 0, 0,    //V0
    300, 300, 1, 1,  //V2
    300, 30, 1, 0    //V3
  ];
// 创建缓冲区
const buffer = gl.createBuffer();
// 将缓冲区绑定到目标
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 设置 a_Position 属性从缓冲区读取数据的方式
// size: a_Position 是vec2 所以 size = 2
// stripe: 步长，每个顶点包含4个分量，坐标分量（2个） uv分量（2个），每个分量都是一个 Float32 类型，占 4 个字节，所以步长为 (2 + 2) * 4 = 16
// offset: 偏移，a_Position读取数据不需要偏移，直接从0开始读取，所以 offset = 0；a_Uv需要偏移2个分量开始读取所以 offset = 2 * 4 = 8
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 16, 0);
// 设置 a_Uv 属性从缓冲区读取数据的方式
gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 16, 8);
// 向缓冲区传递数据
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

gl.clearColor(0, 0, 0, 1);
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  if (positions.length > 0) {
    gl.drawArrays(gl.TRIANGLES, 0, positions.length / 4);
  }
}

loadTexture(gl, '/src/assets/2.jpg', u_Texture, render);
