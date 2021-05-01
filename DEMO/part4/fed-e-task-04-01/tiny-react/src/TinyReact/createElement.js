export default function createElement(type, props, ...children) {
    // 处理子元素的虚拟dom，并将处理后的子元素虚拟dom赋值给children
    const childElements = [].concat(children).reduce((arr, child) => {
        if (child !== true && child !== false && child !== null) {
            if (typeof child === 'string') {
                return [...arr, { type: 'text', props: { textContent: child } }]
            } else {
                return [...arr, child]
            }
        }
        return arr

    }, [])
    return {
        type,
        props: {
            ...props,
            // 给每个props添加childern属性
            children: childElements,
        },
        children: childElements
    }
}