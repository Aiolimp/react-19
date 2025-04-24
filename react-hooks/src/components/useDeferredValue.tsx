import { useState, useDeferredValue } from 'react';
import { Input, List } from 'antd';
import mockjs from 'mockjs';
interface Item {
  name: number;
  address: string;
}
export const App = () => {
  const [val, setVal] = useState('');
  const [list] = useState<Item[]>(() => {
    // 使用 Mock.js 生成模拟数据
    return mockjs.mock({
      'list|10000': [
        {
          'id|+1': 1,
          name: '@natural',
          address: '@county(true)',
        },
      ],
    }).list;
  });
  const deferredQuery = useDeferredValue(val);
  const isStale = deferredQuery !== val; // 检查是否为延迟状态
  const findItem = () => {
    //过滤列表，仅在 deferredQuery 更新时触发
    return list.filter((item) => item.name.toString().includes(deferredQuery));
  };
  return (
    <div>
      <Input value={val} onChange={(e) => setVal(e.target.value)} />
      <List
        style={{ opacity: isStale ? '0.2' : '1', transition: 'all 1s' }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.name} description={item.address} />
          </List.Item>
        )}
        dataSource={findItem()}
      ></List>
    </div>
  );
};

export default App;
