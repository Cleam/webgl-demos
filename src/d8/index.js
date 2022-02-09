import { init } from '../lib/common.js';
import { shaderVertex, shaderFragment } from './index.glsl.js';
import matrix from '../lib/webgl-matrix.js';
import lib3d from '../lib/lib3d.js';

const { gl, program } = init(shaderVertex, shaderFragment);

// 获取变量a_Position a_Color
const a_Position = gl.getAttribLocation(program, 'a_Position');
const a_Color = gl.getAttribLocation(program, 'a_Color');
// 启用属性
gl.enableVertexAttribArray(a_Position);
gl.enableVertexAttribArray(a_Color);

const u_Matrix = gl.getUniformLocation(program, 'u_Matrix');

// 裁剪坐标系中的坐标通常由四个分量表示：(x, y, z, w)。
// 请注意，w 分量代表齐次坐标分量，在之前的例子中，w 都是设置成 1 ，
// 这样做的目的是让裁剪坐标系和 NDC 坐标系就保持一致，省去裁剪坐标到 NDC 坐标的转换过程。

// gl_Position 接收到裁剪坐标之后，顶点着色器会对坐标进行透视除法，
// 透视除法的公式是 (x/w, y/w, z/w, w/w) ，
// 透视除法过后，顶点在裁剪坐标系中的坐标就会变成 NDC 坐标系中的坐标，
// 各个坐标的取值范围将被限制在【-1，1】之间，如果某个坐标超出这个范围，将会被 GPU 丢弃。

// 透视除法这个步骤是顶点着色器程序黑盒执行的，对开发者来说是透明的，无法通过编程手段干预。
// 但是我们需要明白有这么一个过程存在。

// 在之前章节的例子中，我们给出的顶点坐标都是基于屏幕坐标系，然后在顶点着色器中对顶点作简单转换处理，转变成 NDC 坐标。
// 本节会忽略裁剪坐标系之前的一些坐标变换，在 JavaScript 中直接采用裁剪坐标系坐标来表示顶点位置。

// 正方体顶点的坐标信息（6个面）
// prettier-ignore
const positions = [
  -0.5, -0.5, 0.5, 1, 0, 0, 1,
  0.5, -0.5, 0.5, 1, 0, 0, 1,
  0.5, 0.5, 0.5, 1, 0, 0, 1,
  -0.5, 0.5, 0.5, 1, 0, 0, 1,
  
  -0.5, 0.5, 0.5, 0, 1, 0, 1,
  -0.5, 0.5, -0.5, 0, 1, 0, 1,
  -0.5, -0.5, -0.5, 0, 1, 0, 1,
  -0.5, -0.5, 0.5, 0, 1, 0, 1,

  0.5, 0.5, 0.5, 0, 0, 1, 1,
  0.5, -0.5, 0.5, 0, 0, 1, 1,
  0.5, -0.5, -0.5, 0, 0, 1, 1,
  0.5, 0.5, -0.5, 0, 0, 1, 1,

  0.5, 0.5, -0.5, 1, 0, 1, 1,
  0.5, -0.5, -0.5, 1, 0, 1, 1,
  -0.5, -0.5, -0.5, 1, 0, 1, 1,
  -0.5, 0.5, -0.5, 1, 0, 1, 1,

  -0.5, 0.5, 0.5, 1, 1, 0, 1,
  0.5, 0.5, 0.5, 1, 1, 0, 1,
  0.5, 0.5, -0.5, 1, 1, 0, 1,
  -0.5, 0.5, -0.5, 1, 1, 0, 1,

  -0.5, -0.5, 0.5, 0, 1, 1, 1,
  -0.5, -0.5, -0.5, 0, 1, 1, 1,
  0.5, -0.5, -0.5, 0, 1, 1, 1,
  0.5, -0.5, 0.5, 0, 1, 1, 1,
];

// 创建buffer缓冲区
const positionsBuffer = gl.createBuffer();
// 将缓冲区绑定到目标
gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
// 定义buffer数据读取方式（该代码必须在bindBuffer之后，否则报错“WebGL: no ARRAY_BUFFER is bound and offset is non-zero”）
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 7 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(
  a_Color,
  4,
  gl.FLOAT,
  false,
  7 * Float32Array.BYTES_PER_ELEMENT,
  3 * Float32Array.BYTES_PER_ELEMENT
);
// 向缓冲区写入数据
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 定义顶点索引（6个面 * 4个顶点 = 24）
// prettier-ignore
const indices = [
  0, 1, 2, 0, 
  2, 3, 4, 5, 
  6, 4, 6, 7, 
  8, 9, 10, 8, 
  10, 11, 12, 13, 
  14, 12, 14, 15, 
  16, 17, 18, 16,
  18, 19, 20, 21, 
  22, 20, 22, 23
];

const indicesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

//设置清屏颜色为黑色。
gl.clearColor(0, 0, 0, 1);
//隐藏背面
gl.enable(gl.CULL_FACE);

const aspect = canvas.width / canvas.height;
// 计算正交投影矩阵
const projectionMatrix = matrix.ortho(-aspect * 4, aspect * 4, -4, 4, 100, -100);
const deg2radians = lib3d.math.deg2radians;

gl.clear(gl.COLOR_BUFFER_BIT);

/*渲染*/
function render() {
  xAngle += 1;
  yAngle += 1;
  // 先绕 Y 轴旋转矩阵。
  matrix.rotationY(deg2radians(yAngle), dstMatrix);
  // 再绕 X 轴旋转
  matrix.multiply(dstMatrix, matrix.rotationX(deg2radians(xAngle), tmpMatrix), dstMatrix);
  // 模型投影矩阵。
  matrix.multiply(projectionMatrix, dstMatrix, dstMatrix);

  gl.uniformMatrix4fv(u_Matrix, false, dstMatrix);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  if (!playing) {
    return;
  }
  requestAnimationFrame(render);
}

var playing = false;
var xAngle = 0;
var yAngle = 0;
var dstMatrix = matrix.identity();
var tmpMatrix = matrix.identity();
document.body.addEventListener('click', function () {
  playing = !playing;
  render();
});
render();
