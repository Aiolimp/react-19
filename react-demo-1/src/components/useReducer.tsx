import { useReducer } from 'react';

// initialArg 是 state 的初始值。
const initialState = { count: 0, name: '张三' };
type Stage = typeof initialState;
interface Action {
  type: 'increment' | 'decrement';
}

// reducer 是一个处理函数，用于更新状态, reducer 里面包含了两个参数，第一个参数是 state，第二个参数是 action。reducer 会返回一个新的 state。
const reducer = (stage: Stage, action: Action) => {
  switch (action.type) {
    case 'increment':
      return { ...stage, count: stage.count++ };
    case 'decrement':
      return { ...stage, count: stage.count-- };
    default:
      throw new Error(); //抛出错误处理未预期的action类型
  }
};

// init 是一个可选的函数，用于初始化 state，如果编写了init函数，则默认值使用init函数的返回值，否则使用initialArg。
const init = () => {
  initialState.count = 10; // 调用初始方法，设置count初始值为0
  return initialState;
};
export const App = () => {
  // useReducer 返回一个由两个值组成的数组：
  const [stage, dispatch] = useReducer(reducer, initialState, init);
  // 参数：
  // 1. `reducer` 是一个处理函数，用于更新状态, reducer 里面包含了两个参数，第一个参数是 `state`，第二个参数是 `action`。`reducer` 会返回一个新的 `state`。
  // 2. `initialArg` 是 `state` 的初始值。
  // 3. `init` 是一个可选的函数，用于初始化 `state`，如果编写了init函数，则默认值使用init函数的返回值，否则使用`initialArg`。

  // 返回值：
  // useReducer 返回一个由两个值组成的数组：
  // 当前的 state：初次渲染时，它是 init(initialArg) 或 initialArg （如果没有 init 函数）。
  // dispatch 函数：用于更新 state 并触发组件的重新渲染。
  return (
    <>
      <div>
        <button onClick={() => dispatch({ type: 'increment' })}>+</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        <span>{stage.count}</span>
        <span>{stage.name}</span>
      </div>
    </>
  );
};

export default App;
