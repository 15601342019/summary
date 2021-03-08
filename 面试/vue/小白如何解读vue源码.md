## 前言
参考掘金文章地址：https://juejin.cn/post/6844903826399428615
vue github地址：https://github.com/vuejs/vue
## 一、源码目录
首先我们先看看Vue.js源码的项目结构，vue的核心代码都在src目录下面，我们先了解一下src这个目录的各模块分工：
```js
src
├── compiler        # 编译相关 
├── core            # 核心代码 
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码
```
### 1. compiler
compiler模块包含Vue.js了所有编译相关的代码。它包括把模板解析成AST语法树，AST语法树优化，代码生成等功能。
### 2. core
core目录包含了Vue.js的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等。
### 3. platform
Vue.js是一个跨平台的MVVM框架，它可以跑在 web上，也可以配合weex跑在native客户端上。platform是Vue.js的入口，会分别打包成运行在  web上和weex上的Vue.js。
### 4. server
这是与服务端渲染相关的部分，这部分代码是跑在服务端的Node.js。
### 5. sfc
通常我们开发Vue.js都会借助webpack构建，然后通过.vue单文件来编写组件，这个模块的功能就是将.vue文件内容解析成一个 JavaScript的对象。
### 6. shared
这里是Vue.js定义的一些共享工具方法，会供以上模块所共享。
大概了解了以上模块功能后，我们就知道了对于web端的源码，我们主要分析的就是core模块。

## 二. 源码的构建入口
想想平常我们使用vue的时候是通过npm来安装使用的，那说明Vue.js其实就是一个 node包，但它是基于Rollup构建的，但我们也可以用webpack的一些打包思路去理解它。
简单理解的话就是Vue.js通过构建工具将其打包，这个包会导出一个Vue构造函数供我们使用。
所以我们从Vue.js源码中的package.json文件入手，因为其包含了打包的一些配置记录，主要了解两个地方：
### 1. 导出口

```js
"module": "dist/vue.runtime.esm.js"
```
这个配置可以理解为出口或者入口，理解为出口时就是指它会导出一个Vue构造函数供我们使用；理解为入口的话就从这个vue.runtime.esm.js开始集成Vue.js做需要的代码。
### 2. 打包入口

```js
"scripts": {"build": "node scripts/build.js"}

```
可以理解为打包入口，会通过build.js找到Vue.js所需要的依赖代码，然后对其进行打包，所有我们可以从这里入手，去scripts/build.js路径下的build.js文件中看看：
```js
// scripts/build.js 
let builds = require('./config').getAllBuilds()
...
build(builds)
```
```js
// scripts/config.js
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.js'),
    format: 'cjs',
    banner
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.js'),
    format: 'cjs',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime only (ES Modules). Used by bundlers that support ES Modules,
  // e.g. Rollup & Webpack 2
  'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner
  },
  // Runtime+compiler CommonJS build (ES Modules)
  'web-full-esm': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner
  },
  // runtime-only build (Browser)
  'web-runtime-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.js'),
    format: 'umd',
    env: 'development',
    banner
  },
  // ...
}

exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
```
以上逻辑其实就是从配置文件config.js中读取配置，再对构建配置做过滤，进而根据不同配置构建出不同用途的Vue.js，其中就有web使用的两个版本：Runtime Only 和 Runtime + Compiler：
### Runtime Only
在使用Runtime Only版本的Vue.js的时候，通常需要借助如webpack的vue-loader工具把.vue文件编译成JavaScript，因为是在编译阶段做的，所以它只包含运行时的Vue.js代码，因此代码体积也会更轻量。
### Runtime + Compiler
如果没有对代码做预编译，但又使用了Vue的template属性并传入一个字符串，则需要在客户端编译模板，所以需要带有编译器的版本，即Runtime + Compiler。
因为后续系列我们会将到编译模块，所有我们就从带编译器的版本入手，即以上入口是entry: resolve('web/entry-runtime-with-compiler.js'),的文件，根据源码的路径解析我们得到最终的文件路径是src/platforms/web/entry-runtime-with-compiler.js。

```js
// src/platforms/web/entry-runtime-with-compiler.js
import Vue from './runtime/index'
// ...
export default Vue

```
可以看到这个文件不是定义Vue构造函数的地方，也是从其他文件引入，然后再加工导出，那我们从./runtime/index这个文件继续找：

```js
// src/platforms/web/runtime/index
import Vue from 'core/index'
// ...
export default Vue
```
依旧如此……，继续往上找，最终经过几次查找，在src/core/instance/index.js中可以看到Vue的真身：
```js
// src/core/instance/index.js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  // 判断是否是开发环境且必须是new调用
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // new一个实例时会调用_init方法，该方法在下面的initMixin(Vue)中有定义
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```
所以到此我们终于看到了Vue的庐山真面目，可以看到Vue是一个构造函数，且经过了一系列的Mixin，进而在Vue的原型上拓展方法。

## zuihou
通过以上梳理，我们大概了解到了我们平时使用的Vue是怎么来的，后续系列会继续对源码进行梳理.
