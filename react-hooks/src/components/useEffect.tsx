import { useEffect, useState } from 'react';

// 子组件
const Child = (props: { name: string }) => {
  useEffect(() => {
    let timer = setTimeout(() => {
      fetch(`http://localhost:5174/?name=${props.name}`);
    }, 1000);
    return () => {
      clearTimeout(timer); // 当name值发生改变时，useEffect的副作用函数就会执行，并且会开启一个定时器,避免了接口请求的重复执行
    };
  }, [props.name]);
  return <div>Child</div>;
};

function App() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);
  const [name, setName] = useState('');
  const dom = document.getElementById('data');
  console.log('dom', dom); // 这里的dom是null，因为useEffect是在组件渲染后执行的，此时dom还没有被渲染出来
  useEffect(() => {
    // console.log('执行了');
    // const data = document.getElementById('data');
    // console.log(data); //<div id='data'>张三</div> 这里的data是有值的，因为useEffect是在组件渲染后执行的，此时dom已经被渲染出来了
    fetch('http://localhost:5173/123');
  }, []);
  return (
    <div id="data">
      <div>
        <h3>count:{count}</h3>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <h3>name:{name}</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <h3>父组件</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => setShow(!show)}>显示/隐藏</button>
      </div>
      <hr />
      <h3>子组件</h3>
      {show && <Child name={name} />}
    </div>
  );
}

export default App;
