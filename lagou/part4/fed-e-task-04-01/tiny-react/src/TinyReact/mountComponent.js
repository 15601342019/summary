import isFunctionComponent from './isFunctionComponent';
import mountNativeElement from './mountNativeElement';
import isFunction from './isFunction';

/**
 *渲染组件
 * @export
 * @param {*} virtualDOM 虚拟dom
 * @param {*} container 虚拟dom的父节点
 */
export default function mountComponent(virtualDOM, container, oldDOM) {
    // 首先判断你要处理的是类组件还是函数组件
    // 判断方法：看当前组件的原型对象上有没有render方法
    // 定义一个变量nextVirtualDOM 
    let nextVirtualDOM = null;
    let component = null;
    if (isFunctionComponent(virtualDOM)) {
        nextVirtualDOM = buildFunctionComponent(virtualDOM)
    } else {
        // 类组件
        nextVirtualDOM = buildClassComponent(virtualDOM)
        // 获取组件实例对象
        component = nextVirtualDOM.component
    }
    // 对nextVirtualDOM继续判断，如果是组件，继续使用mountComponent处理，如果不是，使用mountNativeElement处理
    if (isFunction(nextVirtualDOM)) {
        mountComponent(nextVirtualDOM, container, oldDOM)
    } else {
        mountNativeElement(nextVirtualDOM, container, oldDOM)
    }
    // 如果组件实例对象存在的话
    if (component) {
        // 判断组件实例对象身上是否有 props 属性 props 属性中是否有 ref 属性
        if (component.props && component.props.ref) {
            // 调用 ref 方法并传递组件实例对象
            component.props.ref(component)
        }
        component.componentDidMount()
    }
}
const buildFunctionComponent = (virtualDOM) => {
    // 函数组件存储的就是函数本身，所以我们直接调用当前的组件即可得到虚拟dom
    return virtualDOM.type(virtualDOM.props || {});
}
/**
 * @param {*} virtualDOM 只用到type，生成component实例用的
 * @returns
 */
function buildClassComponent(virtualDOM) {
    // 类组件存储的是构造函数，所以我们可以直接new 虚拟dom的type，
    // 并把props参数传递进去 只有把props传给构造函数，才能让函数或类组件拥有props属性
    // 使用component接收获取到的 组件实例对象
    const component = new virtualDOM.type(virtualDOM.props || {})
    // 调用组件实例对象上的render方法，即可获取到该组件的virtualDOM
    // 问题：render方法获取的为什么是虚拟dom而不是元素节点呢？是因为react遇到jsx语法都会使用creatElement方法解析成虚拟dom吗？
    const nextVirtualDOM = component.render();
    nextVirtualDOM.component = component;
    // console 打印的第一个virtualDOM 是指Alert组件相关信息。
    // console 打印的第二个component 是指Alert组件的实例化对象。
    // console 打印的第三个nextVirtualDOM 是指Alert组件的中render方法返回的虚拟dom。
    // console.log(virtualDOM, component, nextVirtualDOM)
    return nextVirtualDOM
}