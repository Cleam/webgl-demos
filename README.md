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

## d10 - 冯氏光照模型（Phone Lighting Model）：环境光

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

## d11 - 冯氏光照模型（Phone Lighting Model）：漫反射

冯氏光照模型：

- **环境光**：环境光在上节已经讲过了，主要用来模拟晚上或者阴天时，在没有光源直接照射的情况下，我们仍然能够看到物体，只是偏暗一些，通常情况我们使用一个`较小的光线因子乘以光源颜色`来模拟。
- **漫反射**：漫反射是为了模拟`平行光源`对物体的方向性影响，我们都知道，如果光源正对着物体，那么物体正对着光源的部分会更明亮，反之，背对光源的部分会暗一些。在冯氏光照模型中，漫反射分量占主要比重。
- **镜面高光**：为了模拟光线照射在`比较光滑`的物体时，物体正对光源的部分会产生`高亮效果`。该分量颜色会和光源颜色更接近。

光线照射方向根据光源的不同有两种表示方法：

- **平行光线**：光线方向是全局一致的，与照射点的位置无关，不会随着照射点的不同而不同，不是很真实。
- **点光源**：向四周发射光线，光线方向与照射点的位置有关，越靠近光源的部分越亮，光照效果比较真实。

### 计算反射光前度

因为入射角的大小与反射光的亮度成`反比`，所以我们使用`入射角的余弦值`来表示漫反射的`光线强度`。

### 光源照射方向向量的计算

```glsl
// 在世界坐标系中，假设有一光源 p0 (x0, y0, z0)。
vec3 p0 = vec3(10, 10, 10);
// 光线照射到物体表面上的一点 p1 (x1, y1, z1)。
vec3 p1 = vec3(20, 25, 30);
// 那么光线照射在该点的方向向量为：
vec3 light_Direction = p1 - p0。
```

GLSL中的`+、-、*、/`操作符的左右两个数如果是向量的话，得出的新向量的各个分量等于原有向量逐分量的相减结果。

### 计算漫反射光照

- `漫反射光照 = 光源颜色 * 漫反射光照强度因子`
- `漫反射光照强度因子 = 入射角的余弦值`

> 根据向量的运算规则，我们可以使用向量之间的点积，再除以向量的长度之积，就可以得出余弦值。
> 归一化向量的实质是将向量的长度转换成 1，得出的一个单位向量。

```glsl
// light_Direction表示光源照射方向向量。
// normal 代表当前入射点的法向量
vec3 light_Color = vec3(1, 1, 1);
// 将两个向量归一化，转换成单位向量，然后进行点积计算求出夹角余弦。
float diffuseFactor = dot(normalize(light_Direction), normalize(normal))
vec4 lightColor = vec4(light_Color * diffuseFactor, 1);
```

- `dot`：求出两个向量的点积。
- `normalize`：将向量转化为长度为 1 的向量。

## d12 - 冯氏光照模型（Phone Lighting Model）：镜面高光 和 Blin 光照模型

> todo...

## d13 - GLSL语法

### 变量命名

- 不能以 `gl_` 作为前缀，gl_ 开头的变量被用于定义 GLSL 的内部变量，这是 GLSL 保留的命名前缀。
- GLSL 的一些保留名称也不能作为变量名称，比如 `attribute、uniform、varying` 等。

### 数据类型

#### 向量

浮点向量`vec{n}`，整型向量`ivec{n}`，布尔向量`bvec{n}`。n代表2、3、4维

- vec2：存储2个浮点数。
- ivec2：存储2个整数。
- bvec2：存储2个布尔值。

> vec 向量类型会自动对元素做类型转换。

每个向量我们都可以用 `{s、t、p、q}`,`{r、g、b、a}`,`{x、y、z、w}`来表示。比如一个 4 维向量：`vec4 v = vec(1, 2, 3, 4);`那么`v.s、v.r、v.x、v[0]`表示的是该向量`第 1 个`位置的元素。

对低维向量赋值方式有：

```glsl
vec4 v = vec4(1, 2, 3, 4);
// xyzw 方式赋值
vec2 v1 = v.xy;
// stpq 赋值
vec2 v1 = v.st;
// rgba 赋值
vec2 v1 = v.rg;

// 构造函数式
vec2 v1 = vec2(v.x, v.y);
vec2 v1 = vec2(v.s, v.t);
vec2 v1 = vec2(v.r, v.g);

// 还可以这样使用：
vec4 v = vec4(1, 2, 3, 4)
vec2 v1 = vec2(v.xx);
// 通过 v.xx 的方式将 v1 的两个元素设置成 v 的第一个元素值，变成 (1, 1)。
```

向量和基础数字类型的运算：

