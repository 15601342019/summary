#!/usr/bin/env node

// Node CLI 应用入口文件必须要有这样的文件头
// 如果是 Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 命令实现修改


// 脚手架的工作过程：
// 1. 通过命令行交互询问用户问题
// 2. 根据用户回答的结果生成文件


// 1.1发起命令行交互询问使用 inquirer 模块，文档地址：https://github.com/SBoudrias/Inquirer.js#readme
// 1.2 inquirer提供 prompt 方法供用户提问
// 1.3 prompt接受一个数组做为参数，每一个对象就是一个问题
// 1.4 type:问题的输入方式，name：存储答案时使用的键，message：询问的问题
// 1.5 prompt方法返回一个promise函数，回调中能够拿到用户所有的答案，{ name: 'heih', password: '123456' }
// 1.6 根据收集的用户答案信息在结合我们的模板文件就能生成对应的初始化项目了
// 1.6.1 首先创建一个html模板
//  __dirname:获取当前文件的绝对路径,被执行js文件所在的文件夹目录,不包含文件名称，/Users/liru/Documents/webstorm/summary/DEMO/part2/fed-e-task-02-01/code/sample-scaffolding
//  __filename:获取当前文件的绝对路径,被执行js文件所在的文件夹目录,包含文件名称，/Users/liru/Documents/webstorm/summary/DEMO/part2/fed-e-task-02-01/code/sample-scaffolding/cli.js
// path.join 单纯的路径拼接 
// path.join('wwwroot', 'static_files/png/', '../gif/image.gif') ===> wwwroot/static_files/gif/image.gif
// path.resolve 会将单纯拼接了路径前再拼接上当前文件的__dirname
// path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif') 
// ===> /Users/liru/Documents/webstorm/summary/DEMO/part2/fed-e-task-02-01/code/sample-scaffolding/wwwroot/static_files/gif/image.gif
// process.cwd() 当前node命令执行时所在的文件夹目录 

const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const inquirer = require('inquirer')

inquirer
    .prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Project name?'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Project password?'
        }
    ])
    .then((anwsers) => {
        // console.log(anwsers)
        // 根据用户回答的结果生成文件

        // 模板目录 /Users/liru/Documents/webstorm/summary/DEMO/part2/fed-e-task-02-01/code/sample-scaffolding/templates
        const tmplDir = path.join(__dirname, 'templates')
        // console.log(__dirname)
        // console.log(process.cwd())
        // 目标目录 绝对路径
        const destDir = process.cwd()
        fs.readdir(tmplDir, (err, files) => {
            // files : [ 'index.html', 'style.css' ] 相对路径
            if (err) throw err;
            // console.log('files===>', files)
            files.forEach(file => {
                // console.log('file:', file) // file: 'index.html', 'style.css'
                // 通过模板引擎渲染文件
                // 第一个参数：要将模板文件写到哪里，即文件的绝对路径
                // 第二个参数：模板引擎工作的数据上下文；
                // 第三个参数：renderFile渲染成功之后的回调函数
                ejs.renderFile(path.join(tmplDir, file), anwsers, (err, result) => {
                    // 如果渲染过程中出现了意外，可以把错误抛出去
                    if (err) throw err
                    console.log('result:', result);
                    // 将结果写入目标文件路径
                    fs.writeFileSync(path.join(destDir, file), result)
                })
            });
        })

    })
