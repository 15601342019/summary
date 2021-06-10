// 打包后的文件就是一个函数自调用，当前函数接受一个对象作为参数，
(function (modules) { // webpackBootstrap
  // The module cache
  var installedModules = {};

  // The require function
  // 下面的这个方法就是 webpack 当中自定义的，它的核心作用就是返回模块的 exports 
  function __webpack_require__(moduleId) {

    // Check if module is in cache 判断是否存在缓存
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache) 如果没有缓存，就新创建一个module
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    // Execute the module function 调用模块定义的每一个值
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded 标记当前模块是否已加载
    module.l = true;

    // Return the exports of the module 将module.exports导出
    return module.exports;
  }


  // expose the modules object (__webpack_modules__) 将传入的参数挂载到__webpack_require__.m上
  __webpack_require__.m = modules;

  // expose the module cache 将已加载的module挂载到 __webpack_require__.c 上
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports 给exports对象的name（传入的值不一定是name）属性设置getter方法
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

  // __webpack_public_path__
  __webpack_require__.p = "";


  // Load entry module and return exports
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
  ({
    // 2.函数的入参为一个对象，key就是相对根目录的路径，值是一个函数，函数体就是我们在./src/index.js写的内容
    // 3.我们暂且给这个入参起个名字，叫模块定义，
    // 4.模块定义的key叫模块id，是当前被加载模块的文件名与某个目录的拼接（）
    // 5. 这个键值就是一个函数，和 node.js 里的模块加载有一些类似，会将被加载模块中的内容包裹于一个函数中
    // 6. 这个函数在将来某个时间点上会被调用，同时会接收到一定的参数，利用这些参数就可以实现模块的加载操作
    // 7. 针对于上述的代码就相当于是将 {}（模块定义） 传递给了 modules形参
    "./src/index.js": (function (module, exports) {

      console.log('index.js 内容')

      module.exports = '入口文件导出内容'

    })

  });