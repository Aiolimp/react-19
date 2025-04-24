// src/components/BrotherB.tsx
import React, { useEffect, useState } from 'react';
import emitter from './eventBus';

function BrotherB() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    // 监听消息事件
    const handler = (message: string) => {
      setMsg(message);
    };

    emitter.on('customMessage', handler);

    // 卸载时取消监听
    return () => {
      emitter.off('customMessage', handler);
    };
  }, []);

  return (
    <div style={{ padding: 10, border: '1px solid #ccc' }}>
      <h3>BrotherB 组件</h3>
      <p>收到消息：{msg || '暂无消息'}</p>
    </div>
  );
}

export default BrotherB;
