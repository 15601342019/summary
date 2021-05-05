
import createDOMElement from './createDOMElement';

export default function mountNativeElement(virtualDOM, container, oldDOM) {
  const newElement = createDOMElement(virtualDOM)
  // 最后将创建出来的真是dom append到真实的dom container中
  container.appendChild(newElement)
  // 如果组件实例对象存在
  // 在 mountNativeElement 方法中获取组件实例对象，
  // 通过实例对象调用 setDOM 方法保存 DOM 对象，方便在component组件对比时通过它获取它的 Virtual DOM 对象

  // 判断旧的DOM对象是否存在 如果存在 删除
  if (oldDOM) {
    unmountNode(oldDOM)
  }
  // 获取类组件实例对象
  let component = virtualDOM.component
  // 如果类组件实例对象存在
  if (component) {
    // 将DOM对象存储在类组件实例对象中
    component.setDOM(newElement)
  }
}