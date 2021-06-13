class MyPlugin {
    apply (compiler) {
      console.log('MyPlugin 启动')
        // 第一个参数为插件的名称，
        // 第二个参数是恩吗挂在到当前钩子的函数，函数接受一个 compilation 对象作为参数
        // compilation 可以理解为打包之后的上下文
        // compilation.asset获取写入文件的资源信息对象
      compiler.hooks.emit.tap('MyPlugin', compilation => {
        // compilation => 可以理解为此次打包的上下文
        for (const name in compilation.assets) {

          // console.log(name) // name 就是打包之后的文件名称，比如bundle.js

          // console.log(compilation.assets[name].source()) // 获取打包之后的资源文件的内容
          if (name.endsWith('.js')) {
            const contents = compilation.assets[name].source()
            const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
            // 将替换完的结果覆盖到原来的对象当中
            compilation.assets[name] = {
              source: () => withoutComments,
              size: () => withoutComments.length
            }
          }
        }
      })
    }
  }

module.exports = MyPlugin