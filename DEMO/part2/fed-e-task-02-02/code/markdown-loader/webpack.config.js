const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    // path: path.join(__dirname, 'dist'),
    // 或者使用path.resolve
    path: path.resolve('dist'),
    publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /.md$/,
        use: [
          // 'html-loader',
          './markdown-loader'
        ]
      }
    ]
  }
}
