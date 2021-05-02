export default function updateNodeElement(newElement, virtualDOM) {
    // 获取节点对应的属性
    const newProps = virtualDOM.props;
    Object.keys(newProps).forEach((propName) => {
        // 获取属性值
        const newPropsValue = newProps[propName]
        // 判断属性的key是否为事件
        if (propName.slice(0, 2) === 'on') {
            const eventName = propName.toLocaleLowerCase().slice(2)
            // 为元素添加事件
            newElement.addEventListener(eventName, newPropsValue)
        } else if (propName === 'value' || propName === 'checked') {
            // 处理props key为value和checked的情况，因为这两种情况不能直接使用setAttribute方法
            newElement[propName] = newPropsValue
        } else if (propName === 'className') {
            newElement.setAttribute('class', newPropsValue)
        } else {
            newElement.setAttribute(propName, newPropsValue)
        }
    })
}