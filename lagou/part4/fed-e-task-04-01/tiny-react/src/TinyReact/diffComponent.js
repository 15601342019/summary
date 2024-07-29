import mountElement from "./mountElement"
import updateComponent from "./updateComponent"

export default function diffComponent(
    virtualDOM,
    oldComponent,
    oldDOM,
    container
) {
    // 如果是同一个组件的话，需要执行组件更新操作，需要调用组件生命周期函数
    // 先在 Component 类中添加生命周期函数，子类要使用的话直接覆盖就可以
    if (isSameComponent(virtualDOM, oldComponent)) {
        // 同一个组件 做组件更新操作
        // 并且新建 updateComponent 方法用于更新组件操作，并在 if 成立后调用

        updateComponent(virtualDOM, oldComponent, oldDOM, container)
    } else {
        // 不是同一个组件 直接将组件内容显示在页面中
        // 这里为 mountElement 方法新增了一个参数 oldDOM 
        // 作用是在将 DOM 对象插入到页面前 将页面中已存在的 DOM 对象删除 否则无论是旧DOM对象还是新DOM对象都会显示在页面中

        mountElement(virtualDOM, container, oldDOM)
    }
}
// 判断是否是同一个组件
function isSameComponent(virtualDOM, oldComponent) {
    return oldComponent && virtualDOM.type === oldComponent.constructor
}
