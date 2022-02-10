precision mediump float;
// 顶点坐标
attribute vec4 a_Position;
// 顶点颜色
attribute vec4 a_Color;
// 顶点法向量
attribute vec3 a_Normal;
// 传递给片元着色器的法向量
varying vec3 v_Normal;
// 传递给片元着色器的颜色
varying vec4 v_Color;
// 模型视图投影变换矩阵
uniform mat4 u_MvpMatrix;

void main() {
  // 将顶点坐标转化成裁剪坐标系下的坐标。
  gl_Position = u_MvpMatrix * a_Position;
  // 将顶点颜色传递给片元着色器
  v_Color = a_Color;
  // 将顶点法向量传递给片元着色器
  v_Normal = a_Normal;
}