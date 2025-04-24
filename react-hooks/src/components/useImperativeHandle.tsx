import { useRef, forwardRef, useState, useImperativeHandle } from 'react';
interface ChildRef {
  name: string;
  count: number;
  addCount: () => void;
  subCount: () => void;
}

// React 18.2 版本使用，使用 forwardRef 可以将 ref 从父组件传递到子组件
//19版本不需要配合`forwardRef`一起使用，直接使用即可，他会把Ref跟props放到一起
// const Child = ({ ref }: { ref: React.Ref<ChildRef> }) => {
const Child = forwardRef<ChildRef>((_, ref) => {
  const [count, setCount] = useState(0);
  /**
   * 使用 useImperativeHandle 钩子将自定义的属性和方法暴露给父组件的 ref
   * 第一个参数是传入的 ref，第二个参数是一个函数，返回一个对象，包含要暴露的属性和方法
   */
  useImperativeHandle(ref, () => {
    return {
      name: 'child',
      count,
      addCount: () => setCount(count + 1),
      subCount: () => setCount(count - 1),
    };
  });
  return (
    <div>
      <h3>我是子组件</h3>
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
    </div>
  );
});

function App() {
  // 创建一个 ref，类型为 ChildRef，用于引用子组件
  const childRef = useRef<ChildRef>(null);
  const showRefInfo = () => {
    console.log(childRef.current);
  };
  return (
    <div>
      <h2>我是父组件</h2>
      <button onClick={showRefInfo}>获取子组件信息</button>
      {/* 点击按钮调用子组件的 addCount 方法，增加计数器的值 */}
      <button onClick={() => childRef.current?.addCount()}>操作子组件+1</button>
      {/* 点击按钮调用子组件的 subCount 方法，减少计数器的值 */}
      <button onClick={() => childRef.current?.subCount()}>操作子组件-1</button>
      <hr />
      {/* 将 ref 传递给子组件 */}
      <Child ref={childRef}></Child>
    </div>
  );
}

export default App;
