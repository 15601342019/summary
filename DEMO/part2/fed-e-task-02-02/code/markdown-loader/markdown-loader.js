// 将markdown文件转换为html文件
const marked = require('marked')

module.exports = source => {
  // console.log(source)
  // return 'console.log("hello ~")'
  const html = marked(source)
  // return html // 这样处理还是会出现刚才报的错误，因为我们最终返回的不是js代码
  return `module.exports = "${html}"` // 这样处理不能保证md文档里的换行符是正确的，因为换行符不会被转译
  // return `export default ${JSON.stringify(html)}`   // 我们使用json.stringfy先对md文件转换成json格式的文件，此时html内部的引号和换行符都会被转译过来


  // 第二种方式 返回 html 字符串交给下一个 loader 处理
  // return html
}
