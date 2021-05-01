import mountElement from './mountElement'
export default function diff(virtualDOM, container, oldDOM) {
    // 判断oldDom是否存在
    if (!oldDOM) {
        // 没有oldDOM 说明直接渲染即可，使用mountElement方法直接渲染
        mountElement(virtualDOM, container)
    } else {
        // 有oldDOM 说明直接渲染即可，使用mountElement
    }

}