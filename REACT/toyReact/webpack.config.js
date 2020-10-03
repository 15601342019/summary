module.exports = {
    entry: {
        main: "./main.js"
    },
    module: {
        rules: [
            {
                // 所有以.js结尾的文件都使用babel-loader
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    //babel-loader还可以有自己的配置，是配置是options.presets中，presets可以理解为babel-loader 的config的一种快捷配置方式 
                    // 如果想在js文件中使用jsx语法，需要在presets里配置解析jsx能力的配置，所以需要安装专门处理jsx的plugin，@babel/plugin-transform-react-jsx,
                    // @babel/plugin-transform-react-jsx 是babel-loader的一个plugin，所以要配置在babel-loader的options.presets里面
                    options: {
                        presets: ["@babel/preset-env"],
                        //"@babel/plugin-transform-react-jsx"写成["@babel/plugin-transform-react-jsx", { pragma: "jlr.createElement" }]的形式，
                        // 第二个对象就是 插件@babel/plugin-transform-react-jsx的参数配置，
                        // 问题，这些参数怎么在文档中查找到如何使用的？？？？
                        plugins: [["@babel/plugin-transform-react-jsx", { pragma: "createElement" }]],
                    }
                }
            },
            {

            }
        ]
    },
    mode: "development",
    optimization: {
        minimize: false,
    },
}