```glsl
// 加法
vec4 v1 = v + f = (x + f, y + f, z + f, w + f);
// 减法
vec4 v1 = v - f = (x - f, y - f, z - f, w - f);
// 乘法
vec4 v1 = v * f = (x * f, y * f, z * f, w * f);
// 除法
vec4 v1 = v / f = (x / f, y / f, z / f, w / f);
```

向量和向量之间的运算：

```glsl
// 加法
vec4 v3 = v1 + v2 = (x1 + x2, y1 + y2, z1 + z2, w1 + w2);
// 减法
vec4 v3 = v1 - v2 = (x1 - x2, y1 - y2, z1 - z2, w1 - w2);
// 乘法
vec4 v3 = v1 * v2 = (v1 * v2, y1 * y2, z1 * z2, w1 * w2);
// 减法
vec4 v3 = v1 / v2 = (x1 / x2, y1 / y2, z1 / z2, w1 / w2);
```

在数学领域，向量之间还有两种乘法`点乘`和`叉乘`，具体区别在`d15 - 数学：点、向量、矩阵`章节详细介绍。GLSL 中增加了两种内置函数，用来实现点乘和叉乘运算，它们分别是`dot`和`cross`：

```glsl
// 点乘
float v3 = dot(v1, v2);
// 叉乘
vec3 v3 = cross(v1, v2);
```

在计算光照效果时，会经常使用这两个函数。

#### 矩阵

矩阵按照维度分为二阶、三阶、四阶，其中三阶和四阶矩阵用的较多。

四阶矩阵构造方法：

```glsl
// 用 16 个浮点数构造矩阵。
mat4 m = mat4(
  1, 2, 3, 4,  //第一列
  5, 6, 7, 8,  //第二列
  9, 10, 11, 12, //第三列
  13, 14, 15,16 // 第四列
);

// 用 1 个浮点数构造对角线矩阵。
mat4 a = mat4(1.0);
// mat4 传入一个浮点数构造出的矩阵，对角线上的值都是 1.0:
[  
    1.0, 0, 0, 0,
    0, 1.0, 0, 0,
    0, 0, 1.0, 0,
    0, 0, 0, 1.0
]

// 利用列向量构造
//第一列
vec4 c0 = vec4(1, 2, 3, 4);
//第二列
vec4 c1 = vec4(5, 6, 7, 8);
//第三列
vec4 c2 = vec4(1, 2, 3, 4);
//第四列
vec4 c3 = vec4(5, 6, 7, 8);

mat4 m = mat4(c0, c1, c2, c4);

// 向量与浮点数混合构造。 当然除了纯数字构造、纯向量构造，GLSL 也允许向量和数字混合构造：
vec4 c0 = vec4(1, 2, 3, 4);
vec4 c1 = vec4(5, 6, 7, 8);
vec4 c2 = vec4(1, 2, 3, 4);

mat4 m = mat4(c0, c1, c2, 5, 6, 7, 8);
```

矩阵运算

我们用的最多的就是乘法运算了，在GLSL 中，矩阵乘法用 `*` 来表示，但大家要记住，由于 GLSL 中矩阵采用的是`列主序`，所以，矩阵和向量相乘时，要置在乘号左侧，如下：

```glsl
mat4 m = mat4(1.0);
vec4 v1 = m * vec4(1, 2, 3, 4);
```

还有一些其他的矩阵运算方法，比如转置、求逆等：

```glsl
mat4 m0 = mat4(1.0);
// 转置
mat4 m1 = transpose(m0);
// 求逆
mat4 m2 = inverse(m0)
```

### 内置变量

顶点着色器

- gl_Position：顶点坐标。
- gl_PointSize：点的尺寸。
- gl_Normal：顶点法线。

片元着色器

- gl_FragColor，当前片元的颜色，类型 vec4。
- gl_FragCoord，屏幕像素的`x，y，z，1 / w`。
- gl_FragDepth，片元的最终深度值，在后面的深度测试用到，在片元着色器中我们无法修改`x, y`值，但是可以修改`z`值。

### 内置函数

GLSL 内置了很多数学函数，下面列举一些经常用到的。

#### 向量函数

| 函数      | 作用                                                          |
| --------- | ------------------------------------------------------------- |
| cross     | 计算两个向量的叉积                                            |
| dot       | 计算向量的点积。                                              |
| normalize | 归一化向量，返回一个和原向量方向相同，但是长度为1的单位向量。 |
| reflect   | 根据入射向量和法线向量，计算出反射向量。                      |
| length    | 计算向量的长度                                                |
| distance  | 计算两个向量之间的距离。                                      |

#### 常用数学函数

