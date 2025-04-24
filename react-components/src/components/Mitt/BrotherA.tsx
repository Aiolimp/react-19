import React from 'react';
import emitter from './eventBus';

function BrotherA() {
  const sendMessage = () => {
    emitter.emit('customMessage', 'Hello from BrotherA 👋');
  };

  return (
    <div style={{ margin: '20px 0', padding: 10, border: '1px solid #ccc' }}>
      <h3>BrotherA 组件</h3>
      <button onClick={sendMessage}>发送消息给 BrotherB</button>
    </div>
  );
}

export default BrotherA;
