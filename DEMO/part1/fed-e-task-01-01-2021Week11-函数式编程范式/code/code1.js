/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/

/**
 * 题目执行结果：hellolagouI ♥ U
 * 分析执行顺序：
 * 1、js线程将最外层setTimeout丢给异步线程处理，10毫秒以后，继续往下执行，遇到变量a，将变量a放在执行栈，分配内存存起来；
 * 2、js线程运行到第二个setTimeout，继续丢给异步线程处理，10毫秒以后，继续往下执行，遇到变量b，将变量b放在执行栈，分配内存存起来；
 * 3、js线程运行到第三个setTimeout，继续丢给异步线程处理，10毫秒以后，继续往下执行，遇到变量c，将变量c放在执行栈，分配内存存起来；
 * 4、打印结果：hellolagouI ♥ U
 */

/**
 * 1、promise优化改进
 */
Promise.resolve('hello').then(v => `${v}world`).then(v => `${v}I ♥ U`)

/**
 * 2、generator优化改进
 */
function* gen() {
  const a = yield '1/hello';
  console.log(a)
  const b = yield '2/world';
  console.log(b)
  const c = yield '3/I ♥ U';
  console.log(a+b+c)
}
const g = gen()
g.next()
g.next('hello')
g.next('world')
g.next('I ♥ U')
/**
 * 3、anync await优化改进
 */

async function test() {
  const a = await 'hello';
  console.log(a)
  const b = await 'world';
  console.log(b)
  const c = await 'I ♥ U';
  console.log(a+b+c) 
 }
 test()