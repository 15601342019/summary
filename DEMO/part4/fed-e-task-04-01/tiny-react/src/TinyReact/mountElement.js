
import mountNativeElement from './mountNativeElement';
import mountComponent from './mountComponent';
import isFunction from './isFunction';

export default function mountElement(virtualDOM, container) {
    //渲染元素分 Component 和 NativeElement 两种形式
    // Component type类型为函数（不管是函数组件还是class组件）
    // NativeElement type类型为字符串
    if (isFunction(virtualDOM)) {
        // Component
        mountComponent(virtualDOM, container)
    } else {
        // NativeElement
        mountNativeElement(virtualDOM, container)
    }
}


// import isFunctionComponent from "./isFunctionComponent"
// import mountNativeElement from "./mountNativeElement"
// import isFunction from "./isFunction"

// export default function mountComponent(virtualDOM, container, oldDOM) {
//   let nextVirtualDOM = null
//   let component = null
//   // 判断组件是类组件还是函数组件
//   if (isFunctionComponent(virtualDOM)) {
//     // 函数组件
//     nextVirtualDOM = buildFunctionComponent(virtualDOM)
//   } else {
//     // 类组件
//     nextVirtualDOM = buildClassComponent(virtualDOM)
//     component = nextVirtualDOM.component
//   }
//   if (isFunction(nextVirtualDOM)) {
//     mountComponent(nextVirtualDOM, container, oldDOM)
//   } else {
//     mountNativeElement(nextVirtualDOM, container, oldDOM)
//   }
//   if (component) {
//     component.componentDidMount()
//     if (component.props && component.props.ref) {
//       component.props.ref(component)
//     }
//   }
// }

// function buildFunctionComponent(virtualDOM) {
//   return virtualDOM.type(virtualDOM.props || {})
// }

// function buildClassComponent(virtualDOM) {
//   const component = new virtualDOM.type(virtualDOM.props || {})
//   const nextVirtualDOM = component.render()
//   nextVirtualDOM.component = component
//   return nextVirtualDOM
// }
