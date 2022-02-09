import { shaderVertex, shaderFragment } from './index.glsl.js';
import { createShader, createProgram } from '../lib/webgl-helper.js';

const { gl, program } = init(shaderVertex, shaderFragment);

const vertexShader = createShader(gl, gl.VERTEX_SHADER, shaderVertex);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shaderFragment);
const program = createProgram(gl, vertexShader, fragmentShader);

// 有时候一个 WebGL 应用包含多个 program，
// 所以在使用某个 program 绘制之前，我们要先启用它。
gl.useProgram(program);

// 开始绘制
// 设置清空画布颜色为黑色
gl.clearColor(0.0, 0.0, 0.0, 1.0);
// 用上一步设置的清空画布颜色清空画布
gl.clear(gl.COLOR_BUFFER_BIT);
// 绘制点
gl.drawArrays(gl.POINTS, 0, 1);
