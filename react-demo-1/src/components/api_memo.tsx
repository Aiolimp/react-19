import React, {  useState } from 'react';
interface User {
   name: string;
   age: number;
   email: string;
}
interface CardProps {
   user: User;
}
// 使用 React.memo 包裹子组件，避免每次父组件的 state 发生变化，子组件都会重新渲染
const Card = React.memo(function ({ user }: CardProps) { 
   console.log('Card render'); // 每次父组件的 state 发生变化，子组件都会重新渲染
  //  当我们使用 memo 缓存后，只有 user 发生变化时，子组件才会重新渲染, 而 search 发生变化时，子组件不会重新渲染。
   const styles = {
      backgroundColor: 'lightblue',
      padding: '20px',
      borderRadius: '10px',
      margin: '10px'
   }
   return <div style={styles}>
      <h1>{user.name}</h1>
      <p>{user.age}</p>
      <p>{user.email}</p>
   </div>
}) 
function App() {
   const [users, setUsers] = useState<User>({
      name: '张三',
      age: 18,
      email: 'zhangsan@example.com'
   });
   const [search, setSearch] = useState('');
   return (
      <div>
         <h1>父组件</h1>
         <input value={search} onChange={(e) => setSearch(e.target.value)} />
         <Card user={users} />
         <div>
            <button onClick={() => setUsers({
               name: '李四',
               age: Math.random() * 100,
               email: 'lisi@example.com'
            })}>更新user</button>
         </div>
      </div>
   );
}

export default App;