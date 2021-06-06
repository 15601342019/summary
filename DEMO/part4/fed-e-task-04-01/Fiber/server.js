import express from "express"

const app = express()
// 这样下面就能访问到dist目录下的bundle.js文件了
app.use(express.static("dist"))

const template = `
  <html>
    <head>
      <title>React Fiber</title>
    </head>
    <body>
      <div id="root">123</div>
      <script src="bundle.js"></script>
    </body>
  </html>
`
// 接受来自客户端的所有get请求
app.get("*", (req, res) => {
    // res.send方法对客户端请求进行相应
    // 相应内容为index.html里的代码
  res.send(template)
})

app.listen(3000, () => console.log("server is running"))
