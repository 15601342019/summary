const path = require('path');
// const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// 注意html-webpack-plugin和webpack的版本相匹配才能构建成功
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BASE_URL = ''
switch (process.env.NODE_ENV) {
    case 'dev':
        BASE_URL = "http://localhost:8080/"  //开发环境url
        break
    case 'serve':
        BASE_URL = "http://localhost:8081/"   //生产环境url
        break
}
module.exports = {
    devtool: 'none',
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'build.js',
        path: path.resolve('dist'),
    },
    devServer: {
        contentBase: ['./public','./src','./assets'],
        // compress: true,
        // hot: true,
        // open: true,  // 自动打开浏览器并访问服务器地址 为什么这里配置不生效，端口号也不行
        // publicPath:'src'
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
        // new webpack.HotModuleReplacementPlugin(),
    ]
}