import { init } from '../lib/common.js';
import { randomColor } from '../lib/webgl-helper.js';
import { shaderVertex, shaderFragment } from './index.glsl.js';
import { throttle } from '/node_modules/lodash-es/lodash.js';

const { gl, program, canvas } = init(shaderVertex, shaderFragment);

// 定义三角形的三个顶点
const positions = [1, 0, 0, 1, 0, 0];

// 获取变量 a_Position
const a_Position = gl.getAttribLocation(program, 'a_Position');
const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
const u_Color = gl.getUniformLocation(program, 'u_Color');

// 设置 a_Screen_Size
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

// 创建缓冲区
const buffer = gl.createBuffer();

// 绑定缓冲区为WebGl当前缓冲区 gl.ARRAY_BUFFER
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

// 往缓冲区写入数据
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 注意，着色器程序中的变量需要强类型数据，所以我们在往缓冲区写数据的时候，
// JS 的弱类型数组一定要用类型化数组转化一下。上面的 new Float32Array(positions)，
// 目的就是将 JavaScript 中的弱类型数组转化为强类型数组。

/*
1. 首先，创建了一个保存顶点坐标的数组，保存了三角形的顶点信息。
2. 然后我们使用gl.createBuffer创建了一个缓冲区，并通过gl.bindBuffer(gl.ARRAY_BUFFER, buffer)绑定 buffer 为当前缓冲区。
3. 之后我们用new Float32Array(positions)将顶点数组转化为更严谨的类型化数组。
4. 最后我们使用 gl.bufferData 将类型化后的数组复制到缓冲区中，最后一个参数 gl.STATIC_DRAW 提示 WebGL 我们不会频繁改变缓冲区中的数据，WebGL 会根据这个参数做一些优化处理。
*/

// 我们需要告诉 WebGL 如何从之前创建的缓冲区中获取数据，并且传递给顶点着色器中的 a_Position 属性。 那么，首先启用对应属性 a_Position：
gl.enableVertexAttribArray(a_Position);

// 接下来我们需要设置从缓冲区中取数据的方式：
// 每次取两个数据
const size = 2;
// 每个数据的类型是32位浮点型
const type = gl.FLOAT;
// 不需要归一化数据
const normalized = false;
// 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点
const stride = 0;
// 从缓冲起始位置开始读取
const offset = 0;
// 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer
gl.vertexAttribPointer(a_Position, size, type, normalized, stride, offset);

// 需要注意的是，我们通过 gl.vertexAttribPointer 将属性绑定到了当前的缓冲区，
// 即使之后我们使用 bindBuffer 绑定到其他缓冲区时，a_Position 也依然会从 buffer 这个缓冲区中获取数据。

/*
gl.vertexAttribPointer (target, size, type, normalize, stride, offset)。
- target： 允许哪个属性读取当前缓冲区的数据。
- size：一次取几个数据赋值给 target 指定的目标属性。在我们的示例中，顶点着色器中 a_Position 是 vec2 类型，即每次接收两个数据，所以 size 设置为 2。以后我们绘制立体模型的时候，a_Position 会接收三个数据，size 相应地也会设置成 3。
- type：数据类型，一般而言都是浮点型。
- normalize：是否需要将非浮点类型数据单位化到【-1, 1】区间。
- stride：步长，即每个顶点所包含数据的字节数，默认是 0 ，0 表示一个属性的数据是连续存放的。在我们的例子中，我们的一个顶点包含两个分量，X 坐标和 Y 坐标，每个分量都是一个 Float32 类型，占 4 个字节，所以，stride = 2 * 4 = 8 个字节。但我们的例子中，缓冲区只为一个属性a_Position服务，缓冲区的数据是连续存放的，因此我们可以使用默认值 0 来表示。但如果我们的缓冲区为多个属性所共用，那么 stride 就不能设置为 0 了，需要进行计算。
- offset：在每个步长的数据里，目标属性需要偏移多少字节开始读取。在我们的例子中，buffer 只为 a_Position 一个属性服务，所以 offset 为 0 * 4 = 0。
*/

// ===== example 1：绘制三角形

// // 绘制图元设置为三角形
// const primitiveType = gl.TRIANGLES;
// // 从顶点数组的开始位置取顶点数据
// const first = 0;
// // 因为我们绘制三个点，所以执行三次顶点绘制操作。
// const count = 3;
// gl.drawArrays(primitiveType, first, count);

// ===== example 2： 通过点击三个点绘制三角形

canvas.addEventListener(
  'click',
  throttle((e) => {
    const x = e.pageX;
    const y = e.pageY;
    // console.log(x, y);
    positions.push(x, y);
    if (positions.length % 6 == 0) {
      // 向缓冲区中复制新的顶点数据。
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      const { r, g, b, a } = randomColor();
      gl.uniform4f(u_Color, r, g, b, a);
      render(gl);
    }
  }, 100)
);

// 渲染
function render(gl) {
  gl.clearColor(0, 0, 0, 1.0);
  // 用上一步设置的清空画布颜色清空画布。
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 绘制图元设置为三角形
  const primitiveType = gl.TRIANGLES;
  // 从顶点数组的开始位置取顶点数据
  const first = 0;
  // 因为我们要绘制 N 个点，所以执行 N 次顶点绘制操作。
  const count = positions.length / 2;
  gl.drawArrays(primitiveType, first, count);
}
