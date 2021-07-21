// for...in 遍历可以枚举属性和继承属性，不可遍历不可枚举属性和Symbol类型值
// Object.assign 拷贝可枚举属性和Symbol类型值，不可以拷贝不可枚举属性和继承属性

const shallowClone = (target) => {
    if (typeof target !== 'object' || target === null) {
        return target
    }
    const resTarget = Object.prototype.toString.call(target) === '[object Array]' ? [] : {}
    for (let key in target) {
        // 此处的key能拿到继承属性，但是浅拷贝是不需要拷贝继承属性的，所以需要通过object.hasOwnPrototype判断
        if (target.hasOwnProperty(key)) {
            resTarget[key] = target[key]
        }
    }
    return resTarget
}

const arr = ['[object Array]', '[object Object]']
const feekDeepClone = (target) => {
    if (typeof target !== 'object' || target === null) {
        return target
    }
    const resTarget = Object.prototype.toString.call(target) === '[object Array]' ? [] : {}
    for (let key in target) {
        // 此处的key能拿到继承属性，但是浅拷贝是不需要拷贝继承属性的，所以需要通过object.hasOwnPrototype判断
        if (target.hasOwnProperty(key)) {
            resTarget[key] = arr.includes(Object.prototype.toString.call(target[key])) ? deepClone(target[key]) : target[key]
        }
    }
    return resTarget
}

// 1、上面的feekDeepClone不能复制不可枚举属性和Symbol类型值，我们可以使用 Reflect.ownKeys 方法
// 2、同时也没有复制原型
// 3、对象的属性里面成环，即循环引用没有解决
// 4、这种方法只是针对普通的引用类型的值做递归复制，而对于 Array、Date、RegExp、Error、Function 这样的引用类型并不能正确地拷贝
// 4的解决办法：
// 4.1 当参数为 Date、RegExp 类型，则直接生成一个新的实例返回
// 4.2 当参数为 Date、RegExp 类型，则直接生成一个新的实例返回

const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)
const deepClone = function (obj, hash = new WeakMap()) {
    if (obj.constructor === Date)
        return new Date(obj)       // 日期对象直接返回一个新的日期对象
    if (obj.constructor === RegExp)
        return new RegExp(obj)     //正则对象直接返回一个新的正则对象
    //如果循环引用了就用 weakMap 来解决
    if (hash.has(obj)) return hash.get(obj)
    let allDesc = Object.getOwnPropertyDescriptors(obj)
    //遍历传入参数所有键的特性
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
    //继承原型链
    hash.set(obj, cloneObj)
    for (let key of Reflect.ownKeys(obj)) {
        console.log('key:', key, ';  isComplexDataType(obj[key])', isComplexDataType(obj[key]), ',typeof obj[key] !== "function" ========>:', typeof obj[key] !== 'function')
        cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
    }
    return cloneObj
}
// 下面是验证代码
let obj = {
    num: 0,
    str: '',
    boolean: true,
    unf: undefined,
    nul: null,
    obj: { name: '我是一个对象', id: 1 },
    arr: [0, 1, 2],
    func: function () { console.log('我是一个函数') },
    date: new Date(0),
    reg: new RegExp('/我是一个正则/ig'),
    [Symbol('1')]: 1,
};
Object.defineProperty(obj, 'innumerable', {
    enumerable: false, value: '不可枚举属性'
}
);
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj    // 设置loop成循环引用的属性
let cloneObj = deepClone(obj)
cloneObj.arr.push(4)
console.log('obj', obj)
console.log('cloneObj', cloneObj)


