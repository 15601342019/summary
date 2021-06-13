const path = require('path');
const MyPlugin = require('delnote-webpack-plugin');
// 注意html-webpack-plugin和webpack的版本相匹配才能构建成功
const HtmlWebpackPlugin = require('html-webpack-plugin');
console.log(MyPlugin)
module.exports = {
    devtool: 'none',
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'build.js',
        path: path.resolve('dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MyPlugin(),
    ]
}