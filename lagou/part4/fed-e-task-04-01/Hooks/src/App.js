import React from 'react';
import ReactDOM from 'react-dom';

let state = [];
let setters = [];
let stateIndex = 0;

function createSetter (index) {
  return function (newState) {
    state[index] = newState;
    render ();
  }
}
/**
 * useState 方法
 * state值不能存在useState函数内部，因为放在内部每次调用state的值都会被初始值覆盖，状态没办法存储，所以我们要在useState函数外面定义一个变量来存储state值，（此处利用的是闭包原理）
 * 又因为useState可以再函数组件中多次调用，所以state变量我们需要用一个数组来存储
 * setters与state同理，都需要数组来存储
 *
 *  又因为setters要与state的下标一一对应，所以我们还需要一个stateIndex变量来记录当前setters与state的下标，这也是hooks会按照写代码的顺序依次执行的原因
 * 
 *
 * @param {*} initialState 初始值
 * @returns 返回一个数组，第一个为值，第二个为设置值的方法
 */
function useState (initialState) {
  state[stateIndex] = state[stateIndex] ? state[stateIndex] : initialState;
  setters.push(createSetter(stateIndex));
  let value = state[stateIndex];
  let setter = setters[stateIndex];
  stateIndex++;
  return [value, setter];
}
/**
 *页面每次重新渲染的时候都需要将stateIndex和effectIndex清空为0
 */
function render () {
  stateIndex = 0;
  effectIndex = 0;
  ReactDOM.render(<App />, document.getElementById('root'));
}

// 上一次的依赖值
let prevDepsAry = [];
let effectIndex = 0;

function useEffect(callback, depsAry) {
  // 判断callback是不是函数
  if (Object.prototype.toString.call(callback) !== '[object Function]') throw new Error('useEffect函数的第一个参数必须是函数');
  // 判断depsAry有没有被传递
  if (typeof depsAry === 'undefined') {
    // 没有传递
    callback();
  } else {
    // 判断depsAry是不是数组
    if (Object.prototype.toString.call(depsAry) !== '[object Array]') throw new Error('useEffect函数的第二个参数必须是数组');
    // 获取上一次的状态值
    let prevDeps = prevDepsAry[effectIndex];
    // 将当前的依赖值和上一次的依赖值做对比 如果有变化 调用callback
    let hasChanged = prevDeps ? depsAry.every((dep, index) => dep === prevDeps[index]) === false : true;
    // 判断值是否有变化
    if (hasChanged) {
      callback();
    }
    // 同步依赖值
    prevDepsAry[effectIndex] = depsAry;
    effectIndex++;
  }
}

function useReducer (reducer, initialState) {
  const [state, setState] = useState(initialState);
  function dispatch (action) {
    const newState = reducer(state, action);
    setState(newState);
  }
  return [state, dispatch];
}

function App() {
  function reducer (state, action) {
    switch (action.type) {
      case 'increment':
        return state + 1;
      case 'decrement':
        return state - 1;
      default:
        return state;
    }
  }
  const [count, dispatch] = useReducer(reducer, 0);
  return <div>
    {count}
    <button onClick={() => dispatch({type: 'increment'})}>+1</button>
    <button onClick={() => dispatch({type: 'decrement'})}>-1</button>
  </div>;
}

export default App;
