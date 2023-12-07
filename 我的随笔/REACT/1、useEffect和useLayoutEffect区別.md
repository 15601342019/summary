<!--
 * @Description: 
 * @Author: jialr3 jialr3@lenovo.com
 * @Date: 2023-11-18 12:18:47
 * @LastEditTime: 2023-12-07 17:55:36
 * @LastEditors: jialr3 jialr3@lenovo.com
-->

## react 18.0 useEffect和 useLayoutEffect 区別

### 直观感受
useEffect能明显看到页面中ui的变化
而seLayoutEffect不会看到
### 分析原理

#### useEffect
* 1、刷新页面或者点击某个按钮
* 2、虚拟dom映射到真实dom上（此时用户还不能看见）
* 3、渲染进程渲染到页面上，此时用户就能看到了
* 4、执行useEffect回调
* 5、useEffect中有修改了某些内容需要渲染到页面上，比如触发了某个setState
* 6、setState(value)
* 7、虚拟dom映射到绅士dom上
* 8、渲染

#### useLayoutEffect
* 1、刷新页面或者点击某个按钮
* 2、虚拟dom映射到真实dom上（此时用户还不能看见）
* 3、执行useLayoutEffect回调
* 4、useLayoutEffect中有修改了某些内容需要渲染到页面上，比如触发了某个setState
* 5、setState(value)
* 6、虚拟dom映射到真实dom上
* 7、渲染进程(GUI)渲染到页面上，此时用户就能看到了（仅一次渲染）

参考链接：[react18的useEffect 和 useLayoutEffect 的执行差异](https://www.bilibili.com/video/BV12P4y1i7k4/?spm_id_from=333.880.my_history.page.click&vd_source=25e17efcafcf4600b4265283cbc82a85)

附：react生命周期图谱


