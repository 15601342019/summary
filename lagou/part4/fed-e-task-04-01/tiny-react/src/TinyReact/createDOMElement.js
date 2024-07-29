import mountElement from './mountElement';
import updateNodeElement from './updateNodeElement';
/**
 * 将virtualDOM转换为真实的dom对象
 * @param {*} virtualDOM
 * @returns domNode
 */
export default function createDOMElement(virtualDOM) {
    // 处理时 先判断元素节点还是文本节点
    let newElement = null
    if (virtualDOM.type === 'text') {
        // 文本节点
        // console.log(virtualDOM)
        newElement = document.createTextNode(virtualDOM?.props?.textContent)
    } else {
        // 元素节点
        newElement = document.createElement(virtualDOM.type)
        // 如果是元素节点，为节点添加属性
        updateNodeElement(newElement, virtualDOM)
    }
    // 创建真是dom节点时要把_virtualDOM属性添加到dom元素上，这样后续对比的时候就可以使用oldDOM._virtualDOM与最新的virtualDOM进行对比
    newElement._virtualDOM = virtualDOM
    // 以上只是创建了第一个dom节点，virtualDOM还有子元素，需要递归创建子元素节点
    if (virtualDOM.children) {
        virtualDOM.children.forEach(child => {
            // 子元素的创建同样使用mountElement方法，container就是我们刚刚创建出来的newElement
            mountElement(child, newElement)
        });
    }
    // 实现思路是在创建节点时判断其 Virtual DOM 对象中是否有 ref 属性，
    // 如果有就调用 ref 属性中所存储的方法并且将创建出来的DOM对象作为参数传递给 ref 方法，
    // 这样在渲染组件节点的时候就可以拿到元素对象并将元素对象存储为组件属性了。
    if (virtualDOM.props && virtualDOM.props.ref) {
        virtualDOM.props.ref(newElement)
      }
    return newElement;
}