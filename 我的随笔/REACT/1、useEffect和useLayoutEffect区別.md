
## useEffect和 useLayoutEffect 区別

### 直观感受
useEffect能明显看到页面中ui的变化
而seLayoutEffect不会看到
### 分析原理

#### useEffect
1、刷新页面或者点击某个按钮
2、虚拟dom映射到真实dom上（此时用户还不能看见）
3、渲染进程渲染到页面上，此时用户就能看到了
4、执行useEffect回调
5、useEffect中有修改了某些内容需要渲染到页面上，比如触发了某个setState
6、setState(value)
7、虚拟dom映射到绅士dom上
8、渲染

#### useLayoutEffect
1、刷新页面或者点击某个按钮
2、虚拟dom映射到真实dom上
3、执行useLayoutEffect回调
4、useLayoutEffect中有修改了某些内容需要渲染到页面上，比如触发了某个setState
5、setState(value)
6、虚拟dom映射到真实dom上
7、渲染进程渲染到页面上，此时用户就能看到了（仅一次渲染）


