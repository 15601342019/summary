import mountElement from './mountElement';
import updateTextNode from './updateTextNode';
import updateNodeElement from './updateNodeElement';
import createDOMElement from './createDOMElement';

export default function diff(virtualDOM, container, oldDOM) {
    // 定义一个oldVirtualDOM 变量存储
    const oldVirtualDOM = oldDOM?._virtualDOM;
    // 判断oldDom是否存在
    if (!oldDOM) {
        // 没有oldDOM 说明直接渲染即可，使用mountElement方法直接渲染
        mountElement(virtualDOM, container)
    } else if (oldVirtualDOM &&
        // 情况2： 有oldDOM 并且元素类型不相同
        virtualDOM.type !== oldVirtualDOM.type &&
        // 并且节点的类型不是组件 因为组件要单独处理 的情况
        typeof virtualDOM.type !== "function") {

        // 使用新的 virtualDOM 对象生成真实 DOM 对象
        const newElement = createDOMElement(virtualDOM)
        // 使用新的 DOM 对象替换旧的 DOM 对象
        oldDOM.parentNode.replaceChild(newElement, oldDOM)

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

        // 以上只是更新了root下的第一个dom元素，后面还要处理虚拟dom的children
        virtualDOM?.children?.forEach((child, i) => {
            diff(child, oldDOM, oldDOM.childNodes[i])
        })
    }

}