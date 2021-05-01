
import muountNativeElement from './muountNativeElement';

export default function mountElement(virtualDOM, container) {
    //渲染元素分 Component 和 NativeElement 两种形式

    muountNativeElement(virtualDOM, container)
}