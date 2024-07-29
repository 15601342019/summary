
// 新创建元素 更新节点方法
// export default function updateNodeElement(newElement, virtualDOM) {
//     // 获取节点对应的属性
//     const newProps = virtualDOM.props;
//     Object.keys(newProps).forEach((propName) => {
//         // 获取属性值
//         const newPropsValue = newProps[propName]
//         // 判断属性的key是否为事件 以on开头认为是事件属性
//         if (propName.slice(0, 2) === 'on') {
//             const eventName = propName.toLocaleLowerCase().slice(2)
//             // 为元素添加事件
//             newElement.addEventListener(eventName, newPropsValue)
//         } else if (propName === 'value' || propName === 'checked') {
//             // 处理props key为value和checked的情况，因为这两种情况不能直接使用setAttribute方法
//             newElement[propName] = newPropsValue
//         } else if (propName !== 'children') {
//             if (propName === 'className') {
//                 newElement.setAttribute('class', newPropsValue)
//             } else {
//                 newElement.setAttribute(propName, newPropsValue)
//             }
//         }
//     })
// }

// 如果有oldDOM，更新节点需要传第三个参数oldVirtualDOM
export default function updateNodeElement(newElement, virtualDOM, oldVirtualDOM) {
    // 获取新的virtualDOM 节点对应的属性
    const newProps = virtualDOM?.props || {};
    // 获取旧的oldVirtualDOM 节点对应的属性
    const oldProps = oldVirtualDOM?.props || {};
    Object.keys(newProps).forEach((propName) => {
        // 获取属性值
        const newPropsValue = newProps[propName];
        const oldPropsValue = oldProps[propName];
        // 接下来要判断新旧属性值是否相同
        // 如果两个值不相等（包括初始化第一次的时候），即去更新props的值到真实dom节点上
        if (newPropsValue !== oldPropsValue) {
            // 判断属性的key是否为事件 以on开头认为是事件属性
            if (propName.slice(0, 2) === 'on') {
                const eventName = propName.toLocaleLowerCase().slice(2)
                // 为元素添加事件
                // addEventListener可为同一个元素添加多个相同或不同事件，添加的事件不会覆盖已存在的事件。
                newElement.addEventListener(eventName, newPropsValue)
                // 同时考虑 删除原有事件的 事件处理函数
                if (oldPropsValue) {
                    newElement.removeEventListener(eventName, oldPropsValue)
                }
            } else if (propName === 'value' || propName === 'checked') {
                // 处理props key为value和checked的情况，因为这两种情况不能直接使用setAttribute方法
                // propName === 'value' || propName === 'checked'的情况不用考虑删除，直接更新或添加即可
                newElement[propName] = newPropsValue
            } else if (propName !== 'children') {
                if (propName === 'className') {
                    newElement.setAttribute('class', newPropsValue)
                } else {
                    newElement.setAttribute(propName, newPropsValue)
                }
            }
        }

    })

    // 最后 判断属性被删除的情况
    // oldPropsValueo有值而newPropsValue没有值，就认为当前属性被删除了
    Object.keys(oldProps).forEach(propName => {
        const newPropsValue = newProps[propName]
        const oldPropsValue = oldProps[propName]
        if (!newPropsValue) {
            // 属性被删除了
            // 事件和value更新方式不同，要特殊处理，其他属性使用removeAttribute方法删除即可
            if (propName.slice(0, 2) === "on") {
                const eventName = propName.toLowerCase().slice(2)
                newElement.removeEventListener(eventName, oldPropsValue)
            } else if (propName !== "children") {
                if (propName === "value") {
                    newElement.value = ""
                } else {
                    newElement.removeAttribute(propName)
                }
            }
        }
    })
}