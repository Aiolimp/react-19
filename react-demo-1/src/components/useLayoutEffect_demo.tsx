import React, { useLayoutEffect } from 'react';

function App() {
  const handelScrool = (e: React.UIEvent<HTMLDivElement>) => {
    const scroolTop = e.currentTarget.scrollTop;
    window.history.replaceState({}, '', `?top=${scroolTop}`); // 每次滚动时，将滚动位置保存到url中
  };
  useLayoutEffect(() => {
    // 获取url中的top值，然后滚动到指定位置
    const container = document.getElementById('container') as HTMLDivElement;
    const top = window.location.search.split('=')[1];
    container.scrollTop = parseInt(top); // 这里的top是字符串，需要转换成数字，否则会报错，因为scrollTop的类型是number，而不是unknow
  }, []);
  return (
    <div onScroll={handelScrool} id="container" style={{ height: '500px', overflow: 'auto' }}>
      {Array.from({ length: 500 }, (_, i) => (
        <div key={i} style={{ height: '100px', borderBottom: '1px solid #ccc' }}>
          Item {i + 1}
        </div>
      ))}
    </div>
  );
}

export default App;
