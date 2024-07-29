import mountElement from './mountElement';
import updateTextNode from './updateTextNode';
import updateNodeElement from './updateNodeElement';
import createDOMElement from './createDOMElement';
import unmountNode from './unmountNode';
import diffComponent from './diffComponent';

export default function diff(virtualDOM, container, oldDOM) {
    // 定义一个oldVirtualDOM 变量存储
    const oldVirtualDOM = oldDOM?._virtualDOM;
    const oldComponent = oldDOM?.component;
    // 判断oldDom是否存在
    if (!oldDOM) {
        // 没有oldDOM 说明直接渲染即可，使用mountElement方法直接渲染
        mountElement(virtualDOM, container)
    } else if (oldVirtualDOM &&
        // 情况2： 有oldDOM 并且元素类型不相同
        virtualDOM.type !== oldVirtualDOM.type &&
        // 节点的类型不是组件 因为组件要单独处理 的情况
        typeof virtualDOM.type !== "function") {
        // 不需要对比
        // 使用新的 virtualDOM 对象生成真实 DOM 对象
        const newElement = createDOMElement(virtualDOM)
        // 使用新的 DOM 对象替换旧的 DOM 对象
        oldDOM.parentNode.replaceChild(newElement, oldDOM)

    } else if (typeof virtualDOM.type === "function") {
        // 情况3：要更新的是组件
        // 在 diff 方法中判断要更新的 Virtual DOM 是否是组件。
        // 如果是组件再判断要更新的组件和未更新前的组件是否是同一个组件，
        // 如果不是同一个组件就不需要做组件更新操作，直接调用 mountElement 方法将组件返回的 Virtual DOM 添加到页面中。

        // 如果是同一个组件，就执行更新组件操作，其实就是将最新的 props 传递到组件中，
        // 再调用组件的render方法获取组件返回的最新的 Virtual DOM 对象，再将 Virtual DOM 对象传递给 diff 方法，让 diff 方法找出差异，
        // 从而将差异更新到真实 DOM 对象中。

        // 在更新组件的过程中还要在不同阶段调用其不同的组件生命周期函数。

        // 在 diff 方法中判断要更新的 Virtual DOM 是否是组件，如果是组件又分为多种情况，新增 diffComponent 方法进行处理

        // 1) virtualDOM: 组件本身的 virtualDOM 对象 通过它可以获取到组件最新的 props
        // 2) oldComponent: 要更新的组件的实例对象 通过它可以调用组件的生命周期函数 可以更新组件的 props 属性 可以获取到组件返回的最新的 Virtual DOM
        // 3) oldDOM: 要更新的 DOM 象 在更新组件时 需要在已有DOM对象的身上进行修改 实现DOM最小化操作 获取旧的 Virtual DOM 对象
        // 4) container: 如果要更新的组件和旧组件不是同一个组件 要直接将组件返回的 Virtual DOM 显示在页面中 此时需要 container 做为父级容器
        diffComponent(virtualDOM, oldComponent, oldDOM, container)
    } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
        // 情况1： 有oldDOM 并且元素类型相同的情况
        // 情况1.1 如果是文本节点，只需要更新文本内容
        // 情况1.2 如果是元素节点，需要更新元素的属性和文本内容
        if (virtualDOM.type === "text") {
            // 更新内容
            updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
        } else {
            // 更新元素节点属性
            updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
        }
        // 对比子节点
        // 以上只是更新了root下的第一个dom元素，后面还要对比虚拟dom的children
        virtualDOM?.children?.forEach((child, i) => {
            diff(child, oldDOM, oldDOM.childNodes[i])
        })

        // 情况1.3 删除节点
        // 当oldVirtualDOM比virtualDOM children属性length大的时候，说明有节点需要删除
        // 获取旧节点的子节点
        let oldChildNodes = oldDOM.childNodes
        // 判断旧节点的数量
        if (oldChildNodes?.length > virtualDOM?.children?.length) {
            // 有节点需要被删除
            // oldChildNodes从后往前删除
            // 循环删除条件：oldChildNodes.length - 1 > virtualDOM.children.length - 1
            for (
                let i = oldChildNodes.length - 1;
                i > virtualDOM.children.length - 1;
                i--
            ) {
                unmountNode(oldChildNodes[i])
            }
        }
    }
    // 1. 将拥有key属性的子元素放置在一个单独的对象中
    let keyedElements = {}
    for (let i = 0, len = oldDOM.childNodes.length; i < len; i++) {
        let domElement = oldDOM.childNodes[i]
        if (domElement.nodeType === 1) {
            let key = domElement.getAttribute("key")
            if (key) {
                keyedElements[key] = domElement
            }
        }
    }

    let hasNoKey = Object.keys(keyedElements).length === 0

    if (hasNoKey) {
        // 对比子节点
        virtualDOM.children.forEach((child, i) => {
            diff(child, oldDOM, oldDOM.childNodes[i])
        })
    } else {
        // 2. 循环 virtualDOM 的子元素 获取子元素的 key 属性
        virtualDOM.children.forEach((child, i) => {
            let key = child.props.key
            if (key) {
                let domElement = keyedElements[key]
                if (domElement) {
                    // 3. 看看当前位置的元素是不是我们期望的元素
                    if (oldDOM.childNodes[i] && oldDOM.childNodes[i] !== domElement) {
                        oldDOM.insertBefore(domElement, oldDOM.childNodes[i])
                    }
                } else {
                    // 新增元素
                    mountElement(child, oldDOM, oldDOM.childNodes[i])
                }
            }
        })
    }

    // 删除节点
    // 获取旧节点
    let oldChildNodes = oldDOM.childNodes
    // 判断旧节点的数量
    if (oldChildNodes.length > virtualDOM.children.length) {
        if (hasNoKey) {
            // 有节点需要被删除
            for (
                let i = oldChildNodes.length - 1;
                i > virtualDOM.children.length - 1;
                i--
            ) {
                unmountNode(oldChildNodes[i])
            }
        } else {
            // 通过key属性删除节点
            for (let i = 0; i < oldChildNodes.length; i++) {
                let oldChild = oldChildNodes[i]
                let oldChildKey = oldChild._virtualDOM.props.key
                let found = false
                for (let n = 0; n < virtualDOM.children.length; n++) {
                    if (oldChildKey === virtualDOM.children[n].props.key) {
                        found = true
                        break
                    }
                }
                if (!found) {
                    unmountNode(oldChild)
                }
            }
        }
    }
}