| 函数  | 作用                         |
| ----- | ---------------------------- |
| abs   | 将某个数的绝对值             |
| floor | 返回不大于某个数的最大整数。 |
| round | 四舍五入值                   |
| ceil  | 返回大于某个数的最小整数。   |
| fract | 返回浮点数的小数部分         |
| mod   | 取模                         |
| min   | 返回两个数中比较小的数       |
| max   | 返回两个数中比较大的数       |

#### 三角函数

GLSL 提供了很多三角函数，方便我们进行角度求值：

| 函数    | 作用                                    |
| ------- | --------------------------------------- |
| radians | 将角度（如90度）转化为弧度（PI/2）。    |
| degrees | 将弧度（如PI / 2）转化为角度（90 度）。 |
| sin     | 求弧度的正弦                            |
| cos     | 求弧度的余弦                            |
| tan     | 求弧度的正切                            |
| asin    | 根据正弦值求对应的弧度                  |
| acos    | 根据余弦值求对应的弧度                  |
| atan    | 根据正切值求对应的弧度                  |

### 限定符

- **attribute**: attribute 变量`只能定义在顶点着色器中`，它的作用是接收 JavaScript 程序传递过来的`与顶点有关的数据`，比如在之前程序中定义的顶点颜色、法线、坐标等，它们是顶点的属性。
- **uniform**: uniform 用来修饰全局变量，它既可以在顶点着色器中定义，也可以在片元着色器中定义，用来`接收与顶点无关的数据`。
- **varying**: varying变量一般是`成对定义`的，即在顶点着色器中定义，在片元着色器中使用。它所修饰的变量在传递给片元着色器之前会进行插值化处理。

## d14 - WebGL与数学

**坐标系**：

`坐标系`是一个重中之重的概念，我们在开发 3D 应用的过程中，经常会涉及到坐标系之间的转换，最经典的坐标转换流水线就涉及到`六种`坐标系，由此可见坐标系的重要性。

**点**：

`点`在 3D 领域通常指`顶点坐标`，3D 世界由很多`模型`组成，模型又由很多`面`组成，而面又由很多`点`组成。因此，`点`是组成 3D 世界的基本元素。

**向量**：

`向量`是另一个非常重要的知识点。物理和数学中的向量代表既有`大小`又有`方向`的量。通常我们使用`向量容器`来表示数学中的`点`和`向量`。

**向量计算**：3D 编程中经常使用的向量运算有以下几种。

- 点积
- 叉积
- 归一化向量
- 向量长度
- 两个向量之间的距离
- 向量基本运算
  - 向量相加
  - 向量相减
  - 向量相乘
  - 向量相除

**矩阵**：

3D 数学中最重要的一个知识点我想就是`矩阵`了，矩阵能够帮助我们以一种非常简单的方式解决大量运算的问题。比如坐标转换。一个矩阵代表一种变换，多个矩阵相乘就代表多个变换。有了矩阵，我们就不用再使用三角函数，加减乘除等繁杂的数学公式来完成坐标转换，仅仅使用一个矩阵就可以代替多种运算步骤。

**矩阵运算**：3D 编程中经常用到的矩阵运算有以下几种。

- 单位化矩阵
- 矩阵基本运算
  - 矩阵相加。
  - 矩阵相减。
  - 矩阵相乘。
  - 转置矩阵
  - 逆矩阵
- 旋转矩阵
  - 绕 X 轴旋转。
  - 绕 Y 轴旋转。
  - 绕 Z 轴旋转。
  - 绕轴向量旋转。
  - 根据欧拉角推导旋转矩阵。
  - 根据四元数推导旋转矩阵。
  - 旋转矩阵与欧拉角、四元数之间的变换。
- 平移
  - 沿 X 轴平移。
  - 沿 Y 轴平移。
  - 沿 Z 轴平移。
- 缩放
  - 沿 X 轴缩放。
  - 沿 Y 轴缩放。
  - 沿 Z 轴缩放。
- 观察矩阵
- 正射投影矩阵
- 透视投影矩阵

**常用数学函数**：3D 开发时我们经常需要使用一些数学函数完成一些数值运算，常用的有如下几种：

- sin (θ)：指定角度 θ 的正弦值。
- asin (value)：指定正弦值 value 对应的角度值。
- cos (θ)：指定角度 θ 的余弦值。
- acos (value)：指定余弦值 value 对应的角度值。
- atan (value)：指定正切值 value 对应的角度。
- tan (θ)：求 θ 的正切值。
- abs (value)：取 value 的绝对值。
- max (value1, value2)：取 value1 和 value2 之间的最大值。
- min (value1, value2)：取 value1 和 value2 之间的最小值。
- clamp (value, min, max)：如果 value 小于 min，返回 min，如果 value 大于 max ，返回 max，如果 value 介于 min 和 max 之间，返回 value。
- pow (x, n)：求 x 的 n 次幂。
- ……

