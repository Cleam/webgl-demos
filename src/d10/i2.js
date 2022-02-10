import {
  createSphere,
  createCone,
  transformIndicesToUnIndices,
  createCube,
  createLongCube,
  createWing,
} from '../lib/geometry.js';
import render from './render.js';

// 立方体
// let vertex = createCube(10, 6, 6);
// 多个立方体拼接
let vertex = createLongCube(10, 6, 6, 2);
// 球体
// let vertex = createSphere(5, 12, 12);
// 椎体
// let vertex = createCone(0, 6, 12, 10, 8);
// let vertex = createCone(2, 6, 12, 10, 8);
// let vertex = createCone(4, 4, 12, 10, 8);
// 梯形体
// let vertex = createWing(2, 6, 8, 6);

render(vertex, 'canvas2');
