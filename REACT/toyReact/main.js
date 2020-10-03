for (let i of [1, 2, 3]) {
    console.log(i)
}
function createElement (tagName, attributes, ...children){
   let e = document.createElement(tagName)
   console.log(tagName, attributes, children)
   for (let p in attributes) {
       console.log(p)
       e.setAttribute(p,attributes[p])
   }
   for(let child of children){
       if(typeof child === 'string'){
           child = document.createTextNode(child);
       }
       e.appendChild(child)
   }
    return e;
}
document.body.appendChild(<div id="a" class="bbb">
    11
<div>22</div>
<div></div>
<div>33</div>
</div>)