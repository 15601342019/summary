## call、apply、bind 原理
===================================
### call、apply、bind 介绍

#### 方法区别
1. 都是用来修改函数this指向的，第一个参数都是指定this绑定的对象，第二个参数是传参
2. apply 第二参数是数组形式
3. call 和 bind第二个参数都是参数列表形式
4. apply和call都是立即执行函数，bind不会立即执行函数而是返回新的函数

#### call 函数
1. 使用示例
本例中函数 fn 函数定义在全局，无对象调用本fn方法，所以fn函数默认 this 指向全局 window 对象，然后本例中 call 方法修改了函数 fn 的 this 指向，将 this 指向了对象 obj。 2)
```js
let obj = {names: 'zhangsan'}
function fn(a,b,c) {
    //{names: "zhangsan"} 1 2 3
    console.log(this, a,b,c)
}
fn.call(obj,1,2,3)
```

2. 手写源码
```js
Function.prototype.myCall = function(context) {
        context = context ? Object(context) : window;
        // console.log('this', this)
        context.fn = this

        let args = []

        for(let i = 1; i<arguments.length; i++) {
            args.push(arguments[i])
        } 

        // let r = eval('context.fn(' + args.toString() + ')')
        let r = eval(`context.fn(${args.toString()})`)

        delete context.fn

        return r
    }
```
#### apply 函数
1. 使用示例
本例中使用 apply 函数与上述call函数方式基本一致，仅存在传参区别。其中call方法接受多个形参，而apply方法接受一个数组作为形参，这里我们只需修改调用 apply 的传参方式即可。
```js
    let obj = {names: 'zhangsan'}
    function fn(a,b,c) {
        console.log(this, a,b,c)
    }
    fn.apply(obj,[1,2,3])
```
2. 手写源码
```js
 Function.prototype.myApply = function(context) {
        context = context ? Object(context) : window

        context.fn = this

        let args = arguments[1]

        let r = eval(`context.fn(${args.toString()})`)

        delete context.fn

        return r
    }
```

#### bind 函数
1. 使用示例
bind 函数 与 call、apply 函数均只有一个维度的区别，区别如下：
* bind 相对于 call 传参方式相同，不同之处在于 call 在修改了函数 this 指向的过程中同时执行了函数，而bind 修改函数 this 指向后不会立即执行函数，会返回修改后 this 指向的函数，用户后续开发人员调用执行。

* bind 传参方式与 call 一致，不同于 apply 传参方式
```js
 let obj = {names: 'zhangsan'}
    function fn(a,b,c) {
        console.log(this, a,b,c)
    }
    let back = fn.bind(obj,1,2,3)
    back()
```
2. 手写源码
```js
Function.prototype.myBind = function(context) {
        context = context ? Object(context) : window
        
        let that = this

        let args = []

        for(let i = 1; i < arguments.length; i++) {
            args.push(arguments[i])
        }

        let r = eval(`context.fn(${args.toString()})`)

        delete context.fn

        return function() {
            that()
        }
    }

```
### 扩展一下
通过以上代码不难发现，call、apply、bind都是通过改变this指向实现的

#### 那么如何改变this指向呢？
##### this 的指向
在 ES5 中，其实 this 的指向，始终坚持一个原理：this 永远指向最后调用它的那个对象，来，跟着我朗读三遍：this 永远指向最后调用它的那个对象，this 永远指向最后调用它的那个对象，this 永远指向最后调用它的那个对象。记住这句话，this 你已经了解一半了。
# 下面例子郑梦this 的指向并不是在创建的时候就可以确定的，在 es5 中，永远是this 永远指向最后调用它的那个对象。
```js

    var name = "windowsName";

    function fn() {
        var name = 'Cherry';
        innerFunction();
        function innerFunction() {
            console.log(this.name);      // windowsName
        }
    }

    fn()

```
##### 改变this的方式有几种
改变 this 的指向我总结有以下几种方法：
* 使用 ES6 的箭头函数
* 在函数内部使用 _this = this 
* 使用 apply、call、bind
* new 实例化一个对象


```js
var name = "windowsName";

    var a = {
        name : "Cherry",

        func1: function () {
            console.log(this.name)     
        },

        func2: function () {
            console.log(this) // a对象
            setTimeout(  function () {
                console.log(this) // window对象，因为setTimeout最后是在window对象调用的，此时就会修改当前的this（a对象）修改为window对象
                this.func1()
            },100);
        }

    };

    a.func2()     // this.func1 is not a function
```
如果将以上func2中setTimeout第一个函数改成箭头函数，此时的this就是a对象，或者在已进入函数的时候使用变量_this = this 的形式将this存储起来

##### 说一哈函数调用
1. 作为一个函数调用
```js
    var name = "windowsName";
    function a() {
        var name = "Cherry";

        console.log(this.name);          // windowsName

        console.log("inner:" + this);    // inner: Window
    }
    a();
    console.log("outer:" + this)         // outer: Window
```
这样一个最简单的函数，不属于任何一个对象，就是一个函数，这样的情况在 JavaScript 的在浏览器中的非严格模式默认是属于全局对象 window 的，在严格模式，就是 undefined。    
但这是一个全局的函数，很容易产生命名冲突，所以不建议这样使用。
2. 函数作为对象的方法调用
```js
    var name = "windowsName";
    var a = {
        name: "Cherry",
        fn : function () {
            console.log(this.name);      // Cherry
        }
    }
    a.fn();
```
我们一直记住的那句话“this 永远指向最后调用它的那个对象”，所以在 fn 中的 this 就是指向 a 的。

3. 使用构造函数调用函数

```js
// 如果函数调用前使用了 new 关键字, 则是调用了构造函数。
// 这看起来就像创建了新的函数，但实际上 JavaScript 函数是重新创建的对象：
// 构造函数:
function myFunction(arg1, arg2) {
    this.firstName = arg1;
    this.lastName  = arg2;
}

// This    creates a new object
var a = new myFunction("Li","Cherry");
a.lastName;                             // 返回 "Cherry"

```
这就有要说另一个面试经典问题：new 的过程了，(ಥ_ಥ)    
这里就简单的来看一下 new 的过程吧：    
伪代码表示：    
```js
var a = new myFunction("Li","Cherry");

new myFunction{
    var obj = {};
    obj.__proto__ = myFunction.prototype;
    var result = myFunction.call(obj,"Li","Cherry");
    return typeof result === 'obj'? result : obj;
}
```
1. 创建一个空对象 obj;
2. 将新创建的空对象的隐式原型指向其构造函数的显示原型。
3. 使用 call 改变 this 的指向
4. 如果无返回值或者返回一个非对象值，则将 obj 返回作为新对象；如果返回值是一个新对象的话那么直接直接返回该对象。

所以我们可以看到，在 new 的过程中，我们是使用 call 改变了 this 的指向。

```text
在 JavaScript 中, 函数是对象。
JavaScript 函数有它的属性和方法。call() 和 apply() 是预定义的函数方法。 两个方法可用于调用函数，两个方法的第一个参数必须是对象本身
在 JavaScript 严格模式(strict mode)下, 在调用函数时第一个参数会成为 this 的值， 即使该参数不是一个对象。在 JavaScript 非严格模式(non-strict mode)下, 如果第一个参数的值是 null 或 undefined, 它将使用全局对象替代。   
我们通常写的匿名函数都是自执行的，就是在匿名函数后面加 () 让其自执行。其次就是虽然匿名函数不能被其他对象调用，但是可以被其他函数调用啊，比如例 7 中的 setTimeout

```

