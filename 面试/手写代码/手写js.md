```js
/**
 * 我的电话：xxx， 有急事或者问题可电话联系我
 * 面试时间 分开始,40-50分钟
 * 1、评测题目: 选择三个级以上你熟悉题目完成 时间40-50分钟
 * 2、请在浏览器窗口里面编写代码，我们两边是同步状态，我们需要关注到你编码的过程
 * 3、尽量使用es6+ 语法和高级API编写 
 * 4、请自行编写每个方法的单测用例，如需运行自行在控制台运行校验
 * 5、尽量保证单个题目作答的正确性####
 */
//-----------------------------题目 1--------------------------------
//使用递归 非递归方式遍历出data 里面所有的name, 得到一个个names 数组
const data1 = [{
        name: '中国',
        children: [{
                name: '教第三节课',
            },
            {
                name: '教呼呼',
                children: [{
                    name: '大一',
                    children: [{
                            name: '课程1',
                            children: [{
                                    name: '1231'
                                },
                                {
                                    name: '121'
                                }
                            ]
                        },
                        {
                            name: '课程3',
                            children: [{
                                name: '1233'
                            }, ]
                        },
                    ]
                }]
            },
            {
                name: '活动',
                children: null
            }
        ]
    },
    {
        name: '菜单'
    }
];

// 使用递归
function getNames(arr, res = []) {
    return arr.reduce((resArr, {
        name,
        children = []
    }) => {
        resArr = [...resArr, name]
        if (children?.length) {
            return getNames(children, resArr)
        }
        return resArr
    }, res)
}
const bb = getNames(data1, []);
console.log(bb)

// 使用非递归
function getNames2(arr) {
    // coding
}
getNames2(data1);
//-----------------------------题目 2--------------------------------
/**
 不用循环，创建一个长度为 100 的数组，并且每个元素的值等于它的下标
 */

function createArray(length) {
    Arrar.from(new Array(100)).map((_, idx) => idx)
}

//-----------------------------题目 3--------------------------------

/**
 * 实现chainAsync，函数挨个执行，前一个执行完毕调用next调用后一个函数，一直调用到最后一个函数
 * 类似express 中间件的实现
 * 0s 输出：0 seconds
 * 3s 输出：3 seconds
 * 5s 输出：5 seconds
 */
function chainAsync(fnArr) {
    // coding
}

chainAsync([])

//-----------------------------题目 4--------------------------------
// 请使用原生代码实现一个Events模块，可以实现自定义事件的订阅、触发、移除功能
/*
const fn1 = (... args)=>console.log('I want sleep1', ... args)
const fn2 = (... args)=>console.log('I want sleep2', ... args)
const event = new Events();
event.on('sleep', fn1, 1, 2, 3);
event.on('sleep', fn2, 1, 2, 3);
event.fire('sleep', 4, 5, 6);
// I want sleep1 1 2 3 4 5 6
// I want sleep2 1 2 3 4 5 6
event.off('sleep', fn1);
event.once('sleep', ()=>console.log('I want sleep));
event.fire('sleep');
*/
class Events {

}

//-----------------------------题目 5--------------------------------

/**
 * 获取两个数组的差集 const a =[1, 2, 2, 3] const b = [3, 4, 5] ==>差集[1, 2, 2, 4, 5]
 */
function getDiffenceTest() {
    let a = [1, 2, 2, 3];
    let b = [3, 4, 5];
    getDiffence(a, b);
}

function getDiffence(arr1, arr2) {
    // 获取公共元素
    const temArr = arr1.filter((item) => {
        return arr2.includes(item)
    })
    // 去除arr1中的公共元素
    const arr1Temp = arr1.filter(item => !temArr.includes(item))
    // 去除arr2中的公共元素
    const arr2Temp = arr2.filter(item => !temArr.includes(item))
    return arr1Temp.concat(arr2Temp)
}

//-----------------------------题目 6--------------------------------
// 给定一个对象，传入key 获取到对应的值
// var obj = {a:{b:1}}   getObjectByKey(obj,'a.b') ==> 1
// var obj = {a:{b:[0,{c:1}]}}   getObjectByKey(obj,'a.b.[1].c') ==> 1
/**
 * 根据路径获取数据
 * @param data 数据
 * @param key key值
 * @param returnUndefined key找不到对应值的时候返回当前层级的数据还是undefined
 */
const getObjectByKey = (data: Record < string, any > , key: string, returnUndefined = false) =>
    key
    .replace(/([\w])(\[)/gi, '$1.[')
    .split('.')
    .reduce((innerData, innerKey) => {
        const match = innerKey.match(/\[(\d+)\]/);
        if (match) {
            // eslint-disable-next-line no-bitwise
            return innerData[match[1] | 0];
        }
        try {
            // 执行 innerKey in innerData 可能会报错
            return innerData && innerKey && innerKey in innerData ?
                innerData[innerKey] :
                returnUndefined ?
                undefined :
                innerData;
        } catch {
            return undefined;
        }
    }, data);

//----------------------------题目6.1--------------------------
// 拉平对象或数组
/* eslint-disable no-nested-ternary */
const flattenObject = (obj: object, prefix = '') =>
    Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? (prefix.endsWith(']') ? prefix : `${prefix}.`) : '';
        const curr = obj[k];
        if (Object.prototype.toString.call(curr) === '[object Object]') {
            Object.assign(acc, flattenObject(curr, pre + k));
        } else if (Array.isArray(curr)) {
            curr.forEach((val, index) => {
                const currKey = `${pre}${k}[${index}]`;
                if (typeof val === 'object') {
                    Object.assign(acc, flattenObject(val, currKey));
                } else {
                    acc[currKey] = val;
                }
            });
        } else {
            acc[pre + k] = curr;
        }
        return acc;
    }, {});

//-----------------------------题目 7--------------------------------
/**
 * 字符串去重，并且找出出现字符最多的字符以及次数
 * 注意：考虑时间复杂度
 */
function stringDuplicateRemoval(str) {
    // coding

}

stringDuplicateRemoval("qishdsjqhduiqshuiedishdddddddddsuaidhwiusdhqidi")

//-----------------------------题目 8--------------------------------
/**给出一个html页面地址，写一段js代码，在控制台运行，能找出该页面用到的所有元素标签名，以及使用第二多的标签名**/

//-----------------------------题目 9--------------------------------
/**
 * 求数组所有子集
 * [1]-->[1]
 * [1,2]--> [1] 、[2]、[1,2]
 * [1,2,3]-->[1] 、[2]、[1,2]、[3]、[1,2,3]、[1,3]、[2,3]
 */
function subsetsTest(arr) {
    subsets([1, 2, 3]);
}

function subsets(arr = []) {
    // coding
}

//-----------------------------题目 10--------------------------------

//  实现 Promise.retry，成功后 resolve 结果，失败后重试，尝试超过一定次数才真正的 reject
// 比如失败后需要重试三次
Promise.resolve( /* xxxxx */ ).retry(() => {
    /* xxxxx */
}, 3)

//-----------------------------题目 11--------------------------------
/**
 * 实现一个函数 deepMapKeys 可根据参数fn 对对象下所有key做处理
 * 例如：
 const deepMapKeys = (obj,fn)=>{
   
 }

 const obj = {
  foo: '1',
  nested: {
    child: {
      withArray: [{
        grandChild: ['hello']
      }]
    }
  }
 };
 const upperKeysObj = deepMapKeys(obj, key => key.toUpperCase());

upperKeysObj 输出结果如下：
/*
{
  "FOO":"1",
  "NESTED":{
    "CHILD":{
      "WITHARRAY":[
        {
          "GRANDCHILD":[ 'hello' ]
        }
      ]
    }
  }
}
*/
const deepMapKeys = (obj, fn) => {
    // coding
    Object.entries(obj).reduce((resObj, [key, value], idx) => {
        const key = fn(key)
        if (Object.propotype.toString.call(value) === '[object object]') {
            deepMapKeys(value, fn)
        }
        return (
            Object.assign(resObj, {
                key: value
            })
        )
    }, {})
}

//-----------------------------题目 12--------------------------------
// 给定一个整数的数组，返回两个元素的下标，这两个元素相加等于一个给定值
// const nums = [1,2,3,4,5,6,7,8,9,10,11,21,12,13];
// const target = 37;
function twoSumTest() {
    // coding
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 21, 12, 13];
    const target = 27;
    twoSum(nums, target);
}

function twoSum(nums, target) {
    for (var idx in nums) {
        for (var innerIdx in nums) {
            if (innerIdx > idx) {
                if (nums[idx] + nums[innerIdx] === target) {
                    retrun[idx, innerIdx]
                }
            }
        }
    }
}
```
