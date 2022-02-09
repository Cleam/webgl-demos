import { shaderVertex, shaderFragment } from './index.glsl.js';
import { init } from '../lib/common.js';

const { gl } = init(shaderVertex, shaderFragment);

// 开始绘制
// 设置清空画布颜色为黑色
gl.clearColor(0.0, 0.0, 0.0, 1.0);
// 用上一步设置的清空画布颜色清空画布
gl.clear(gl.COLOR_BUFFER_BIT);
// 绘制点
gl.drawArrays(gl.POINTS, 0, 1);
