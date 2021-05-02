import isFunction from './isFunction';
export default function isFunctionComponent(virtualDOM) {
    // 用一个变量存储虚拟dom的type属性
    const type = virtualDOM.type;
    return (
        // type 是函数类型并且不存在render属性，说明是Function组件，反之是class组件
        type && isFunction(virtualDOM) && (!type.prototype.render)
    )
}