// gulp 入口文件 此文件运行在node环境当中，所以可以使用commonjs规范

// gulp通过导出函数成员的方式构建任务,见下方foo函数

// 此时就相当于在gulp中定义了一个foo的任务，可以通过gulp运行这个任务，执行命令：yarn gulp foo

// 新版本gulp约定每个任务都是一个异步的任务,gulp.task()注册任务的方式不推荐了，直接使用导出函数成员的方式注册gulp任务即可

// 可以通过series()，parallel()，lastRun()等方法组合任务

// the streaming build system 基于流的构建系统，为什么gulp的构建过程选择文件流的形式，
// 是因为gulp希望实现一个构建管道的概念，这样在后续扩展插件的时候有一个统一的方式，后面接触到插件的使用后会有体会
// gulp 工作模式 读取文件流->转换文件流->写入文件流

// gulp相比于nodejs，为我们提供了非常友好的读写流和写入流的api，比如src和dest的通配符，对于转换流，大多数都是通过插件的形式完成的

// 读取流： src ，写入流：dest，转换流：用插件

const fs = require('fs');

async function asyncAwaitTask(done) {
  const {version} = fs.readFileSync('package.json');
  console.log(version);
  await Promise.resolve('some result');
  done()
}



exports.foo = (done) => {
    console.log('gulp task work')
    done();
}

const timeout = time => {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  }
  
  exports.async = async () => {
    await timeout(1000)
    console.log('async task')
  }
  
  exports.stream = () => {
    const read = fs.createReadStream('yarn.lock')
    console.log(read)
    const write = fs.createWriteStream('a.txt')
    read.pipe(write)
    return read
  }
exports.default = asyncAwaitTask;
