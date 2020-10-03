# 模拟react的实现

一、创建一个根目录，使用npm初始化一个项目
二、模拟react首先要模拟jsx语法，参考官网jsx语法教程https://zh-hans.reactjs.org/tutorial/tutorial.html#what-is-react。jsx语法需要使用babel插件进行解析
三、webpack环境配置

webpack是什么：前端常用的打包工具
1、首先安装webpack 和webpack-cli  此命令行只需要在开发环境中使用，生成环境不需要
2、为什么用webpack：
    他是一个js的打包工具，正常情况下输入和产出都是JavaScript文件，webpack的最大作用就是帮助我们把js文件里的import和require的多文件转换成单文件，
    所以webpack常常是由一个文件入口，这个文件常常会import或者require一些其他文件，那种写法都可以，最终会打包成一个比较大的全的js文件，比较符合web性能和发布方面的需求。
    webpack也承载了很多工具，与之同样重要的前端工具还有babel，babel的作用是把新版本的js转换成老版本的js。babel在webpack中使用是通过loader的方式，webpack允许我们使用loader订制各种各样的文件，比如js，css，html，
3.webpack 打包后的产物：
通过eval去执行代码，后面的sourceURL是当我们在浏览器打开main.js的时候，eval这部分就会被映射成单独的文件，这样webpack就能生成一个易于人类阅读的调试版本
eval("\n\n//# sourceURL=webpack:///./main.js?");
4、webpack添加loader-babel loader
在使用loader之前首先要先安装 babel-loader @babel/core @babel/preset-env
5、webpack如何支持jsx文件？
四、会发现经过webpack打包之后，div标签会被解析成一个函数调用，下面思考一下如何实现jsx 翻译出来的函数
```js
// let a = <div>11</div> webpack打包成了如下代码
var a = jlr.createElement("div", null, "11");
```