**其它高等函数**：

上面的数学知识，足以支撑我们完成大部分 3D 效果了，但在做一些曲线相关应用的时候，我们还会用到一些曲线公式来求坐标，如正弦、余弦、贝塞尔公式等。感兴趣的话大家可以去看看 ThreeJS 对它们的实现。


### 总结

以上就是我们在 3D 编程中将会用到的数学知识，业界一般将这些数学算法抽象出来以方便调用，比如 `Threejs` 就有单独的 `matrix` 、`vector`、`euler`等数学类。JavaScript没有提供向量和矩阵的表示和运算，所以我们需要封装。但是 `GLSL` 内置了大部分数学运算。

有的同学会问，既然 `GLSL` 内置了这些计算，`Threejs` 为什么还要封装呢？

这是因为有些运算没有必要放在 `GLSL` 中，如果放在 `GLSL` 中反而会影响性能。比如`全局变换矩阵`，如果放在 `GLSL` 中计算，那么每个顶点变换前，都要重新计算出矩阵。模型的顶点都是很多的，这会造成大量重复运算。尽管 GPU 的运算能力很强，但那么多的无用运算还是会造成性能问题。

## d15 - 数学：点、向量、矩阵

### 向量

`向量`是既有大小，又有方向的量，在物理和工程学中又称为`矢量`，如位移，速度，加速度、光线方向等。与之对应的是`标量`，标量只有大小，没有方向。如身高、体重、距离等。

GLSL 程序中有一个向量数据结构 vec，我们经常使用它来定义点坐标或者向量，那么如果给定一个变量：

```glsl
vec3 p = vec3(x, y, z);
```

如何判断 P 代表向量还是代表顶点坐标呢？

通常使用`齐次坐标系`来解决这种混乱。`齐次坐标系`使用 `N + 1` 维向量来表示 `N 维点坐标`和 `N 维向量`。假设在 3 维坐标系中，有一个点(X, Y, Z)，那么在齐次坐标系中会使用 4 维向量来表示它 (X, Y, Z, W)。注意：W > 0。如果是向量的话，齐次坐标将向量表示为(X, Y, Z, 0)。

**请谨记：W 为 0 时代表向量。W 不为 0 代表点。**

**向量的运算**：

$$
\vec{a} = (x0, y0), \vec{b} = (x1, y1) \\
\vec{a} + \vec{b} = (x0 + x1, y0 + y1) \\
\vec{a} - \vec{b} = (x0 - x1, y0 - y1)
$$

向量相加在坐标系中表示如下：

![d15_03](src/assets/d15_03.awebp)

向量相减在坐标系中表示如下：

![d15_04](src/assets/d15_04.awebp)

$$
\vec{a} - \vec{b} = (x0 - x1, y0 - y1) \\
\begin{aligned}
\vec{b} - \vec{a} &= (x1 - x0, y1 - y0) \\
&= (-(x0 - x1), -(y0 - y1))
\end{aligned}
$$

可见 $\vec{a} - \vec{b}$ 和 $\vec{b} - \vec{a}$ 的结果大小相同，方向相反，所以不满足交换律。

**零向量**：零向量是唯一一个大小为 0 的向量。

**负向量**：负向量其实是原向量的反方向向量，大小不变，方向相反：$-\vec{a} = (-x, -y, -z)$，负向量可以理解为原向量与 -1 的乘法运算。

**向量大小**：向量的大小，也就是向量的长度（也叫向量的模），通常用 $|\vec{a}|$ 来表示，向量的大小等于向量各个分量平方之和的平方根：
$$
|\vec{a}| = \sqrt[2]{x^2+y^2}
$$

**向量与标量乘除**：向量不能和标量相加减，但是向量可以和标量相乘除，向量和标量相乘或者相除返回一个新向量，新向量的各个分量等于原向量的各个分量和标量的乘积或者商。
$$
\vec{a} \times 2 = (x \times 2, y \times 2) \\
\vec{a} \div 2 = (x \div 2, y \div 2)
$$

**单位向量**：单位向量是`长度为 1` 的向量，对于大部分向量，我们只关心向量的方向，而不在意向量的长度，这种情况下就适合用单位向量来表示。比如光线入射方向、反射方向等向量，单位向量通常也被称为`标准向量`。

对于任意一个不为 0 的向量，我们都能将它转变成同方向的单位向量，这个转变过程我们称之为`归一化向量`或者`标准化向量`。

归一化向量只需要将原向量除以原向量的长度（模）即可，一定要注意，原向量不能是零向量。

归一化向量 $\vec{a}$ 的过程：
$$
(x \div |\vec{a}|, y \div |\vec{a}|)
$$

