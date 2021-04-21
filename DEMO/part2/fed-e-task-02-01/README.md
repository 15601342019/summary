## 简答题

**1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。**

答:从创建项目到开发到上线，各个阶段都设计工程化，项目初期脚手架的使用，中期webpack打包工具的使用，自动化上线流程都属于工程化范畴，总结说工程化就是对任何重复性工作的一种抽象，更加便于开发，提交效率

* 工程化带来的价值：
快速搭建项目结构；
开发时可以使用 ES6+ 新特性，通过工程化的手段将新语法转换成兼容性好的语法，然后发布;
可以使用热更新提升开发体验和效率，可以将代码压缩等这样重复机械的工作交给计算机完成;
团队协作开发时，可以使用一些编码规范检查的工具，使得项目代码风格统一，质量得到保证;
可以使用 Mock.js 这样的插件完成假数据的编写，开发阶段时，让前端可以不依赖后端接口去完成相应工作;

　

**2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？**

答:随着前端工程化的概念越来越深入人心，脚手架的出现就是为了减少重复性工作而引入的命令行工具，摆脱ctrl + c, ctrl + v，此话怎讲?
现在新建一个前端项目，已经不是在html头部引入css，尾部引入js那么简单的事了，css都是采用Sass或则Less编写，在js中引入，然后动态构建注入到html中；
除了学习基本的js，css语法和热门框架，还需要学习构建工具webpack，babel这些怎么配置，怎么起前端服务，怎么热更新；为了在编写过程中让编辑器帮我们查错以及更加规范，我们还需要引入ESlint；甚至，有些项目还需要引入单元测试（Jest）。
对于一个刚入门的人来说，这些工作还挺让人头疼的，毕竟宝宝只想开心的写个代码。
而有了前端脚手架，就能让事情简单化，一键命令，新建一个工程，再执行两个npm命令，跑起一个项目。
在入门时，无需关注配置什么的，只需要开心的写代码；另外，对于很多系统，他们的页面相似度非常高，所以就可以基于一套模板来搭建，虽然是不同的人开发，但用脚手架来搭建，相同的项目结构与代码书写规范，是很利于项目的后期维护的

　

　

## 编程题

**1、概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具**

* 工作原理就是：在启动的时候，会询问一些预设的问题，然后将回答的结果与模板文件生成项目结构

（1）创建目录 TEST-DEMO

（2）创建 package.json
```js
yarn init 
```
（3）在package.json中添加bin字段，指定cli文件的入口文件: “bin”:"cli.js"
```js
{
  "name": "test-demo",
  "version": "1.0.0",
  "bin":"cli.js",
  "main": "index.js",
  "license": "MIT"
}
```
（4）安装所需依赖
```js
 yarn add inquirer   //询问
 yarn add ejs  //添加模板引擎
```
（5）创建cli.js文件
```js
#!/usr/bin/env node
// NODE CLI 应用入口文件必须要有这样的文件名
// console.log('cli,working~~~')  //测试

/**
 * 脚手架的工作流程
 * 1、通过命令行交互询问用户问题
 * 2、根据用户回答的结果生成文件
 */
const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs')
const ejs = require('ejs')

inquirer.prompt([
     {
         type: 'input',
         name: 'name',
         message: 'Project name?'
     }
 ]).then(anwsers => {
   //  console.log(anwsers)  // { name: 'myName' }
   // 根据用户回答的结果生成文件

    //模板目录
    const temDir = path.join(__dirname,'templates')
    //目标目录
    const destDir = process.cwd()
    fs.readdir(temDir,(err,files)=>{
        if (err) throw err
        files.forEach(file => {
            // console.log(file)
            //通过模板引擎渲染文件
            ejs.renderFile(path.join(temDir,file),anwsers,(err,result) => {
                if(err) throw err
                fs.writeFileSync(path.join(destDir,file),result)
            })
        });
    })
 })
```
（6）templates/index.html
```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>name</title>
</head>
<body>
</body>
</html>
```
（7）yarn link关联到全局变量
```js
yarn link
```
（8）执行测试
```js
mkdir test  //创建测试文件夹
cd test    //切换文件夹
TEST-DEMO   //执行脚手架
```


　

**2、尝试使用 Gulp 完成项目的自动化构建**  ( **[先要作的事情](./notes/下载包是出错的解决方式.md)** )

(html,css,等素材已经放到code/pages-boilerplate目录)

　

　

## 说明：

本次作业中的编程题要求大家完成相应代码后

- 提交一个项目说明文档，要求思路流程清晰。
- 或者简单录制一个小视频介绍一下实现思路，并演示一下相关功能。
- 说明文档和代码统一提交至作业仓库。
