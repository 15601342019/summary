/**
 * 尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
 * 1、Promise 就是一个类，需要传递一个执行器作为参数，执行器会立即执行
 * 2、状态只能是pending=>fullfilled/rejected 状态一旦更改就不可改变
 * 3、resolve方法负责将pending=>fullfilled
 * 4、reject方法负责将pending=>rejected
 * 5、then方法有两个参数负责：promise实例为成功的状态，就调用成功回调，promise实例为失败的状态，就调用失败回调；
 *      每一个promise实例都可以调用then方法，所以then方法也是一个原型方法
 * 6、加入异步代码
 * 
 */

const PENGDING = 'pending';
const REJECT = 'reject';
const FULFILLED = 'fulfilled';
class MyPromise {
    // constructor()方法，就是构造方法,指向当前MyPromise类；
    // executor参数就是创建实例时候传入的实例化参数
    constructor(executor) {
        // Promise传入的执行器会立即执行，所以我们在下面直接调用执行器方法executor()
        // Promise执行器executor接受两个函数参数，分别是resolve和reject;
        // resolve和reject实际上是MyPromise原型上的方法；
        // 此处的this指向MyPromise的实例
        executor(this.resolve, this.reject)
    }
    // status为实例对象的属性
    status = PENGDING
    // 成功之后的值
    value = undefined;
    // 失败之后的原因
    reason = undefined;
    /**
     * 分析resolve功能：
     *1、resolve方法负责将pending=>fullfilled
     *2、更改状态就需要存储一个状态变量，且每个实例的状态都是独立的,此处需要给实例对象一个状态字段（status）
     * 
     */

    resolve = () => {

    }
    /**
     * 分析resolve功能：
     *1、reject方法负责将pending=>rejected
     *
     * 
     */
    reject = () => {

    }
    /**
     * 分析then功能：
     *1、promise实例为成功的状态，就调用成功回调
     *2、promise实例为失败的状态，就调用失败回调
     *3、成功回调能够拿到上一个promise实例对象的返回值，失败回调能拿到上一个promise实例对象的错误原因，所以这里需要一个value和一个reason字段来保存当前的值在实例属性上
     *
     * 
     */
    then = (sucessCallback,failCallback) => {
        // 判断状态
        if (this.status === FULFILLED){
            sucessCallback(this.value)
        }else if(this.status === REJECT){
            failCallback(this.reason)
        }
    }
}
const p = new MyPromise((resolve,reject) => {
    resolve('成功');
    reject('失败');
})
p.then(
    value=>console.log(value),
    reason=>console.log(reason)
)
console.log(p instanceof MyPromise)