**向量点乘**：标量和向量可以相乘，向量和向量也可以相乘，向量之间乘法包含两种：`点乘`和`叉乘`。

向量点乘就是将两个向量的各个分量的乘积相加，返回一个`标量`：
$$
\vec{a} \cdot \vec{b} = x0 \times x1 + y0 \times y1
$$
点乘的几何意义是两个向量的模相乘然后再乘以夹角的余弦。
$$
\vec{a} \cdot \vec{b} = |\vec{a}| \times |\vec{b}| \times cos(\theta)
$$
所以，我们**经常会用点乘来计算两个向量之间的夹角大小**，比如在光照模型中，我们在计算漫反射分量时，就使用了点乘公式，求出入射光和法向量之间夹角的大小，通常只求夹角的话，一般先将两个向量归一化，这样就不用再去计算向量模了，直接取点乘结果即可。

**向量叉乘**：向量叉乘是另一个重要的运算，两个向量叉乘结果是一个新向量，新向量的方向垂直于原来两个向量所在的平面，方向可以通过`右手定则`来判定，大小等于两个向量模的乘积再乘以向量夹角的正弦值，即`向量组成的平行四边形的面积`。
$$
| \vec{a} \times \vec{b} | = |\vec{a}| \times |\vec{b}| \times sin(\theta)
$$
![d15_05](/src/assets/d15_05.awebp)

叉乘一般用于3D坐标系中，经常用来计算某个面的法线。

假设有向量 $\vec{a}$ 和向量 $\vec{b}$：
$$
\vec{a} = (x1, y1, z1)\\
\vec{b} = (x2, y2, z2)
$$
那么，向量 $\vec{a}$ 和 $\vec{b}$ 的叉乘：
$$
\vec{a} \times \vec{b} = (y1z2 - y2z1, x2z1 - x1z2, x1y2 - x2y1)
$$

#### 矩阵

矩阵是按照行列排列的一系列数值得的集合，一个矩阵通常是由`m 行 n 列`组成，我们称之为 $m \times n$ 矩阵，如果 m 和 n 相同，该矩阵代表一个`方阵`，我们就可称这个方阵为 m 阶矩阵(方阵)，矩阵一般用大写字母来表示。
$$
2 阶矩阵：M = \begin{pmatrix} 1 & 2 \\ 3 & 4 \\ \end{pmatrix}
$$
**注意**：`向量`可以理解为`一个特殊的矩阵`，4 维向量既可以理解为一个 1 行 4 列矩阵，此时这个向量被称为`行向量`。也可以理解为一个 4 行 1 列矩阵，此时这个向量被称为`列向量`。
$$
\begin{aligned}
\vec{P} &= (1, 2, 3, 4) \\
&=\begin{bmatrix} 1 & 2 & 3 & 4 \\ \end{bmatrix} \\
&=\begin{bmatrix} 1 \\ 2 \\ 3 \\ 4 \\ \end{bmatrix}
\end{aligned}
$$

**矩阵的运算**：两个矩阵相加或者相减需要满足一个`条件`，即`两个矩阵必须同型`，同型的意思是，行数和列数都必须一样。一个 $m \times n$ 矩阵 和一个 $n \times m$ 矩阵（$m \neq n$）是不能进行加减的。

如果满足了以上条件，矩阵加法和减法的运算只需将两个矩阵对应位置上的元素相加或相减即可，得到的新矩阵和原矩阵同型：
$$
\begin{pmatrix} 1 & 2 \\ 3 & 4 \\ \end{pmatrix} + \begin{pmatrix} 1 & 2 \\ 3 & 4 \\ \end{pmatrix} = \begin{pmatrix} 1 + 1 & 2 + 2 \\ 3 + 3 & 4 + 4 \\ \end{pmatrix} = \begin{pmatrix} 2 & 4 \\ 6 & 8 \\ \end{pmatrix}
$$

**矩阵乘法**：矩阵既可以和标量相乘，也能和矩阵相乘，也能和向量相乘。在讲解乘法运算之前，我们必须先明确相乘的`顺序`，因为矩阵相乘`不满足交换律`（即$A \times B \neq B \times A$）。

**左乘与右乘**：所谓左乘/右乘，是指参与运算的两个因子（向量或者矩阵）在运算中的相对位置，A 左乘 B 即 $A \times B$，A 右乘 B即 $B \times A$。

比较容易的理解方式就是： `左乘就是从左边过来乘，右乘就是从右边过来乘`。

