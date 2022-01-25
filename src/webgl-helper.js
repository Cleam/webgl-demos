export function getCanvas(id) {
  return document.querySelector('#canvas');
}

export function getWebGLContext(canvas) {
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}

export function createShader(gl, shaderType, shaderSource) {
  // 创建(顶点/片元)着色器对象
  const shader = gl.createShader(shaderType);
  // 将源码分配给(顶点/片元)着色器对象
  gl.shaderSource(shader, shaderSource);
  // 编译(顶点/片元)着色器程序
  gl.compileShader(shader);
  return shader;
}

export function createProgram(gl, vertexShader, fragmentShader) {
  // 创建着色器程序
  const program = gl.createProgram();
  // 将顶点着色器、片元着色器挂载到着色器程序上
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  // 链接着色器程序
  gl.linkProgram(program);
  return program;
}

export function resizeCanvas(canvas, width, height) {
  if (canvas.width !== width) {
    canvas.width = width ? width : window.innerWidth;
  }
  if (canvas.height !== height) {
    canvas.height = height ? height : window.innerHeight;
  }
}
