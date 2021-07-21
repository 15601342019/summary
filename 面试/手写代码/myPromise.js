// 写法1
function promiseAll1(arr) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(arr)) {
            return reject('不是数据组')
        }
        let counter = 0
        let resArr = [];
        for (var i = 0; i < arr.length; i++) {
            (function (idx) {
                Promise.resolve(arr[idx]).then((value) => {
                    counter++;
                    resArr.push(value);
                    if (counter === arr.length) {
                        return resolve(resArr)
                    }
                }, (reason) => {
                    return reject(reason)
                })
            })(i)
        }
    })

}
// 写法2
function PromiseAll(promiseArray) {
    return new Promise(function (resolve, reject) {
        //判断参数类型
        if (!Array.isArray(promiseArray)) {
            return reject(new TypeError('arguments muse be an array'))
        }
        var counter = 0,
            promiseNum = promiseArray.length,
            resolvedArray = new Array(promiseNum);
        for (var i = 0; i < promiseNum; i++) {
            (function (i) {
                Promise.resolve(promiseArray[i]).then(function (value) {
                    counter++;
                    resolvedArray[i] = value;
                    if (counter == promiseNum) {
                        return resolve(resolvedArray)
                    }
                }, function (reason) {
                    return reject(reason)
                })
            })(i)
        }
    })
}

// 自己默写 写法3
function all(arr) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(arr)) {
            return reject('不是数组')
        }
        let count = 0;
        const resArr = [];
        for (let i = 0; i < arr.length; i++) {
            Promise.resolve(arr[i]).then((value) => {
                count++;
                resArr.push(value);
                if (count === arr.length) {
                    return resolve(resArr)
                }
            }, (reason) => {
                return reject(reason)
            })
        }
    })
}
// 测试
const pro1 = new Promise((res, rej) => {
    setTimeout(() => {
        res('1')
    }, 1000)
})
const pro2 = new Promise((res, rej) => {
    setTimeout(() => {
        res('2')
    }, 2000)
})
const pro3 = new Promise((res, rej) => {
    setTimeout(() => {
        res('3')
    }, 3000)
})

//   const proAll = all([pro1,pro2,pro3])
//   .then(res => 
//    console.log('all res:',res) // 3秒之后打印 ["1", "2", "3"]
//   )
//   .catch((e) => {
//    console.log(e)
//   })
const promisAll = promiseAll1([pro1, pro2, pro3])
    .then(res =>
        console.log('promiseAll res:', res) // 3秒之后打印 ["1", "2", "3"]
    )
    .catch((e) => {
        console.log(e)
    })
console.log('Promise.allSettled([pro1,pro2,pro3]):', Promise.allSettled([pro1, pro2, pro3]))
// 有一个状态改变了，整个promiserace状态就改变了
function promiseRace(arr) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(arr)) {
            return reject('不是数组')
        }
        for (let i = 0; i < arr.length; i++) {
            Promise.resolve(arr[i]).then((value) => {
                return resolve(value)
            }, (reason) => {
                return reject(reason)
            })
        }
    })
}
// 有个是fullied，整个返回fullied，如果都是reject，就返回rejected
function promiseAny(arr) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(arr)) {
            return reject('不是数组')
        }
        for (let i = 0; i < arr.length; i++) {
            Promise.resolve(arr[i]).then((value) => {
                return resolve(value)
            }, (reason) => {
                return reject(reason)
            })
        }
    })
}
// 
function promiseAllSettled(arr) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(arr)) {
            return reject('不是数组')
        }
        for (let i = 0; i < arr.length; i++) {
            Promise.resolve(arr[i]).then((value) => {
                return resolve(value)
            }, (reason) => {
                return reject(reason)
            })
        }
    })
}

Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};