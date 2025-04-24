import { useStorage } from '../hooks/useStorage';
export const App = () => {
  const [count, setVal] = useStorage('count', 1);
  return (
    <>
      <div>
        <button onClick={() => setVal(count + 1)}>加一</button>
        <button onClick={() => setVal(count - 1)}>减一</button>
        <span>{count}</span>
      </div>
    </>
  );
};

export default App;
