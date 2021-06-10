# 一、简答题

#### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

webpack会根据我们的配置文件找到一个入口，通常这个入口文件会是一个js文件，然后顺着入口文件的代码，根据代码中出现的import或者require或者define之类的语句，解析推断出来当前资源所依赖的模块，然后分别取解析每一个资源模块对应的依赖，最后就会形成一个整个项目中所有用到的文件之间依赖关系的依赖树，有了这个依赖树之后，webpack会递归遍历这个依赖树，找到每个节点所对应的文件，最后在根据配置文件中的rules属性找到当前模块所对应加载需要的loader加载器，最后将加载后的结果放在boundle.js中，从而实现整个项目的打包。

* 初始化参数配置：根据用户在命令窗口输入的参数以及 webpack.config.js 文件的配置，得到最终的配置。
* 开始编译：根据上一步得到的最终配置，初始化得到一个 compiler 对象，注册所有的插件 plugins，插件开始监听 webpack 构建过程的生命周期的环节（事件），不同的环节会有相应的处理，然后开始执行编译。
* 确定入口：根据 webpack.config.js 文件中的 entry 入口，开始解析文件构建 AST 语法树，找出依赖，递归下去。
* 编译模块：递归过程中，根据文件类型和 loader 配置，调用相应的 loader 对不同的文件做不同的转换处理，再找出该模块依赖的模块，然后递归本步骤，直到项目中依赖的所有模块都经过了本步骤的编译处理。
* 编译过程中，有一系列的插件在不同的环节做相应的事情，比如 UglifyPlugin 会在 loader 转换递归完对结果使用 UglifyJs 压缩覆盖之前的结果；再比如 clean-webpack-plugin ，会在结果输出之前清除 dist 目录等等。
* 完成编译并输出：递归结束后，得到每个文件结果，包含转换后的模块以及他们之间的依赖关系，根据 entry 以及 output 等配置生成代码块 chunk。
* 打包完成：根据 output 输出所有的 chunk 到相应的文件目录。

　

　

　

#### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

##### 概念区别

* Loader: webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。loader 让 webpack 能够去处理其他类型的文件，比如图片，比如css，比如HTML等乐心的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。
* Plugin：插件是 webpack 生态的关键部分， 它为社区用户提供了一种强有力的方式来直接触及 webpack 的编译过程(compilation process)。 插件能够 hook 到每一个编译(compilation)中发出的关键事件中。 在编译的每个阶段中，插件都拥有对 compiler 对象的完全访问能力， 并且在合适的时机，还可以访问当前的 compilation 对象。

##### 用途区别

* Loader: loader 用于在编译过程（compilation process）中遇到非js和Json文件类型事，将这些文件转通通换成js模块。
* Plugin：插件可以用于编译前中后执行范围更广的任务，大大扩展 webpack 能力。包括打包优化，资源管理，注入环境变量。

##### 地位区别

* Loader:loader机制是webpack的核心
* Plugin: 插件是 webpack 的 支柱 功能, 插件目的在于解决 loader 无法实现的其他事

##### 配置方式区别

* Loader: loader有两个属性：
1. test 属性，识别出哪些文件会被转换，一般通过正则和通配符的形式进行匹配。
2. use 属性，定义出在进行转换时，应该使用哪个 loader。执行顺序从又到左
3. webpack.config.js

```js
const path = require('path');

module.exports = {
    output: {
        filename: 'my-first-webpack.bundle.js',
    },
    module: {
        rules: [{
            test: /\.txt$/,
            use: 'raw-loader' // 以文本的形式解析导入的文件
        }],
    },
};
```

4. 不推荐使用内联方式配置loader 

* Plugin：
1. 由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入一个 new 实例。

取决于你的 webpack 用法，对应有多种使用插件的方式。

2. webpack.config.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 访问内置的插件
const path = require('path');

