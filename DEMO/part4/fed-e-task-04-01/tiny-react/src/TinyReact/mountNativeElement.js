
import createDOMElement from './createDOMElement';

export default function mountNativeElement(virtualDOM,container) {
  const newElement =createDOMElement(virtualDOM)
    // 最后将创建出来的真是dom append到真实的dom container中
    container.appendChild(newElement)
}