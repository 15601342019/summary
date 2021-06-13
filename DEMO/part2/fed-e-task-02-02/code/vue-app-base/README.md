# vue-app-base

1. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
2. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
3. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
4. 尽可能的使用上所有你了解到的功能和特性

# 开发思路
1. 首先观察项目中使用的文件类型，有vue类型、vue模板类型，html，css，less，js，图片，模板动态字段配置，查找官网相关配置项进行配置，遇到报错依次解决，最终webpack.common.js
```js
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// 注意html-webpack-plugin和webpack的版本相匹配才能构建成功
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BASE_URL = ''
switch (process.env.NODE_ENV) {
    case 'dev':
        BASE_URL = "http://localhost:8088/"  //开发环境url
        break
    case 'serve':
        BASE_URL = "http://localhost:8089/"   //生产环境url
        break
}
module.exports = {
    devtool: 'none',
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: 'build.js',
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: ["style-loader", "css-loader", { loader: "less-loader" }],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.vue$/i,
                use: ['vue-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'url-loader?limit=10000',
                    'img-loader'
                ]
            },
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            title: '叫个啥名呢',
            url: BASE_URL
        }),
        new VueLoaderPlugin(),
    ]
}

```
2. 然后配置HMR
