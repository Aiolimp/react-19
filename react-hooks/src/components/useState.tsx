import { useState } from 'react';

function App() {
  // `useState` 接收一个参数，即状态的初始值，然后返回一个数组，其中包含两个元素：
  // 1. 该状态变量 当前的 `state`，最初设置为你提供的 初始化 `state`。
  // 2. set 函数，它允许你在响应交互时将 `state` 更改为任何其他值。
  // 基本数据类型
  const [count, setCount] = useState(0); // //数字 布尔值 null undefined 都可以直接赋值 一样的
  const [str, setStr] = useState('aaa'); // //数字 布尔值 null undefined 都可以直接赋值 一样的
  const updateData = () => {
    setCount(count + 1); // 直接传值
    setStr((pre) => pre + 'c'); // 函数式更新（推荐用于依赖上一次状态的情况）
  };

  // 数组
  const [arr, setArr] = useState([1, 2, 3]); // 数组
  const updateArray = () => {
    // 在React中你需要将数组视为只读的，不可以直接修改原数组，例如：不可以调用 arr.push() arr.pop() 等方法。
    // 添加元素：避免使用push，unshift   推荐使用concat，[...arr] 展开语法
    // arr.push(4); // 这样写视图不会更新，
    setArr([...arr, 4]);

    // 删除元素：避免使用pop，shift，splice  推荐使用filter，[...arr] 展开语法
    setArr(arr.filter((item) => item !== 2));

    //替换元素：避免使用 splice，arr[i] = ... 赋值，  推荐使用map
    setArr(arr.map((item) => (item === 2 ? 9 : item)));

    // 排序、旋转等：避免使用 sort，reverse  推荐先将数组复制一份
    const nextArr = [...arr];
    nextArr.sort((a, b) => b - a);
    setArr(nextArr);

    // 指定位置插入元素
    let startIndex = 0;
    let endIndex = 2;
    setArr([...arr.slice(startIndex, endIndex), 2.5, ...arr.slice(endIndex)]);
  };

  // 对象
  let [obj, setObj] = useState(() => {
    return {
      name: '张三',
      age: 18,
    };
  });
  // useState可以接受一个函数，可以在函数里面编写逻辑，初始化值，注意这个只会执行一次，更新的时候就不会执行了。
  const updateObj = () => {
    // 在使用setObject的时候，可以使用Object.assign合并对象 或者 ... 合并对象，不能单独赋值，不然会覆盖原始对象。
    // setObj({
    //   name: '张三',
    // });
    setObj({
      ...obj,
      name: '李四',
    });
    //setObject(Object.assign({}, obj, { age: 26 })) 第二种写法
  };

  // 函数
  // React 只在初次渲染时保存初始状态，后续渲染时将其忽略。
  // function TodoList() {
  //   const [todos, setTodos] = useState(createInitialTodos());
  // ...
  // 尽管 createInitialTodos() 的结果仅用于初始渲染，但你仍然在每次渲染时调用此函数。如果它创建大数组或执行昂贵的计算，这可能会浪费资源。

  // 为了解决这个问题，你可以将它 作为初始化函数传递给 useState：

  // function TodoList() {
  //   const [todos, setTodos] = useState(createInitialTodos);
  // ...
  // 请注意，你传递的是 createInitialTodos 函数本身，而不是 createInitialTodos() 调用该函数的结果。如果将函数传递给 useState，React 仅在初始化期间调用它。
  // React 在开发模式下可能会调用你的 初始化函数 两次，以验证它们是否是 纯函数。

  // 更新机制
  // 异步机制
  const [index, setIndex] = useState(0);
  const heandleClick = () => {
    setIndex(1); // 异步代码
    console.log(index); // 此时会打印0，因为是同步代码
  };

  //内部机制  当我们多次以相同的操作更新状态时，React 会进行比较，如果值相同，则会屏蔽后续的更新行为。自带防抖的功能，防止频繁的更新。
  const [index2, setIndex2] = useState(0);
  const heandleClick2 = () => {
    // setIndex2(index + 1); // 1
    // setIndex2(index + 1); // 1
    // setIndex2(index + 1); // 1   结果是1并不是3，因为setIndex(index + 1)的值是一样的，后续操作被屏蔽掉了，阻止了更新。

    // 为了解决这个问题，你可以向setIndex 传递一个更新函数，而不是一个状态。
    setIndex2((prevIndex) => prevIndex + 1); //1
    setIndex2((prevIndex) => prevIndex + 1); //2
    setIndex2((prevIndex) => prevIndex + 1); //3
    // 1.index => index + 1 将接收 0 作为待定状态，并返回 1 作为下一个状态。
    // 2.index => index + 1 将接收 1 作为待定状态，并返回 2 作为下一个状态。
    // 3.index => index + 1 将接收 2 作为待定状态，并返回 3 作为下一个状态。
    // 现在没有其他排队的更新，因此 React 最终将存储 3 作为当前状态。
  };
  return (
    <>
      <div>{count}</div>
      <div>{str}</div>
      <button onClick={updateData}>点击更新基本数据类型</button>
      <div>{arr}</div>
      <button onClick={updateArray}>点击更新数组</button>
      <div>名字：{obj.name}</div>
      <div>年龄：{obj.age}</div>
      <button onClick={updateObj}>点击更新对象</button>
      <h1>异步机制:{index}</h1>
      <button onClick={heandleClick}>点击更改</button>
      <h1>内部机制:{index2}</h1>
      <button onClick={heandleClick2}>点击更改</button>
    </>
  );
}

export default App;
