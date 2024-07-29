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

const { src, dest, parallel, series, watch } = require('gulp');
// watch 方法在监听到文件变化的时候，第二个回调为待执行的任务

// 清理dist目录用
const del = require('del')
//  省时的浏览器同步测试工具，可以同时在PC、平板、手机等设备下进项调试
const browserSync = require('browser-sync')
// 一款批量引入package.json文件中的依赖项工具
const loadPlugins = require('gulp-load-plugins')
// 得到plugins对象
const plugins = loadPlugins()
// 创建一个web 开发服务器
const bs = browserSync.create()
// html模板要渲染的数据
const data = {
    menus: [
        {
            name: 'Home',
            icon: 'aperture',
            link: 'index.html'
        },
        {
            name: 'Features',
            link: 'features.html'
        },
        {
            name: 'About',
            link: 'about.html'
        },
        {
            name: 'Contact',
            link: '#',
            children: [
                {
                    name: 'Twitter',
                    link: 'https://twitter.com/w_zce'
                },
                {
                    name: 'About',
                    link: 'https://weibo.com/zceme'
                },
                {
                    name: 'divider'
                },
                {
                    name: 'About',
                    link: 'https://github.com/zce'
                }
            ]
        }
    ],
    pkg: require('./package.json'),
    date: new Date()
}
// 清空dist temp目录任务
const clean = () => {
    return del(['dist', 'temp'])
}
// style样式处理任务
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true })) // 编译 SASS & 自动注入到浏览器
}
// js脚本文件处理任务
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}
// html模板处理任务
// swig js模板引擎
// 将src下的index.html 和index.html模板文件生成真实的html，放在temp文件夹中
// 问题：创建原始模板算那种语法规则，有点看不懂？？
const page = () => {
    return src('src/*.html', { base: 'src' })
        .pipe(plugins.swig({ data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true })) // 输出到dist目录后再次刷新浏览器 通过流的形式
}
// 图片处理任务
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}
// 字体处理任务
const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}
// public图片处理任务
const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

const serve = () => {
    // 使用gulp的watch方法监听文件变化,然后执行相对应的任务，任务执行会出发dist目录文件变更，从而实现浏览器的热更新
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/*.html', page)
    // watch('src/assets/images/**', image)
    // watch('src/assets/fonts/**', font)
    // watch('public/**', extra)

    // 因为图片和字体我们只是一个无损压缩，所以在开发阶段监视这些文件的变化意义不大，而且会使打包构建开销变大，所以只需要上线之前对图片和字体压缩体积即可
    // 将图片字体放在一个watch监听，一是可以减少构建次数，二是三者执行的构建后回调都是一样的，只需要重新刷新浏览器即可
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'
    ], bs.reload)

    // 初始化server配置
    bs.init({
        notify: false, // 页面重新刷新时候的提示
        port: 2080,
        // open: false,
        // files: 'dist/**', // 通过通配符的形式 指定哪些文件变化后浏览器要自动刷新
        server: {
            //   baseDir: 'dist/**', // 指定网站根目录 dist
            baseDir: ['temp', 'src', 'public'], // 是数组的时候，当dist目录下的引入文件找不到路径是优先从dist目录找，然后src，其次public
            routes: {
                '/node_modules': 'node_modules' // 优先于baseDir的配置，这样就可以将dist中文件路径为/node_modules指定到文件node_modules中
            }
        }
    })
}
//  <!-- build:css assets/styles/vendor.css -->
//   <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
//   <!-- endbuild -->
//   <!-- build:css assets/styles/main.css -->
//   <link rel="stylesheet" href="assets/styles/main.css">
//   <!-- endbuild -->
// useref会将以上多个引入的带endbuild标致符中间的引用打包到一个文件中
const useref = () => {
    return src('temp/*.html', { base: 'temp' })
        .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
        // html js css
        .pipe(plugins.if(/\.js$/, plugins.uglify())) // 将打包的js文件压缩
        .pipe(plugins.if(/\.css$/, plugins.cleanCss())) // 将打包的css文件压缩
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({ // 将打包后的html文件压缩，如果不配置参数默认值压缩空白符，换行这些是不会去掉的
          collapseWhitespace: true, // 折叠刀所有的空白符，会处理掉换行符
          minifyCSS: true, // 压缩行内css
          minifyJS: true // 压缩行内js
        })))
        .pipe(dest('dist')) // dist为打包后要上线的文件，temp为开发是临时构建的目录
}
// 编译样式脚本和html文件，图片和字体可以单独处理，这样方便在上线build和开发时候重用逻辑
const compile = parallel(style, script, page)

// 上线之前执行的任务 需要编译样式脚本和html图片字体文件，只需要输出在dist目录，不需要启动web服务
const build = series(
    clean,
    parallel(
        series(compile, useref),
        image,
        font,
        extra
    )
)
// 开发任务 需要编译样式脚本和html文件并启动服务
const develop = series(compile, serve)

// 整理对外导出的任务名称，将任务写在packagejson的scripts中
module.exports = {
    clean,
    build,
    develop
}


// 如何提取可复用的构建化工作量
// 提取出来一个模块，吧自动化的工作流包装进去，因为gulp只是构建化工作流的苹台，不负责构建任务，构建任务需要通过gulpfile文件具体定义。
// 当有了gulpfile文件也有了gulp，我们可以通过一个模块吧二者结合在一起，以后就可以使用此模块提供同类自动化构建工作流
