
// const myInstanceof = (instance, protoObj) => {
//     if (typeof instance !== 'object' || typeof instance === 'null') {
//         return false
//     }
//     let proto = Object.getPrototypeOf(instance)
//     while (true) {
//         if (proto === protoObj.prototype) {
//             return true
//         }
//         if (proto === null) {
//             return false
//         }
//         proto = Object.getPrototypeOf(proto)
//     }
// }

const myInstanceof = (instance, protoObj) => {
    if (typeof instance !== 'object' || typeof instance === 'null') {
        return false
    }
    // let proto = Object.getPrototypeOf(instance)
    let proto = instance.__proto__
    while (true) {
        if (proto === protoObj.prototype) {
            return true
        }
        if (proto === null) {
            return false
        }
        proto = proto.__proto__
    }
}
// 验证一下自己实现的myInstanceof是否OK
console.log(myInstanceof(new Number(123), Number));    // true
console.log(myInstanceof(123, Number));