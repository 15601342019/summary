import mountElement from './mountElement';
export default function createDOMElement(virtualDOM) {
    // 此方法真正处理将virtualDOM转换为正式的dom对象
    // 处理时 先判断元素节点还是文本节点
    let newElement = null
    if (virtualDOM.type === 'text') {
        // 文本节点
        console.log(virtualDOM)
        newElement = document.createTextNode(virtualDOM?.props?.textContent)
    } else {
        // 元素节点
        newElement = document.createElement(virtualDOM.type)
    }
    // 以上只是创建了第一个dom节点，virtualDOM还有子元素，需要递归创建子元素节点
    if (virtualDOM.children) {
        virtualDOM.children.forEach(child => {
            // 子元素的创建同样使用mountElement方法，container就是我们刚刚创建出来的newElement
            mountElement(child, newElement)
        });
    }
    return newElement;
}