module.exports = {
    entry: './path/to/my/entry/file.js',
    output: {
        filename: 'my-first-webpack.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: 'babel-loader',
        }, ],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
    ],
};
```

##### 原理区别

* Loader:
1. loader是一个将待转换资源作为参数，最后将转换后的资源返回出去的函数，最终得到的结果一定是一个js文件；
2. loader 遵循标准 模块解析 规则。模块解析是一个模块可以作为另一个模块的依赖模块，然后被后者引用。webpack 使用 enhanced-resolve 来解析文件路径。模块解析详解：https://webpack.docschina.org/concepts/module-resolution/
3. 多数情况下，loader 将从 模块路径 加载（通常是从 npm install, node_modules 中进行加载）。
4. loader 支持链式调用。链中的每个 loader 会将转换应用在已处理过的资源上。一组链式的 loader 将按照相反的顺序执行。链中的第一个 loader 将其结果（也就是应用过转换后的资源）传递给下一个 loader，依此类推。最后，链中的最后一个 loader，返回 webpack 所期望的 JavaScript。
* Plugin：
1. webpack 插件是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且在 整个 编译生命周期都可以访问 compiler 对象。
2. ConsoleLogOnBuildWebpackPlugin.js

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
    apply(compiler) {
        compiler.hooks.run.tap(pluginName, (compilation) => {
            console.log('webpack 构建过程开始！');
        });
    }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

compiler hook 的 tap 方法的第一个参数，应该是驼峰式命名的插件名称。建议为此使用一个常量，以便它可以在所有 hook 中重复使用。

##### Loader 开发思路

*  loader 模块导出为一个函数，并且编写为 Node.js 兼容的 JavaScript。通常使用 npm 进行管理 loader，但是也可以将应用程序中的文件作为自定义 loader。按照约定，loader 通常被命名为 xxx-loader（例如 json-loader）  
下面我们来举例开发一个markdownloader    
1. 首先我们新建一个文件夹markdown-loader，然后初始化一个package.json

```js
mkdir markdown - loader
cd markdown - loader
npm init - y
```

2. 安装webpack和webpack-cli   
如果把这个包发布到npm上，依赖项配置在dependences中，我们这里直接作为开发依赖安安

```js
yarn add webpack webpack - cli--save--dev
```

```js
{
    "name": "markdown-loader",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "webpack": "^4.40.2",
        "webpack-cli": "^3.3.9"
    }
}
```

3. 配置webpack.config.js

```js
const path = require('path')

module.exports = {
    mode: 'none',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        // path: path.join(__dirname, 'dist'),
        // 或者使用path.resolve
        path: path.resolve('dist'),
        publicPath: 'dist/'
    }

}
```

4. 为了一会我们能有一个html文件加载webpack打包好的boundle文件，我们先写一个html文件

```js
< !DOCTYPE html >
    <
    html lang = "en" >
    <
    head >
    <
    meta charset = "UTF-8" >
    <
    meta name = "viewport"
content = "width=device-width, initial-scale=1.0" >
    <
    meta http - equiv = "X-UA-Compatible"
content = "ie=edge" >
    <
    title > Webpack - 开发一个 Loader < /title> <
    /head> <
    body >
    // 直接将打包后的文件引入即可
    <
    script src = "dist/bundle.js" > < /script> <
    /body> <
    /html>
```

在创建一下打包的入口文件和要使用的md文件   
./src/main.js

```js
import about from './about.md'

console.log(about)
```

./src/about.md

```text
# 关于网络

这网也太差劲了吧

```

5. 接下来开始写markdown-loader   
* markdown-loader.js

```js
// loader 的原理就是将待转换资源作为参数，最后将转换后的资源返回出去的函数，我们首先导出一个函数，使用console的形式检验一下是否执行了
// source 接收输入
// 最后将加工后的source返回值return出去
module.exports = source => {
    console.log(source)
    return 'hello'
}
```

webpack.config.js 添加loader配置

```js
const path = require('path')

module.exports = {
    mode: 'none',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        // path: path.join(__dirname, 'dist'),
        // 或者使用path.resolve
        path: path.resolve('dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [{
            test: /.md$/,
            use: [
                'html-loader',
                './markdown-loader'
            ]
        }]
    }
}
```

配置完成运行打包命令

```js
yarn webpack
```

执行完你会发现终端打印了，但是包了一个错误，说我们需要额外的加载器来处理当前的加载结果，这是因为我们返回的是字符串，并不是标准的js语法，所以我们有两种处理方式，要么直接返回js语句，要么再找一个合适的loader进行解析，这里先改成js语句的形式

```js
module.exports = source => {
    console.log(source)
    return 'console.log("hello")'
}
```

这时候我们发现控制台不报错了，我们去看一下打包后的dist/boundle.js文件，会发现webpack将loader处理的结果（返回值）直接拼接在了函数体中, 
这也就不难理解刚才为什么报错 ，需要loader最后的管道要返回js代码的原因    
dist/boundle.js    

```js
(function(modules) { // webpackBootstrap
    ...
    // Load entry module and return exports
    return __webpack_require__(__webpack_require__.s = 0);
})
([
    /* 0 */
    (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _about_md__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
        /* harmony import */
        var _about_md__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_about_md__WEBPACK_IMPORTED_MODULE_0__);

        console.log(_about_md__WEBPACK_IMPORTED_MODULE_0___default.a)

    }),
    /* 1 */
    (function(module, exports) {

        console.log("hello ~")

    })
]);
```

6. 接着处理我们的markdowm文件    
这时候我们需要安装一个marked包解析markdown类型的文件
先安装   

```js
yarn add marked
```

然后 markdown-loader.js

```js
// 将markdown文件转换为html文件
const marked = require('marked')

