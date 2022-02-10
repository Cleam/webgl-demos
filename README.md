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

## d6 - 基本三角形、三角带、三角扇绘制矩形、圆形、环形

> 示例代码：[src/d6](./src/d6/index.html)

**请谨记，组成三角形的顶点要按照一定的顺序绘制。默认情况下，WebGL 会认为顶点顺序为逆时针时代表正面，反之则是背面，区分正面、背面的目的在于，如果开启了背面剔除功能的话，背面是不会被绘制的。当我们绘制 3D 形体的时候，这个设置很重要。**

```js
// 开启多边形剔除（多边形剔除功能默认不开启）
gl.enable(gl.CULL_FACE);
// 剔除正面
gl.cullFace(gl.FRONT); // 可选值：gl.FRONT gl.BACK gl.FRONT_AND_BACK， 默认值：gl.BACK
```

### WebGLRenderingContext.drawElements()

从数组数据渲染图元。

语法：`void gl.drawElements(mode, count, type, offset);`

- mode: 枚举类型 指定要渲染的图元类型。可以是以下类型:
  - gl.POINTS: 画单独的点。
  - gl.LINE_STRIP: 画一条直线到下一个顶点。
  - gl.LINE_LOOP: 绘制一条直线到下一个顶点，并将最后一个顶点返回到第一个顶点.
  - gl.LINES: 在一对顶点之间画一条线.
  - [gl.TRIANGLE_STRIP](https://en.wikipedia.org/wiki/Triangle_strip)
  - [gl.TRIANGLE_FAN](https://en.wikipedia.org/wiki/Triangle_fan)
  - gl.TRIANGLES: 为一组三个顶点绘制一个三角形
- count: 整数型 指定要渲染的元素数量.
- type: 枚举类型 指定元素数组缓冲区中的值的类型。可能的值是:
  - gl.UNSIGNED_BYTE
  - gl.UNSIGNED_SHORT
  - 当使用[OES_element_index_uint](https://developer.mozilla.org/en-US/docs/Web/API/OES_element_index_uint)扩展时:
    - gl.UNSIGNED_INT
- offset: 字节单位 指定元素数组缓冲区中的偏移量。必须是给定类型大小的有效倍数

## d7 - 纹理贴图

> 示例代码：[src/d7](./src/d7/index.html)

WebGL 对图片素材是有严格要求的，图片的宽度和高度必须是 2 的 N 次幂，比如 16 x 16，32 x 32，64 x 64 等。实际上，不是这个尺寸的图片也能进行贴图，但是这样会使得贴图过程更复杂，从而影响性能，所以我们在提供图片素材的时候最好参照这个规范。

**纹理坐标系统**: 纹理也有一套自己的坐标系统，为了和顶点坐标加以区分，通常把纹理坐标称为`UV`，`U`代表横轴坐标，`V`代表纵轴坐标。

![纹理坐标学习](./src/assets/d7_01.awebp)

纹理坐标系统可以理解为一个边长为 1 的正方形。

**贴图的注意点**：

- 图片最好满足 2^m x 2^n 的尺寸要求。
- 图片数据首先加载到内存中，才能够在纹理中使用。
- 图片资源加载前要先解决跨域问题。

## d1~d7 - 总结

- GLSL：着色器
  - 数据类型
    - vec2：2 维向量容器。
    - vec4：4 维向量容器。
    - 运算法则：向量与向量、向量与浮点数的运算法则。
  - 修饰符
    - attribute：属性修饰符。
    - uniform：全局变量修饰符。
    - varying：顶点着色器传递给片元着色器的属性修饰符。
  - precision：设置精度
    - highp：高精度。
    - mediump：中等精度。
    - lowp：低精度。
  - 内置变量
    - gl_Position：顶点坐标。
    - gl_FragColor：片元颜色。
    - gl_PointSize：顶点大小。
  - 屏幕坐标系到设备坐标系的转换。
    - 屏幕坐标系左上角为原点，X 轴坐标向右为正，Y 轴坐标向下为正。
    - 坐标范围：
      - X轴：【0, canvas.width】
      - Y轴：【0, canvas.height】
    - 设备坐标系以屏幕中心为原点，X 轴坐标向右为正，Y 轴向上为正。
    - 坐标范围是
      - X轴：【-1, 1】。
      - Y轴：【-1, 1】。
- WebGL API
  - shader：着色器对象
    - gl.createShader：创建着色器。
    - gl.shaderSource：指定着色器源码。
    - gl.compileShader：编译着色器。
  - program：着色器程序
    - gl.createProgram：创建着色器程序。
    - gl.attachShader：链接着色器对象。
    - gl.linkProgram：链接着色器程序。
    - gl.useProgram：使用着色器程序。
  - attribute：着色器属性
    - gl.getAttribLocation：获取顶点着色器中的属性位置。
    - gl.enableVertexAttribArray：启用着色器属性。
    - gl.vertexAttribPointer：设置着色器属性读取 buffer 的方式。
    - gl.vertexAttrib2f：给着色器属性赋值，值为两个浮点数。
    - gl.vertexAttrib3f：给着色器属性赋值，值为三个浮点数。
  - uniform：着色器全局属性
    - gl.getUniformLocation：获取全局变量位置。
    - gl.uniform4f：给全局变量赋值 4 个浮点数。
    - gl.uniform1i：给全局变量赋值 1 个整数。
  - buffer：缓冲区
    - gl.createBuffer：创建缓冲区对象。
    - gl.bindBuffer：将缓冲区对象设置为当前缓冲。
    - gl.bufferData：向当前缓冲对象复制数据。
  - clear：清屏
    - gl.clearColor：设置清除屏幕的背景色。
    - gl.clear：清除屏幕。
  - draw：绘制
    - gl.drawArrays：数组绘制方式。
    - gl.drawElements：索引绘制方式。
  - 图元
    - gl.POINTS：点。
    - gl.LINE：基本线段。
    - gl.LINE_STRIP：连续线段。
    - gl.LINE_LOOP：闭合线段。
    - gl.TRIANGLES：基本三角形。
    - gl.TRIANGLE_STRIP：三角带。
    - gl.TRIANGLE_FAN：三角扇。
  - 纹理
    - gl.createTexture：创建纹理对象。
    - gl.activeTexture：激活纹理单元。
    - gl.bindTexture：绑定纹理对象到当前纹理。
    - gl.texImage2D：将图片数据传递给 GPU。
    - gl.texParameterf：设置图片放大缩小时的过滤算法。

## d8 - 立方体、球体、椎体

> 示例代码：[src/d8](./src/d8/index.html)

内容：

- WebGL 坐标系。
  - 裁剪坐标系。
  - NDC 坐标系。
- 坐标系变换。
  - 模型变换。
  - 投影变换。
- 立方体、球体、椎体是如何用三角面组成的。
- 背面剔除的作用。

WebGL 采用左手坐标系，X 轴向右为正，Y 轴向上为正，Z 轴沿着屏幕往里为正，如下图：

![WebGL采用左手坐标系](src/assets/d8_01.awebp)

裁剪坐标系中的坐标通常由四个分量表示：(x, y, z, w)。请注意，w 分量代表`齐次坐标分量`，在之前的例子中，w 都是设置成 1 ，这样做的目的是让裁剪坐标系和 NDC 坐标系就保持一致，省去裁剪坐标到 NDC 坐标的转换过程。

gl_Position 接收到裁剪坐标之后，顶点着色器会对坐标进行透视除法，透视除法的公式是 (x/w, y/w, z/w, w/w) ，透视除法过后，顶点在裁剪坐标系中的坐标就会变成 NDC 坐标系中的坐标，各个坐标的取值范围将被限制在【-1，1】之间，如果某个坐标超出这个范围，将会被 GPU 丢弃。

> 透视除法这个步骤是顶点着色器程序黑盒执行的，对开发者来说是透明的，无法通过编程手段干预。但是我们需要明白有这么一个过程存在。

- 引入`模型变换`让立方体可以转动，以便我们能观察其他表面。
- 引入`投影变换`让我们的正方体能够以正常比例渲染到目标设备，不再随视口的变化而拉伸失真。

> 请谨记：每个转换可以用一个矩阵来表示，转换矩阵相乘，得出的最终矩阵用来表示组合变换。

旋转动画实现：每隔 50 ms 分别绕 X 轴和 Y 轴转动 1 度，然后将旋转对应的矩阵传给顶点着色器。

## d9 - 绘制多个物体（进一步封装绘制方法）

> 示例代码：[src/d9](./src/d9/index.html) - TODO...

WebGL 的开发步骤（WebGL 的基本绘制流程，只是在绘制单个模型时的步骤）：

- 初始化阶段
  - 创建所有着色器程序。
  - 寻找全部 attribute 参数位置。
  - 寻找全部 uniforms 参数位置。
  - 创建缓冲区，并向缓冲区上传顶点数据。
  - 创建纹理，并上传纹理数据。
- 首次渲染阶段
  - 为 uniforms 变量赋值。
  - 处理 attribute 变量
    - 使用 gl.bindBuffer 重新绑定模型的 attribute 变量。
    - 使用 gl.enableVertexAttribArray 启用 attribute 变量。
    - 使用 gl.vertexAttribPointer设置 attribute变量从缓冲区中读取数据的方式。
    - 使用 gl.bufferData 将数据传送到缓冲区中。
  - 使用 gl.drawArrays 执行绘制。
- 后续渲染阶段
  - 对发生变化的 uniforms 变量重新赋值。
  - 每个模型的 attribute 变量。
    - 使用 gl.bindBuffer 重新绑定模型的 attribute 变量。
    - 使用 gl.bufferData 重新向缓冲区上传模型的 attribute 数据。
  - 使用 gl.drawArrays 执行绘制。

## d10 - 光照、环境光

> 示例代码：[src/d10](./src/d10/index.html)

人眼看到的物体是什么颜色，就代表这个物体反射该颜色。

在计算机领域中，将光源颜色的各个分量与物体颜色的各个分量相乘，得到的就是物体所反射的颜色，即该物体在该光源照射下进入人眼的颜色：

```glsl
vec3 light = vec3(1, 1, 1);
vec3 color = vec3(1, 0, 0);
vec3 resultColor = light * color
// 在 GLSL 语言中，vec3 与 vec3 相乘的实质是将两个 vec3 的分量分别相乘，得到一个新的 vec3。
resultColor = (0 * 1, 0 * 0, 1 * 0) = (0, 0, 0)
```

**环境光**：通常，我们使用一个较小的常量乘以光的颜色来模拟环境光。

```glsl
// 假设有一个光源，发出的光线是白色光：
vec3 lightColor = vec3(1, 1, 1);
// 我们定义环境光的常量因子为 0.1
float ambientFactor = 0.1;
// 那么环境光的计算如下：
vec3 ambientColor = ambientFactor * lightColor;
// GLSL中浮点数和 vec 向量相乘的实质是将该浮点数分别与vec向量的各个分量相乘，并返回新的 vec向量
// 计算出的环境光是： 
ambientColor = (1 * 0.1, 0.1 * 1, 0.1 * 1) = (0.1, 0.1, 0.1)
```
