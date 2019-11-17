## call 和 apply 的区别
 对于call和apply的解释，网上有很多，但是为了更好地理解。所以这里自己总结积累下~  

JavaScript中的每一个function对象都会有call和apply方法

```js
/*apply()方法*/
function.apply(thisObj[, argArray])

/*call()方法*/
function.call(thisObj[, arg1[, arg2[, [,...argN]]]]);

```
#### 定义：

apply：调用一个对象的一个方法，用另一个对象替换当前对象。例如：B.apply(A, arguments);即A对象应用B对象的方法。

call：调用一个对象的一个方法，用另一个对象替换当前对象。例如：B.call(A, args1,args2);即A对象调用B对象的方法

从定义中可以看出，call和apply都是调用一个对象的一个方法，用另一个对象替换当前对象。

而不同之处在于传递的参数，apply最多只能有两个参数——新this对象和一个数组argArray，如果arg不是数组则会报错TypeError；

call则可以传递多个参数，第一个参数和apply一样，是用来替换的对象，后边是参数列表。

#### 基本用法：

```js
function Dog(){
        this.name = "dog";
        this.showName=function(){
            console.log("这是一条"+this.name+"!")
        }
    }
    function Cat(){
        this.name="cat";
        // Dog.apply(this)
        this.showName=function(){
            console.log(this.name+" eat fish");
        }
        Dog.apply(this)
    };
    var cat = new Cat()
    // Dog.call(cat)    /*call的用法*/
    cat.showName()        /*这是一条dog*/
    console.log(cat.name)    /*dog*/
```

上述代码发现一个很有意思的事情，就是如果你apply写的位置不同，结果也将有所变化。

如果我将后边的apply注释掉，将上一个apply打开，那么执行showName()得到的结果将是：dog eat fish, 定义在后面的同名方法还是会覆盖之前的方法。