**矩阵与标量相乘**：矩阵和标量相乘，返回一个新矩阵，新矩阵的各个元素等于原矩阵各个元素与标量的乘积。
$$
\begin{pmatrix} 1 & 2 \\ 3 & 4 \\ \end{pmatrix} \times 2 = \begin{pmatrix} 1 \times 2 & 2 \times 2 \\ 3 \times 2 & 4 \times 2 \\ \end{pmatrix} = \begin{pmatrix} 2 & 4 \\ 6 & 8 \\ \end{pmatrix}
$$

**矩阵与矩阵相乘**：矩阵与矩阵相乘也要满足一定条件，假设两个矩阵能够相乘：$P = M \times N$：

- 首先，他们之间必须满足以下条件：`M 的列数等于 N 的行数`
- 其次，一个 m 行 n 列矩阵 乘以 n 行 q 列矩阵，所得到的新矩阵为 m 行 q 列，即 `m行n列 * n行q列 = m行q列`。

矩阵 M 和 N 相乘，得到新的矩阵 P：
$$
\begin {aligned}
P = M \times N
&=\begin{pmatrix} a00 & a01 \\ a10 & a11 \\ \end{pmatrix} \times \begin{pmatrix} b00 & b01 \\ b10 & b11 \\ \end{pmatrix} \\
&=\begin{pmatrix} a00 \times b00 + a01 \times b10 & a00 \times b01 + a01 \times b11  \\ a10 \times b00 + a11 \times b10  & a10 \times b01 + a11 \times b11 \\ \end{pmatrix}
\end {aligned}
$$

![d15_06](src/assets/d15_06.awebp)

另外需要谨记的是，矩阵乘法`不满足交换律`，但是`满足结合律`：

$$
A \times B \neq B \times A \\
(A \times B) \times C \equiv A \times (B \times C)
$$

关于交换律、结合律等统称为[运算律](https://baike.baidu.com/item/%E8%BF%90%E7%AE%97%E5%BE%8B/8759659)

**矩阵与向量相乘**：矩阵与向量相乘其实等价于矩阵与一阶矩阵相乘，其实质是将向量变换为另一个向量，但是要注意乘法的顺序。

**转置矩阵**：矩阵转置就是将原来矩阵的行向量转变为列向量，矩阵$M$的转置矩阵用符号 $M^T$ 来表示，假设有一个矩阵$M$：
$$
M = \begin{pmatrix} a00 & a01 \\ a10 & a11 \\ \end{pmatrix}
$$
那么$M$的转置矩阵为：
$$
M^T = \begin{pmatrix} a00 & a10 \\ a01 & a11 \\ \end{pmatrix}
$$

**逆矩阵**：[求解步骤](https://www.shuxuele.com/algebra/matrix-inverse-minors-cofactors-adjugate.html)

假设有一个 m 阶方阵 A ，如果存在一个n 阶方阵 B，使得 $A \times B = B \times A = I$ 其中 $I$ 是单位矩阵，那么 B 是 A 的逆矩阵， A 矩阵就是`可逆矩阵`，也称`非奇异矩阵`，矩阵 A 的逆矩阵 用 ${A^{-1}}$ 表示。

这里要说明一下什么是单位矩阵，单位矩阵首先是一个方阵，其次方阵对角线上的元素都为 1，其余元素为 0，比如下面就是一个 3 阶单位矩阵：
$$
\begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \\ \end{pmatrix}
$$
但并不是所有矩阵都存在逆矩阵，逆矩阵首先必须是方阵，其次存在另一个矩阵与之相乘，能够得到一个单位矩阵。

**逆矩阵的重要应用**：逆矩阵在图形学中有着非常重要的作用，在图形学中，将一个变换矩阵左乘一个列向量（此处列向量代表顶点坐标），代表了对原始顶点执行了某种变换，比如旋转、缩放、平移等。逆矩阵的意义就是能够撤销这种变换，将变换后的坐标再还原回去。

$$
P_1 = M \times P \\
P = M^{-1} \times P_1 \\
$$
推导过程：
$$
\begin{aligned}
P &= P \times I \\
& = P \times M \times M^{-1} \\
& = P_1 \times M^{-1}
\end{aligned}
$$

**正交矩阵**：假设有一个方阵$M$，当且仅当 $M$ 与其转置矩阵$M^T$的乘积等于`单位矩阵`$I$时，称其为正交矩阵。即： $M \times M^T = I$

所以很容易地得出，$M^T = M^{-1}$

正交矩阵的一个好处是，如果一个矩阵是正交矩阵，那么计算它的逆矩阵时，只需要对原矩阵转置即可，从而减少了计算量（`逆矩阵的求解过程是很繁琐的`），3D图形学中的最常见的旋转和镜像变换就都是正交的。

判断一个矩阵 $M$ 是否正交的重要条件是：$M$ 的行向量是一个相互正交的单位向量组，什么意思呢？ 假设有一个矩阵 $M$：
$$
M = \begin{pmatrix} \beta_i \\ \beta_j \\ ... \\ \end{pmatrix}
$$

其中 $\beta_i$ 为矩阵每一行的行向量，那么矩阵 $M$ 是正交矩阵的充分必要条件是：
$$
\beta_i \times \beta_j = \begin{cases}
 1 & (i = j) \\ 0 & (i \neq j)
\end{cases}
$$
其实就是两个条件：

- 矩阵的每一行都是单位向量
- 矩阵的某一行和其他行向量相互垂直，点积为 0。

这两个条件可以利用 $MM^T=I$ 公式来证明。利用这个充要条件可以快速判断一个矩阵是否是正交矩阵。同时也可以得到，如果 $M$ 是正交矩阵，则 $M^T$ 也是正交矩阵。

**正交矩阵示例**：如下是图形学中的一个旋转矩阵 $R_x$，它表示一个绕X轴旋转 $\theta$ 角度的变换：
$$
R_x(\theta) = \begin{pmatrix} 1 & 0 & 0&0 \\ 0 & cos(\theta) & -sin(\theta) & 0 \\ 0 & sin(\theta) & cos(\theta) & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}
$$

## d16 - 通用数学库的JavaScript实现

### 行主序和列主序

假设有一个 3 阶方阵 $M$：
$$
\begin{aligned}
M = \begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix}
\end{aligned}
$$
那么它在内存中的排布方式如下：

