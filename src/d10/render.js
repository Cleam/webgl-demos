import { init } from '../lib/common.js';
import { shaderVertex, shaderFragment } from './index.glsl.js';
import matrix from '../lib/webgl-matrix.js';
import { Vector3 } from '../lib/lib3d.js';
import { transformIndicesToUnIndices } from '../lib/geometry.js';
import {
  createColorForVertex,
  $$,
  getRGBFromColor,
  getHexColorFromRGB,
} from '../lib/webgl-helper.js';

export default (vertex, canvasId = 'canvas') => {
  const { gl, program, canvas } = init(shaderVertex, shaderFragment, canvasId);

  // 获取变量a_Position a_Color
  const a_Position = gl.getAttribLocation(program, 'a_Position');
  const a_Color = gl.getAttribLocation(program, 'a_Color');
  // 启用属性
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_Color);

  // 获取变量u_LightColor（环境光） u_AmbientFactor（环境光强度因子）
  const u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
  const u_AmbientFactor = gl.getUniformLocation(program, 'u_AmbientFactor');

  const u_Matrix = gl.getUniformLocation(program, 'u_Matrix');

  vertex = transformIndicesToUnIndices(vertex);
  createColorForVertex(vertex);

  // console.log('vertex :>> ', vertex);

  const positions = vertex.positions;
  const colors = vertex.colors;

  // const aspect = canvas.clientWidth / canvas.clientHeight;
  // const fieldOfViewRadians = 60;
  // const projectionMatrix = matrix.perspective(fieldOfViewRadians, aspect, 1, 2000);
  // const cameraPosition = new Vector3(0, 0, 30);
  // const target = new Vector3(0, 0, 0);
  // const up = new Vector3(0, 1, 0);
  // const cameraMatrix = matrix.lookAt(cameraPosition, target, up);
  // const viewMatrix = matrix.inverse(cameraMatrix);
  // const viewProjectionMatrix = matrix.multiply(projectionMatrix, viewMatrix);

  // 屏幕宽高比
  const rate = canvas.width / canvas.height;
  // 正交投影矩阵
  const viewProjectionMatrix = matrix.ortho(-rate * 15, rate * 15, -15, 15, 100, -100);

  gl.uniformMatrix4fv(u_Matrix, false, viewProjectionMatrix);

  // 设置环境光颜色、环境光强度因子
  gl.uniform3f(u_LightColor, 1, 1, 1);
  gl.uniform1f(u_AmbientFactor, $$('#ambientFactor').value);

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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (positions.length <= 0) {
      return;
    }
    //绘制图元设置为三角形。
    var primitiveType = gl.TRIANGLES;
    gl.drawArrays(primitiveType, 0, positions.length / 3);
  }

  //设置清屏颜色
  gl.clearColor(0, 0, 0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  let yAngle = 0;
  let xAngle = 0;
  let timer = null;
  let matrixX = matrix.identity();
  let matrixY = matrix.identity();
  let autoColor = false; // 自动颜色
  let autoFactor = false; // 自动强度因子

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
        autoColorAndFactor();
        render(gl);
      }, 50); // 时间太短会导致渲染异常
    }
  }

  let factor = 1;
  let factorStep = 0.02;
  const color = {
    r: 255,
    g: 255,
    b: 255,
  };
  let colorRStep = 6;
  let colorGStep = 5;
  let colorBStep = 4;
  function autoColorAndFactor() {
    if (autoColor) {
      if (color.r >= 255 || color.r <= 60) {
        colorRStep *= -1;
      }
      if (color.g >= 255 || color.g <= 60) {
        colorGStep *= -1;
      }
      if (color.b >= 255 || color.g <= 60) {
        colorBStep *= -1;
      }

      color.r += colorRStep;
      color.g += colorGStep;
      color.b += colorBStep;

      color.r = color.r > 255 ? 255 : color.r < 0 ? 0 : color.r;
      color.g = color.g > 255 ? 255 : color.g < 0 ? 0 : color.g;
      color.b = color.b > 255 ? 255 : color.b < 0 ? 0 : color.b;

      // 自动颜色
      $$('#light').innerText = 'r :' + color.r + ', g :' + color.g + ', b :' + color.b;
      $$('#lightColor').value = getHexColorFromRGB(color);
      gl.uniform3f(u_LightColor, color.r / 255, color.g / 255, color.b / 255);
    }

    if (autoFactor) {
      if (factor >= 1 || factor <= 0) {
        factorStep *= -1;
      }
      factor += factorStep;
      factor = Math.round(factor * 100) / 100;
      // 自动强度因子
      $$('#factor').innerText = factor;
      $$('#ambientFactor').value = factor;
      gl.uniform1f(u_AmbientFactor, factor);
    }
  }

  render(gl);

  $$('#ambientFactor').addEventListener('input', function () {
    $$('#factor').innerText = this.value;
    gl.uniform1f(u_AmbientFactor, this.value);
    render(gl);
  });

  $$('#lightColor').addEventListener('input', function () {
    const color = getRGBFromColor(this.value);
    const { r, g, b } = color;
    $$('#light').innerText = `r:${r}, g:${g}, b:${b}`;
    gl.uniform3f(u_LightColor, color.r / 255, color.g / 255, color.b / 255);
    render(gl);
  });

  $$('#play').addEventListener('click', function () {
    this.textContent = this.textContent === '播放' ? '暂停' : '播放';
    animate();
  });
  $$('#autoColor').addEventListener('click', function () {
    autoColor = !autoColor;
    this.textContent = this.textContent === '自动颜色' ? '自动颜色关' : '自动颜色';
  });
  $$('#autoFactor').addEventListener('click', function () {
    autoFactor = !autoFactor;
    this.textContent = this.textContent === '自动强度因子' ? '自动强度因子关' : '自动强度因子';
  });
};
