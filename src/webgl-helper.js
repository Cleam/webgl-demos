export function getCanvas(id) {
  return document.querySelector(id);
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

export function createProgram(gl, ...shaders) {
  // 创建着色器程序
  const program = gl.createProgram();
  // 将顶点着色器、片元着色器挂载到着色器程序上
  // gl.attachShader(program, vertexShader);
  // gl.attachShader(program, fragmentShader);
  shaders.forEach((shader) => {
    gl.attachShader(program, shader);
  });
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

export function randomColor() {
  return {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
    a: 1, // Number(Math.random().toFixed(1)),
  };
}

export function createBuffer(
  gl,
  attribute,
  size,
  type = gl.FLOAT,
  normalized = false,
  stride = 0,
  offset = 0
) {
  // 我们需要告诉 WebGL 如何从之前创建的缓冲区中获取数据，并且传递给顶点着色器中的属性。
  // 那么，首先启用对应属性：
  gl.enableVertexAttribArray(attribute);
  const buffer = gl.createBuffer();
  // 将当前 buffer 设置为 buffer ，接下来对 buffer 的操作都是针对 buffer 了。
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // 设置 attribute 变量读取 buffer 缓冲区的方式。
  gl.vertexAttribPointer(attribute, size, type, normalized, stride, offset);
  return buffer;
}

export function loadTexture(gl, src, attribute, callback) {
  let img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    // 激活 0 号纹理通道gl.TEXTURE0，0 号纹理通道是默认值，可以省略。
    gl.activeTexture(gl.TEXTURE0);
    // 创建纹理对象
    let texture = gl.createTexture();
    // 将纹理对象绑定到目标纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 将图像数据传递给纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    // 设置纹理缩小、放大的滤波器
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // 为片元着色器传递0号纹理单元
    gl.uniform1i(attribute, 0);
    callback && callback();
  };
  img.src = src;
}
