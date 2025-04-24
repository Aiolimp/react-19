import React from 'react';
import BrotherA from './BrotherA';
import BrotherB from './BrotherB';

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>React + mitt 兄弟组件通信示例</h2>
      <BrotherA />
      <BrotherB />
    </div>
  );
}

export default App;
