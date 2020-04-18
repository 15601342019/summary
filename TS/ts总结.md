#ts summary

#### ts绕过类型检查的三种方式

```js
interface List {
    readonly id: number;
    name: string;
    // [x: string]: any;
    age?: number;
}
interface Result {
    data: List[]
}
function render(result: Result) {
    result.data.forEach((value) => {
        console.log(value.id, value.name)
        if (value.age) {
            console.log(value.age)
        }
        // value.id++
    })
}
let result = {
    data: [
        {id: 1, name: 'A', sex: 'male',aaa:'aaa'},
        {id: 2, name: 'B', age: 10}
    ]
}
render(result) // 即使data里面多传了数据也没有关系，ts不会报错，但是如果是对象字面量形式，就会报错，比如下面调用方式

// render({
//     data: [
//         {id: 1, name: 'A', sex: 'male',aaa:'aaa'},
//         {id: 2, name: 'B', age: 10}
//     ]
// } as Result)

// 想要对象字面量形式传参不报错，需要1、添加类型断言，或者2、给List接口添加  [x: string]: any; 也叫字符串索引签名，3、或者rander(<Result>{data:[...]},不建议使用此种方法，因为在react中容易引起歧义)
```

