import { useRef, useState, useImperativeHandle } from 'react';
interface ChildRef {
  name: string;
  validate: () => string | true;
  reset: () => void;
}

const Child = ({ ref }: { ref: React.Ref<ChildRef> }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
  });
  const validate = () => {
    if (!form.username) {
      return '用户名不能为空';
    }
    if (!form.password) {
      return '密码不能为空';
    }
    if (!form.email) {
      return '邮箱不能为空';
    }
    return true;
  };
  const reset = () => {
    setForm({
      username: '',
      password: '',
      email: '',
    });
  };
  useImperativeHandle(ref, () => {
    return {
      name: 'child',
      validate: validate,
      reset: reset,
    };
  });
  return (
    <div style={{ marginTop: '20px' }}>
      <h3>我是表单组件</h3>
      <input
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        placeholder="请输入用户名"
        type="text"
      />
      <input
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="请输入密码"
        type="text"
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="请输入邮箱"
        type="text"
      />
    </div>
  );
};

function App() {
  const childRef = useRef<ChildRef>(null);
  const showRefInfo = () => {
    console.log(childRef.current);
  };
  const submit = () => {
    const res = childRef.current?.validate();
    console.log(res);
  };
  return (
    <div>
      <h2>我是父组件</h2>
      <button onClick={showRefInfo}>获取子组件信息</button>
      <button onClick={() => submit()}>校验子组件</button>
      <button onClick={() => childRef.current?.reset()}>重置</button>
      <hr />
      <Child ref={childRef}></Child>
    </div>
  );
}

export default App;