![行主序和列主序](/src/assets/d16_01.awebp)

**请务必谨记**，D3D 中矩阵采用的是`行主序`的存储方式，GLSL 中采用的是`列主序`。

### 实现JavaScript数学库

**JavaScript中表示矩阵的数据结构**：我们用`数组`来表示矩阵，但由于 JavaScript 数组是弱类型的，并没有严格按照内存位置进行排布，而 GLSL 中的矩阵元素是严格按照内存地址顺序排列的，所以我们需要将弱类型数组转化成二进制形式，通常我们使用 `Float32Array` 把弱类型数组转化成强类型数组。

```glsl
let M = [1, 2, 3, 4, 5, 6, 7, 8, 9];
M = new Float32Array(M);
```

WebGL数学库具体实现：[webgl-math-lib](https://github.com/Cleam/webgl-math-lib)

## d17 - WebGL坐标系

WebGL 坐标系分为如下几类：

模型坐标系 -- 世界坐标系 -- 观察坐标系（又称相机坐标系、视图坐标系） -- 裁剪坐标系（gl_Position接收的值） -- NDC 坐标系 -- 屏幕坐标系。

> 其中，裁剪坐标系之前的这几个坐标系，我们都可以使用 JavaScript 控制。从裁剪坐标系到 NDC 坐标系，这一个步骤是 顶点着色器的最后自动完成的，我们无法干预。

![d17_01](src/assets/d17_01.awebp)

### 模型坐标系和世界坐标系

默认情况下，模型坐标和世界坐标系重合，模型坐标系、世界坐标系遵循`右手坐标系`。

### 观察坐标系

观察坐标也叫相机坐标，他是以人眼/摄像机为原点而建立的坐标系。

### 裁剪坐标系

裁剪坐标是将相机坐标进行投影变换后得到的坐标，也就是 gl_Position 接收的坐标，顾名思义，以裁剪坐标系为参照。

裁剪坐标系遵循`左手坐标系`。

### 正射投影矩阵和透视投影矩阵

`正射投影`又名`正交投影`，正射投影矩阵创建的是一个立方体的观察箱，它定义了一个裁剪空间，在该裁剪空间之外的坐标都会被丢弃。 正射投影矩阵需要指定观察箱的长度、宽度和高度。

![d17_02](src/assets/d17_02.awebp)

经过正射投影矩阵映射后的`坐标 w 分量不会改变，始终是 1`，所以在经过透视除法后物体的轮廓比例不会发生改变，这种投影一般用在建筑施工图纸中，不符合人眼观察世界所产生的近大远小的规律。

实际生活中给人带来的感觉是，离我们越远的东西看起来更小。这个奇怪的效果称之为透视`Perspective`。

透视投影矩阵将给定的平截头体范围映射到裁剪空间，除此之外它还会修改每个顶点坐标的 w 值，使得`离人眼越远的物体的坐标 w 值越大`。被变换到裁剪空间的坐标都会在 -w 到 w 的范围之间（任何大于这个范围的坐标都会被裁剪掉）。WebGL 要求所有可见的坐标都落在`【-1.0 - 1.0】`范围内，因此，一旦坐标转换到裁剪空间，透视除法就会被应用到裁剪坐标上。

![d17_03](src/assets/d17_03.awebp)

透视投影需要设置`近平面、远平面、透视深度`。

### NDC坐标系

一旦所有顶点被变换到裁剪空间，GPU 会对裁剪坐标执行透视除法，在这个过程中 GPU 会将顶点坐标的 X，Y，Z 分量分别除以齐次 W 分量。这一步会在每一个顶点着色器运行的最后被自动执行。最终所有坐标分量的范围都会在【-1，1】之间，超出这个范围的坐标都将被 GPU 丢弃。

NDC 坐标系遵循`左手坐标系`，Z 轴朝向屏幕里面，Z轴值越小，越靠近我们的眼睛，我们可以通过开启 WebGL 的深度检测机制验证。

### 屏幕坐标系

有了 NDC 坐标之后，GPU 会执行最后一步变换操作，视口变换，这个过程会将所有在【-1, 1】之间的坐标映射到屏幕空间中，并被变换成片段。

## d18 - 坐标系变换：基本变换原理与算法实现

矩阵变换时**注意事项**：

- 所使用的向量是`行向量`还是`列向量`。
  - 如果是`行向量`，按照`数学领域`中矩阵相乘的规则，向量要放在`左侧`相乘。
  - 如果是`列向量`，向量要放在`右侧`相乘。

- 矩阵是`行主序`还是`列主序`。
  - 如果是行主序，内存存储矩阵的数组的前四个元素表示的是对应数学矩阵的`第一行`
  - 如果是列主序，内存存储矩阵的数组的前四个元素表示的是对应数学矩阵的`第一列`

- 多个矩阵变换时的相乘顺序。
  - 在多个矩阵变换时，不同的相乘顺序会导致不同的结果，所以我们要保证矩阵相乘的顺序是我们期望的。假设有三个变换矩阵：旋转矩阵 R，平移矩阵 T，缩放矩阵 S，以及顶点向量 P，那么 P 变换到 P1 的顺序一般是这样的：$P1 = T \times R \times S \times P$，即先`缩放`，再`旋转`，最后`平移`。

### 矩阵变换

常见的矩阵变换有如下几种：`平移、缩放、旋转、切变`
![d18_01](src/assets/d18_01.awebp)

### 点和向量

`齐次坐标`用来区分`点`和`向量`，齐次坐标使用 `N+1` 维向量表示 N 维空间，第 N+1 维数字如果是 0 的话，则代表 N 维空间中的`向量`，如：$\vec{P} = (3, 2, 1, 0)$ 第 N+1 维数字如果是非0数字的话，则代表 N 维空间下的`点`，如：$\vec{P} = (3, 2, 1, 1)$

使用 N+1 维数字表示 N 维空间中的点或向量的方式就是`齐次坐标`。齐次坐标除了能够区分点和向量，还有两大用处：

1. 模拟透视投影效果：在裁剪坐标系中，w 值越大，经过透视除法后的坐标越小，于是也就有了近大远小的投影效果。
2. 用矩阵来表示平移变换。

$$
\begin{pmatrix}
a & b & c \\
d & e & f  \\
g & h & i
\end{pmatrix} \times \begin{pmatrix}x \\
y \\
z
\end{pmatrix} = \begin{pmatrix}
ax + by + cz \\
dx + ey + fz  \\
gx + hy + iz
\end{pmatrix}
$$
使用`齐次坐标`解决平移问题：
$$
\begin{pmatrix}
a & b & c & tx \\
d & e & f & ty \\
g & h & i & tz \\
0 & 0 & 0 & 1
\end{pmatrix} \times \begin{pmatrix}x \\
y \\
z \\ 1
\end{pmatrix} = \begin{pmatrix}
ax + by + cz +tx \\
dx + ey + fz + ty \\
gx + hy + iz + tz \\
0 + 0 + 0 + 1
\end{pmatrix}
$$

## d19 - 坐标系变换：模型空间变换到世界空间

> todo...

## d20 - 坐标系变换：世界空间变换到观察空间

> todo...

## d21 - 坐标系变换：观察空间变换到裁剪空间

> todo...

## d22 - 更高级的旋转：欧拉角、四元数

> todo...

## d23 - 四元数的应用：使用鼠标控制模型的旋转

> todo...

## d24 - CSS与3D之transform

> todo...

## d25 - CSS与3D之perspective

> todo...

## d26 - 数学库在CSS的3D动画中扮演的重要角色

> todo...

## d27 - 层级建模：行走的机器人

> todo...

## d28 - 使用立方体纹理绘制天空盒

> todo...

## d29 - 混合效果

> todo...

## d30 - 帧缓冲

> todo...

## d31 - 3D模型的拾取原理与实现

> todo...

## d32 - 魔法Shader：火焰效果的原理与实现

> todo...

## d33 - 总结

> todo...
