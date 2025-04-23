import { useRef, useState } from 'react';

function App() {
  const div = useRef<HTMLDivElement>(null);
  let num = useRef(0);
  const [count, setCount] = useState(0);
  const handlegetDeom = () => {
    setCount(count + 1);
    num.current = count;
  };
  return (
    <div ref={div}>
      <button onClick={handlegetDeom}>增加</button>
      <span>
        {count}:{num.current}
      </span>
    </div>
  );
}

export default App;
