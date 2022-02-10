import { init } from '../lib/common.js';
import { shaderVertex, shaderFragment } from './index.glsl.js';
import matrix from '../lib/webgl-matrix.js';
import { Vector3 } from '../lib/lib3d.js';
import { transformIndicesToUnIndices } from '../lib/geometry.js';
import { createColorForVertex } from '../lib/webgl-helper.js';

export default (vertex, canvasId = 'canvas') => {
  const { gl, program, canvas } = init(shaderVertex, shaderFragment, canvasId);

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

  // 立方体
  // let vertex = createCube(10, 6, 6);
  // 多个立方体拼接
  // let vertex = createLongCube(10, 6, 6, 2);
  // 球体
  // let vertex = createSphere(5, 12, 12);
  // 椎体
  // let vertex = createCone(0, 6, 12, 10, 8);
  // let vertex = createCone(2, 6, 12, 10, 8);
  // let vertex = createCone(4, 4, 12, 10, 8);
  // 梯形体
  // let vertex = createWing(2, 6, 8, 6);

  vertex = transformIndicesToUnIndices(vertex);
  createColorForVertex(vertex);

  // console.log('vertex :>> ', vertex);

  const positions = vertex.positions;
  const colors = vertex.colors;

  const aspect = canvas.clientWidth / canvas.clientHeight;
  const fieldOfViewRadians = 60;
  const projectionMatrix = matrix.perspective(fieldOfViewRadians, aspect, 1, 2000);
  const cameraPosition = new Vector3(0, 0, 30);
  const target = new Vector3(0, 0, 0);
  const up = new Vector3(0, 1, 0);
  const cameraMatrix = matrix.lookAt(cameraPosition, target, up);
  const viewMatrix = matrix.inverse(cameraMatrix);
  const viewProjectionMatrix = matrix.multiply(projectionMatrix, viewMatrix);

  gl.uniformMatrix4fv(u_Matrix, false, viewProjectionMatrix);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Color, 4, gl.UNSIGNED_BYTE, true, 0, 0);

  // const indicesBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  function render(gl) {
    //用上一步设置的清空画布颜色清空画布。
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (positions.length <= 0) {
      return;
    }
    //绘制图元设置为三角形。
    let primitiveType = gl.TRIANGLES;
    gl.drawArrays(primitiveType, 0, positions.length / 3);
  }
  //设置清屏颜色
  gl.clearColor(0, 0, 0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  let yAngle = 0;
  let xAngle = 0;
  let timer = null;
  // let playing = false;
  let matrixX = matrix.identity();
  let matrixY = matrix.identity();

  document.body.addEventListener('click', () => {
    // playing = !playing;
    animate();
  });

  function animate() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    } else {
      timer = setInterval(() => {
        yAngle += 1;
        xAngle += 1;
        matrixY = matrix.rotationY((Math.PI / 180) * yAngle, matrixY);
        matrixX = matrix.rotateX(matrixY, (Math.PI / 180) * xAngle, matrixX);

        gl.uniformMatrix4fv(u_Matrix, false, matrix.multiply(viewProjectionMatrix, matrixX));
        render(gl);
      }, 50); // 时间太短会导致渲染异常
    }

    // 使用这种方式，我电脑（mbp 2018款）会出现渲染异常，可能频率太快导致部分三角形渲染不出来。
    // yAngle += 1;
    // xAngle += 1;
    // matrixY = matrix.rotationY((Math.PI / 180) * yAngle, matrixY);
    // matrixX = matrix.rotateX(matrixY, (Math.PI / 180) * xAngle, matrixX);

    // gl.uniformMatrix4fv(u_Matrix, false, matrix.multiply(viewProjectionMatrix, matrixX));
    // render(gl);
    // if (!playing) {
    //   return;
    // }
    // requestAnimationFrame(animate);
  }
  // render(gl);
  animate();
};
