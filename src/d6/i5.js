import { init } from '../common.js';
import { randomColor } from '../webgl-helper.js';
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
// innerRadius：内园半径
// outerRadius：外园半径
// n：切割的边数
function createRingVertex(x, y, innerRadius, outerRadius, n) {
  // 顶点坐标及颜色数组
  const positions = [];
  let color = randomColor();
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      color = randomColor();
    }
    // color = randomColor();
    const angle = (i * Math.PI * 2) / n;
    positions.push(
      x + innerRadius * Math.sin(angle),
      y + innerRadius * Math.cos(angle),
      color.r,
      color.g,
      color.b,
      color.a
    );
    // color = randomColor();
    positions.push(
      x + outerRadius * Math.sin(angle),
      y + outerRadius * Math.cos(angle),
      color.r,
      color.g,
      color.b,
      color.a
    );
  }

  // 顶点索引数组
  const indices = [];
  for (let i = 0; i < n; i++) {
    let i0 = i * 2;
    let i1 = i * 2 + 1;
    let i2 = i * 2 + 2;
    let i3 = i * 2 + 3;
    if (i === n - 1) {
      i2 = 0;
      i3 = 1;
    }
    indices.push(i0, i2, i1, i1, i2, i3);
  }
  return {
    positions,
    indices,
  };
}

const vertex = createRingVertex(200, 200, 50, 150, 100);
console.log('vertex :>> ', vertex);

const posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
// 设置 a_Position a_Color 属性从缓冲区读取数据方式
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
// 创建并初始化缓冲区
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex.positions), gl.STATIC_DRAW);

const indicesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertex.indices), gl.STATIC_DRAW);


gl.drawElements(gl.TRIANGLES, vertex.indices.length, gl.UNSIGNED_SHORT, 0);
