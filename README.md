# webgl-demos

[《WebGL 入门与实践》](https://juejin.cn/book/6844733755580481543) - 学习笔记

## d1

- WebGL 是一组图形 API，允许我们使用 JavaScript 控制 GPU 渲染过程，进行 3D 绘图。
- WebGL 应用由 JavaScript 程序和着色器程序构成。
- WebGL 如何将 3D 模型数据显示在 2D 屏幕上。
- WebGL 编程要素：开发者需要针对 CPU 和 GPU 进行编程，CPU 部分是 JavaScript 程序，GPU 部分是着色器程序。

## d2

- GLSL
  - gl_Position： 内置变量，用来设置顶点坐标。
  - gl_PointSize： 内置变量，用来设置顶点大小。
  - vec2：2 维向量容器，可以存储 2 个浮点数。
  - gl_FragColor： 内置变量，用来设置像素颜色。
  - vec4：4 维向量容器，可以存储 4 个浮点数。
  - precision：精度设置限定符，使用此限定符设置完精度后，之后所有该数据类型都将沿用该精度，除非单独设置。
  - 运算符：向量的对应位置进行运算，得到一个新的向量。
  - vec * 浮点数： `vec2(x, y) * 2.0 = vec(x * 2.0, y * 2.0)`。
  - vec2 * vec2：`vec2(x1, y1) * vec2(x2, y2) = vec2(x1 * x2, y1 * y2)`。
  - 加减乘除规则基本一致。但是要注意一点，如果参与运算的是两个 vec 向量，那么这两个 vec 的维数必须相同。

- JavaScript 程序如何连接着色器程序
  - createShader：创建着色器对象
  - shaderSource：提供着色器源码
  - compileShader：编译着色器对象
  - createProgram：创建着色器程序
  - attachShader：绑定着色器对象
  - linkProgram：链接着色器程序
  - useProgram：启用着色器程序

- JavaScript 如何往着色器中传递数据

  - getAttribLocation：找到着色器中的 attribute 变量地址。
  - getUniformLocation：找到着色器中的 uniform 变量地址。
  - vertexAttrib2f：给 attribute 变量传递两个浮点数。
  - uniform4f：给uniform变量传递四个浮点数。

- WebGL 绘制函数
  - drawArrays: 用指定的图元进行绘制。

- WebGL 图元
  - gl.POINTS: 将绘制图元类型设置成点图元。

本节例子的坐标系转换我们是在着色器阶段完成的，事实上，我们通常在 JavaScript 上计算出转换矩阵，然后将转换矩阵连同顶点信息一并传递给着色器。
