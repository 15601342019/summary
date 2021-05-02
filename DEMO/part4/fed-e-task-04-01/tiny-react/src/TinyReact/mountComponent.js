import isFunctionComponent from './isFunctionComponent';
import mountNativeElement from './mountNativeElement';
import isFunction from './isFunction';

/**
 *渲染组件
 * @export
 * @param {*} virtualDOM 虚拟dom
 * @param {*} container 虚拟dom的父节点
 */
export default function mountComponent(virtualDOM, container,oldDOM) {
    // 首先判断你要处理的是类组件还是函数组件
    // 判断方法：看当前组件的原型对象上有没有render方法
    // 定义一个变量nextVirtualDOM 
    let nextVirtualDOM = null;
    if (isFunctionComponent(virtualDOM)) {
        nextVirtualDOM = buildFunctionComponent(virtualDOM)
    } else {
        // 类组件
        nextVirtualDOM = buildClassComponent(virtualDOM)
        // component = nextVirtualDOM.component
    }
    // 对nextVirtualDOM继续判断，如果是组件，继续使用mountComponent处理，如果不是，使用mountNativeElement处理
    if (isFunction(nextVirtualDOM)) {
        mountComponent(nextVirtualDOM, container, oldDOM)
      } else {
        mountNativeElement(nextVirtualDOM, container, oldDOM)
      }

}
const buildFunctionComponent = (virtualDOM) => {
    // 函数组件存储的就是函数本身，所以我们直接调用当前的组件即可得到虚拟dom
    return virtualDOM.type(virtualDOM.props || {});
}
function buildClassComponent(virtualDOM) {
    // 类组件存储的是构造函数，所以我们可以直接new 虚拟dom的type，并把props参数传递进去
    // 使用component接收获取到的 组件实例对象
    const component = new virtualDOM.type(virtualDOM.props || {})
    // 调用组件实例对象上的render方法，即可获取到该组件的virtualDOM
    const nextVirtualDOM = component.render();
    nextVirtualDOM.component = component
    return nextVirtualDOM
}