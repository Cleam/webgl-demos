# webgl-demos

[《WebGL 入门与实践》](https://juejin.cn/book/6844733755580481543) - 学习笔记

## d1

> 示例代码：[src/d1](./src/d1/index.html)

- WebGL 是一组图形 API，允许我们使用 JavaScript 控制 GPU 渲染过程，进行 3D 绘图。
- WebGL 应用由 JavaScript 程序和着色器程序构成。
- WebGL 如何将 3D 模型数据显示在 2D 屏幕上。
- WebGL 编程要素：开发者需要针对 CPU 和 GPU 进行编程，CPU 部分是 JavaScript 程序，GPU 部分是着色器程序。

## d2

> 示例代码：[src/d2](./src/d2/index.html)

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

## d3 - 绘制三角形

> 示例代码：[src/d3](./src/d3/index.html)

WebGL 的基本图元包含点、线段、三角形，而三角形又分为三类

- 基本三角形: `绘制三角形的数量 = 顶点数 / 3`
![d3_01](./src/assets/d3_01.awebp)

- 三角带：`绘制三角形的数量 = 顶点数 - 2`
![d3_02](./src/assets/d3_02.awebp)

- 三角扇：`绘制三角形的数量 = 顶点数 - 2`
![d3_03](./src/assets/d3_03.awebp)

- 三角形图元分类
  - gl.TRIANGLES：基本三角形。
  - gl.TRIANGLE_STRIP：三角带。
  - gl.TRIANGLE_FAN：三角扇。
- 类型化数组的作用。
  - Float32Array：32位浮点数组。
- 使用缓冲区传递数据。
  - gl.createBuffer：创建buffer。
  - gl.bindBuffer：绑定某个缓冲区对象为当前缓冲区。
  - gl.bufferData：往缓冲区中复制数据。
  - gl.enableVertexAttribArray：启用顶点属性。
  - gl.vertexAttribPointer：设置顶点属性从缓冲区中读取数据的方式。
- 动态绘制三角形。
  - 改变顶点信息，然后通过缓冲区将改变后的顶点信息传递到着色器，重新绘制三角形。

### WebGLRenderingContext.vertexAttribPointer

告诉显卡从当前绑定的缓冲区（bindBuffer()指定的缓冲区）中读取顶点数据。

`void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);`

- index: 指定要修改的顶点属性的索引。
- size: 指定每个顶点属性的组成数量，必须是1，2，3或4。
- type: 指定数组中每个元素的数据类型，可能是：
  - gl.BYTE: 有符号的8位整数，范围[-128, 127]
  - gl.SHORT: 有符号的16位整数，范围[-32768, 32767]
  - gl.UNSIGNED_BYTE: 无符号的8位整数，范围[0, 255]
  - gl.UNSIGNED_SHORT: 无符号的16位整数，范围[0, 65535]
  - gl.FLOAT: 32位IEEE标准的浮点数
  - 使用[WebGL2版本](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL2RenderingContext)的还可以使用以下值：
    - gl.HALF_FLOAT: 16位IEEE标准的浮点数
- normalized: 一个[GLboolean](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types)，指定整数数据值在转换为浮点数时是否应规范化到某个范围内。当转换为浮点数时是否应该将整数数值归一化到特定的范围。
  - 对于类型gl.BYTE和gl.SHORT，如果是true则将值归一化为[-1, 1]
  - 对于类型gl.UNSIGNED_BYTE和gl.UNSIGNED_SHORT，如果是true则将值归一化为[0, 1]
  - 对于类型gl.FLOAT和gl.HALF_FLOAT，此参数无效
- stride: 一个[GLsizei](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types)，以字节为单位指定连续顶点属性开始之间的偏移量(即数组中一行长度)。不能大于255。如果stride为0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
- offset: [GLintptr](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types)指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。

**异常情况（Exceptions）**:

- 如果偏移量`offset`为负，则抛出`gl.INVALID_VALUE`错误。
- 如果`stride`和`offset`不是数据类型大小的倍数，则抛出`gl.INVALID_OPERATION`错误。
- 如果没有将WebGLBuffer绑定到`ARRAY_BUFFER`目标，则抛出`gl.INVALID_OPERATION`错误。

### WebGLRenderingContext.bufferData

[WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)的`WebGLRenderingContext.bufferData()`方法创建并初始化了Buffer对象的数据存储区。

```js
// WebGL1:
void gl.bufferData(target, size, usage);
void gl.bufferData(target, ArrayBuffer? srcData, usage);
void gl.bufferData(target, ArrayBufferView srcData, usage);

// WebGL2:
void gl.bufferData(target, ArrayBufferView srcData, usage, srcOffset, length);
```

- target: [GLenum](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types)指定Buffer绑定点（目标）。可取以下值：
  - gl.ARRAY_BUFFER: 包含顶点属性的Buffer，如顶点坐标，纹理坐标数据或顶点颜色数据。
  - gl.ELEMENT_ARRAY_BUFFER: 用于元素索引的Buffer。
  - 当使用 [WebGL 2 context](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL2RenderingContext) 时，可以使用以下值：
    - gl.COPY_READ_BUFFER: 从一个Buffer对象复制到另一个Buffer对象。
    - gl.COPY_WRITE_BUFFER: 从一个Buffer对象复制到另一个Buffer对象。
    - gl.TRANSFORM_FEEDBACK_BUFFER: 用于转换反馈操作的Buffer。
    - gl.UNIFORM_BUFFER: 用于存储统一块的Buffer。
    - gl.PIXEL_PACK_BUFFER: 用于像素转换操作的Buffer。
    - gl.PIXEL_UNPACK_BUFFER: 用于像素转换操作的Buffer。
- size: [GLsizeiptr](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types) 设定Buffer对象的数据存储区大小。
- srcData: 可选, 一个[ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)，[SharedArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)或者[ArrayBufferView ](https://developer.mozilla.org/zh-CN/docs/Web/API/ArrayBufferView)类型的数组对象，将被复制到Buffer的数据存储区。 如果为null，数据存储区仍会被创建，但是不会进行初始化和定义。
- usage: [GLenum](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types)指定数据存储区的使用方法。可取以下值：
  - gl.STATIC_DRAW: 缓冲区的内容可能经常使用，而不会经常更改。内容被写入缓冲区，但不被读取。
  - gl.DYNAMIC_DRAW: 缓冲区的内容可能经常被使用，并且经常更改。内容被写入缓冲区，但不被读取。
  - gl.STREAM_DRAW: 缓冲区的内容可能不会经常使用。内容被写入缓冲区，但不被读取。
  - 当使用 WebGL 2 context 时，可以使用以下值：
    - gl.STATIC_READ: 缓冲区的内容可能经常使用，而不会经常更改。内容从缓冲区读取，但不写入。
    - gl.DYNAMIC_READ: 缓冲区的内容可能经常使用，并且经常更改。内容从缓冲区读取，但不写入。
    - gl.STREAM_READ: 缓冲区的内容可能不会经常使用。内容从缓冲区读取，但不写入。
    - gl.STATIC_COPY: 缓冲区的内容可能经常使用，而不会经常更改。用户不会从缓冲区读取内容，也不写入。
    - gl.DYNAMIC_COPY: 缓冲区的内容可能经常使用，并且经常更改。用户不会从缓冲区读取内容，也不写入。
    - gl.STREAM_COPY: 缓冲区的内容可能不会经常使用。用户不会从缓冲区读取内容，也不写入。
- srcOffset: [GLuint](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types) 指定读取缓冲时的初始元素索引偏移量。
- length: 可选, [GLuint](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types) 默认为0。

## d4 - 绘制线段

> 示例代码：[src/d4](./src/d4/index.html)

线段图元分为三种：

- LINES：基本线段。
- LINE_STRIP：带状线段。
- LINE_LOOP：环状线段。

## d5 - 绘制渐变三角形

> 示例代码：[src/d5](./src/d5/index.html)

用缓冲区向着色器传递数据有两种方式：

1. 利用一个缓冲区传递多种数据。
2. 另一种是利用多个缓冲区传递多个数据。

![d5_01](./src/assets/d5_01.awebp)

- 多个buffer传递数据

![positionBuffer](./src/assets/d5_02.awebp)
![colorBuffer](./src/assets/d5_03.awebp)

- 单个buffer传递数据

![buffer](./src/assets/d5_04.awebp)

单缓冲区不仅减少了缓冲区的数量，而且减少了传递数据的次数以及复杂度。不同点在于用单个缓冲区传递多类数据时，`gl.vertexAttribPointer`各个参数如何设置，理解这点对我们以后编程十分有用

## d6 - 绘制矩形平面

**请谨记，组成三角形的顶点要按照一定的顺序绘制。默认情况下，WebGL 会认为顶点顺序为逆时针时代表正面，反之则是背面，区分正面、背面的目的在于，如果开启了背面剔除功能的话，背面是不会被绘制的。当我们绘制 3D 形体的时候，这个设置很重要。**