module.exports = source => {
    // console.log(source)
    // return 'console.log("hello ~")'
    const html = marked(source)
    // return html // 这样处理还是会出现刚才报的错误，因为我们最终返回的不是js代码
    // return `module.exports = "${html}"` // 这样处理不能保证md文档里的换行符是正确的，因为换行符不会被转译
    // 我们使用json.stringfy先对md文件转换成json格式的文件，此时html内部的引号和换行符都会被转译过来
    return `module.exports ${JSON.stringify(html)}`
    // webpack 还支持我们使用esm的形式导出模块
    // return `export default ${JSON.stringify(html)}`  

    // 第二种方式 返回 html 字符串交给下一个 loader 处理
    // return html
}
```

打包控制台结果

```text
    Asset     Size  Chunks             Chunk Names
bundle.js  4.1 KiB       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./src/main.js 51 bytes {0} [built]
[1] ./src/about.md 93 bytes {0} [built]
```

dist/boundle.js  

```js
 (function(modules) { // webpackBootstrap
     ...
     // Load entry module and return exports
     return __webpack_require__(__webpack_require__.s = 0);
 })
 ([
     /* 0 */
     (function(module, __webpack_exports__, __webpack_require__) {

         "use strict";
         __webpack_require__.r(__webpack_exports__);
         /* harmony import */
         var _about_md__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

         console.log(_about_md__WEBPACK_IMPORTED_MODULE_0__["default"])

     }),
     /* 1 */
     (function(module, __webpack_exports__, __webpack_require__) {

         "use strict";
         __webpack_require__.r(__webpack_exports__);
         __webpack_exports__["default"] = ("<h1 id=\"关于网络\">关于网络</h1>\n<p>这网也太差劲了吧</p>\n");

     })
 ]);
```

如果直接返回html，导出的内容是这样的, 就换行和引号就会出问题

```text
module.exports = "<h1 id="关于网络">关于网络</h1>
| <p>这网也太差劲了吧</p>
| "
```

7. 使用直接导出html的形式处理，我们需要安装一个处理html文件的loader，html-loader  
首先安装html-loader

```js
yarn add html-loader
```
markdown-loader.js
```js
// 将markdown文件转换为html文件
const marked = require('marked')

module.exports = source => {
    // console.log(source)
    // return 'console.log("hello ~")'
    const html = marked(source)
    // return html // 这样处理还是会出现刚才报的错误，因为我们最终返回的不是js代码
    // return `module.exports = "${html}"` // 这样处理不能保证md文档里的换行符是正确的，因为换行符不会被转译
    // 我们使用json.stringfy先对md文件转换成json格式的文件，此时html内部的引号和换行符都会被转译过来
    // return `module.exports ${JSON.stringify(html)}`
    // webpack 还支持我们使用esm的形式导出模块
    // return `export default ${JSON.stringify(html)}`  

    // 第二种方式 返回 html 字符串交给下一个 loader 处理
    return html
```
webpack.config.js
```js
const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    // path: path.join(__dirname, 'dist'),
    // 或者使用path.resolve
    path: path.resolve('dist'),
    publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /.md$/,
        use: [
          'html-loader', // 打开此注释
          './markdown-loader'
        ]
      }
    ]
  }
}

```
8. 总结   
通过以上代码尝试，loader其实就是负责资源文件从输入到输出的转换，loader是一种管道的概念，对于同一个资源可以依次使用多个loader，比如我们常用的css-loader->style-loader

##### Plugin 开发思路

webpack在编译前（compiler），编译中（compiler，compilation，ContextModuleFactory，JavascriptParser，NormalModuleFactory），和编译后（compiler，boundle）每个对象上都埋下了很多钩子，每个钩子上包括

# 二、编程题

#### 1、使用 Webpack 实现 Vue 项目打包任务

具体任务及说明：

1. 在 code/vue-app-base 中安装、创建、编辑相关文件，进而完成作业。
2. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
3. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
4. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
5. 尽可能的使用上所有你了解到的功能和特性

**提示：(开始前必看)**

在视频录制后，webpack 版本以迅雷不及掩耳的速度升级到 5，相应 webpack-cli、webpack-dev-server 都有改变。

项目中使用服务器的配置应该是改为下面这样：

```json
// package.json 中部分代码
"scripts": {
	"serve": "webpack serve --config webpack.config.js"
}
```

vue 文件中 使用 style-loader 即可

其它问题, 可先到 https://www.npmjs.com/ 上搜索查看相应包的最新版本的配置示例, 可以解决大部分问题.

#### 作业要求

本次作业中的编程题要求大家完成相应代码后

* 提交一个项目说明文档，要求思路流程清晰。
* 或者简单录制一个小视频介绍一下实现思路，并演示一下相关功能。
* 最终将录制的视频或说明文档和代码统一提交至作业仓库。
