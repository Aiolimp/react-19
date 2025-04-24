# 数据驱动

## useState

`useState` 是一个 React Hook，允许函数组件在内部管理状态。

组件通常需要根据交互更改屏幕上显示的内容，例如点击某个按钮更改值，或者输入文本框中的内容，这些值被称为状态值也就是(state)

### **使用方法**

`useState` 接收一个参数，即状态的初始值，然后返回一个数组，其中包含两个元素：

1. 该状态变量 当前的 `state`，最初设置为你提供的 初始化 `state`。
2. set 函数，它允许你在响应交互时将 `state` 更改为任何其他值。

```ts
const [state, setState] = useState(initialState); // state 是状态变量，useState 是修改器
```

### **注意事项**

`useState` 是一个 Hook，因此你只能在 `组件的顶层` 或自己的 `Hook` 中调用它。你不能在循环或条件语句中调用它。

在严格模式中，React 将 `两次调用初始化函数`，以 帮你找到意外的不纯性。这只是开发时的行为，不影响生产

### **用法**

#### **基本数据类型**

```ts
// 基本数据类型
const [count, setCount] = useState(0); //数字 布尔值 null undefined 都可以直接赋值 一样的
const [str, setStr] = useState('aaa'); //
const updateData = () => {
  setCount(count + 1); // 直接传值
  setStr((pre) => pre + 'c'); // 函数式更新（推荐用于依赖上一次状态的情况）
};
```

#### **数组**

在 React 中你需要将数组视为只读的，不可以直接修改原数组，例如：不可以调用 `arr.push()` `arr.pop()` 等方法。

下面是常见数组操作的参考表。当你操作 React state 中的数组时，你需要避免使用左列的方法，而首选右列的方法：

| 避免使用 (会改变原始数组)          | 推荐使用 (会返回一个新数组）      |
| :--------------------------------- | :-------------------------------- |
| 添加元素 push，unshift             | concat，[...arr] 展开语法（例子） |
| 删除元素 pop，shift，splice        | filter，slice（例子）             |
| 替换元素 splice，arr[i] = ... 赋值 | map（例子）                       |
| 排序 reverse，sort                 | 先将数组复制一份（例子）          |

```ts
const [arr, setArr] = useState([1, 2, 3]); // 数组
const updateArray = () => {
  // 在React中你需要将数组视为只读的，不可以直接修改原数组，例如：不可以调用 arr.push() arr.pop() 等方法。
  // 添加元素：避免使用push，unshift   推荐使用concat，[...arr] 展开语法
  // arr.push(4); // 这样写视图不会更新，
  setArr([...arr, 4]);

  // 删除元素：避免使用pop，shift，splice  推荐使用filter，[...arr] 展开语法
  setArr(arr.filter((item) => item !== 2));

  // 替换元素：避免使用 splice，arr[i] = ... 赋值，  推荐使用map
  setArr(arr.map((item) => (item === 2 ? 9 : item)));

  // 排序、旋转等：避免使用 sort，reverse  推荐先将数组复制一份
  const nextArr = [...arr];
  nextArr.sort((a, b) => b - a);
  setArr(nextArr);

  // 指定位置插入元素
  let startIndex = 0;
  let endIndex = 2;
  setArr([...arr.slice(startIndex, endIndex), 2.5, ...arr.slice(endIndex)]);
};
```

#### **对象**

useState 可以接受一个函数，可以在函数里面编写逻辑，初始化值，注意这个只会执行一次，更新的时候就不会执行了。

在使用 setObject 的时候，可以使用 Object.assign 合并对象 或者 ... 合并对象，不能单独赋值，不然会覆盖原始对象。

```tsx
let [obj, setObj] = useState(() => {
  return {
    name: '张三',
    age: 18,
  };
});
// useState可以接受一个函数，可以在函数里面编写逻辑，初始化值，注意这个只会执行一次，更新的时候就不会执行了。
const updateObj = () => {
  // 在使用setObject的时候，可以使用Object.assign合并对象 或者 ... 合并对象，不能单独赋值，不然会覆盖原始对象。
  // 不要像下面这样改变一个对象：
  // setObj({
  //   name: '张三',
  // });
  setObj({
    ...obj,
    name: '李四',
  });
  //setObject(Object.assign({}, obj, { age: 26 })) 第二种写法
};
```

#### **函数**

React 只在初次渲染时保存初始状态，后续渲染时将其忽略。

```tsx
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

尽管 `createInitialTodos()` 的结果仅用于初始渲染，但你仍然在每次渲染时调用此函数。如果它创建大数组或执行昂贵的计算，这可能会浪费资源。

为了解决这个问题，你可以将它 **作为初始化函数传递给** `useState`：

```tsx
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

请注意，你传递的是 `createInitialTodos` **函数本身**，而不是 `createInitialTodos()` 调用该函数的结果。如果将函数传递给 `useState`，React 仅在初始化期间调用它。

React 在开发模式下可能会调用你的 [初始化函数](https://react.docschina.org/reference/react/useState#my-initializer-or-updater-function-runs-twice) 两次，以验证它们是否是 [纯函数](https://react.docschina.org/learn/keeping-components-pure)。

### 更新机制

#### **异步机制**

useState set 函数是异步更新的

```tsx
const [index, setIndex] = useState(0);
const heandleClick = () => {
  setIndex(1); // 异步代码
  console.log(index); // 此时会打印0，因为是同步代码
};
```

此时 index 应该打印 1，但是还是 0，因为我们正常编写的代码是同步的，所以会先执行，而 set 函数是异步的所以后执行，这么做是为了性能优化，因为我们要的是结果而不是过程。

#### **内部机制**

当我们多次以相同的操作更新状态时，React 会进行比较，如果值相同，则会屏蔽后续的更新行为。自带`防抖`的功能，防止频繁的更新。

```tsx
import { useState } from 'react';
function App() {
  let [index, setIndex] = useState(0);
  const heandleClick = () => {
    setIndex(index + 1); //1
    setIndex(index + 1); //1
    setIndex(index + 1); //1
    console.log(index, 'index');
  };
  return (
    <>
      <h1>Index:{index}</h1>
      <button onClick={heandleClick}>更改值</button>
    </>
  );
}
export default App;
```

结果是 1 并不是 3，因为`setIndex(index + 1)`的值是一样的，后续操作被屏蔽掉了，阻止了更新。

为了解决这个问题，你可以向`setIndex` 传递一个更新函数，而不是一个状态。

```tsx
import { useState } from 'react';
function App() {
  let [index, setIndex] = useState(0);
  // 按照惯例，通常将待定状态参数命名为状态变量名称的第一个字母，例如 prevIndex 或者其更清楚的名称。
  const heandleClick = () => {
    setIndex((prevIndex) => prevIndex + 1); //1
    setIndex((prevIndex) => prevIndex + 1); //2
    setIndex((prevIndex) => prevIndex + 1); //3
  };
  return (
    <>
      <h1>Index:{index}</h1>
      <button onClick={heandleClick}>更改值</button>
    </>
  );
}
export default App;
```

1. index => index + 1 将接收 0 作为待定状态，并返回 1 作为下一个状态。
2. index => index + 1 将接收 1 作为待定状态，并返回 2 作为下一个状态。
3. index => index + 1 将接收 2 作为待定状态，并返回 3 作为下一个状态。

现在没有其他排队的更新，因此 React 最终将存储 3 作为当前状态。

## useReducer

`useReducer` 是一个 React Hook，它允许你向组件里面添加一个 [reducer](https://react.docschina.org/learn/extracting-state-logic-into-a-reducer)。

### 使用方法

```tsx
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

**参数：**

1. `reducer` 是一个处理函数，用于更新状态, reducer 里面包含了两个参数，第一个参数是 `state`，第二个参数是 `action`。`reducer` 会返回一个新的 `state`。
2. `initialArg` 是 `state` 的初始值。
3. `init` 是一个可选的函数，用于初始化 `state`，如果编写了 init 函数，则默认值使用 init 函数的返回值，否则使用`initialArg`。

**返回值：**

useReducer 返回一个由两个值组成的数组：

- 当前的 state：初次渲染时，它是 init(initialArg) 或 initialArg （如果没有 init 函数）。

- dispatch 函数：用于更新 state 并触发组件的重新渲染。

```tsx
import { useReducer } from 'react';
//根据旧状态进行处理 oldState，处理完成之后返回新状态 newState
//reducer 只有被dispatch的时候才会被调用 刚进入页面的时候是不会执行的
//oldState 任然是只读的
function reducer(oldState, action) {
  // ...
  return newState;
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42,name:'张三' });
  // ...
```

### 计数器案例

初始状态 (initialState):

```tsx
// initialArg 是 state 的初始值。
const initialState = { count: 0, name: '张三' };
type Stage = typeof initialState;
```

初始化函数 init：

```tsx
// init 是一个可选的函数，用于初始化 state，如果编写了init函数，则默认值使用init函数的返回值，否则使用initialArg。
const init = () => {
  initialState.count = 10; // 调用初始方法，设置count初始值为0
  return initialState;
};
```

reducer 函数:

```tsx
interface Action {
  type: 'increment' | 'decrement';
}
// reducer 是一个处理函数，用于更新状态, reducer 里面包含了两个参数，第一个参数是 state，第二个参数是 action。reducer 会返回一个新的 state。
const reducer = (stage: Stage, action: Action) => {
  switch (action.type) {
    case 'add':
      return { ...stage, count: stage.count++ };
    case 'sub':
      return { ...stage, count: stage.count-- };
    default:
      throw new Error(); //抛出错误处理未预期的action类型
  }
};
```

- reducer 是一个用来根据不同的 action 来更新状态的纯函数。
- 它接收当前状态 (state) 和一个动作对象 (action)，根据 action.type 来决定如何更新 state。
- 如果 action.type 是 'increment'，则 count 增加 1；如果是 'decrement'，则 count 减少 1。
- 如果 action.type 不匹配任何已定义的情况，则抛出一个错误。 App 组件:

```tsx
const App = () => {
  const [stage, dispatch] = useReducer(reducer, initialState, init);
  return (
    <>
      <div>
        <button onClick={() => dispatch({ type: 'increment' })}>+</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        <span>{stage.count}</span>
        <span>{stage.name}</span>
      </div>
    </>
  );
};

export default App;
```

- 当点击 "-" 按钮时，调用 dispatch({ type: 'decrement' })，使 count 减少。
- 当点击 "+" 按钮时，调用 dispatch({ type: 'increment' })，使 count 增加。

## useSyncExternalStore

useSyncExternalStore 是 React 18 引入的一个 Hook，用于从外部存储（例如状态管理库、浏览器 API 等）获取状态并在组件中同步显示。这对于需要跟踪外部状态的应用非常有用。

### 场景

1. 订阅外部 store 例如(redux,Zustand`德语`)
2. 订阅浏览器 API 例如(online,storage,location)等
3. 抽离逻辑，编写自定义 hooks
4. 服务端渲染支持

### 用法

```tsx
const res = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

- subscribe：用来订阅数据源的变化，接收一个回调函数，在数据源更新时调用该回调函数。
- getSnapshot：获取当前数据源的快照（当前状态）。
- getServerSnapshot?：在服务器端渲染时用来获取数据源的快照。

返回值：该 res 的当前快照，可以在你的渲染逻辑中使用

```tsx
const subscribe = (callback: () => void) => {
  // 订阅
  callback();
  return () => {
    // 取消订阅
  };
};

const getSnapshot = () => {
  return data;
};

const res = useSyncExternalStore(subscribe, getSnapshot);
```

### 案例

#### **1.订阅浏览器 Api 实现自定义 hook(useStorage)**

我们实现一个 useStorage Hook，用于订阅 localStorage 数据。这样做的好处是，我们可以确保组件在 localStorage 数据发生变化时，自动更新同步。

实现代码

我们将创建一个 useStorage Hook，能够存储数据到 localStorage，并在不同浏览器标签页之间同步这些状态。此 Hook 接收一个键值参数用于存储数据的键名，还可以接收一个默认值用于在无数据时的初始化。

在 hooks/useStorage.ts 中定义 useStorage Hook：

```ts
import { useSyncExternalStore } from 'react';
/**
 *
 * @param key 存储到localStorage 的key
 * @param defaultValue 默认值
 */

export const useStorage = (key: any, defaultValue: any) => {
  const subscribe = (callback: () => void) => {
    // 订阅storage事件
    window.addEventListener('storage', callback);
    return () => {
      // 取消订阅storage事件
      window.removeEventListener('storage', callback);
    };
  };
  //从localStorage中获取数据 如果读不到返回默认值
  const getSnapshot = () => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : defaultValue;
  };
  //修改数据
  const setStore = (value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new StorageEvent('storage')); //手动触发storage事件
  };
  //返回数据
  const res = useSyncExternalStore(subscribe, getSnapshot);

  return [res, setStore];
};
```

在 App.tsx 中，我们可以直接使用 useStorage，来实现一个简单的计数器。值会存储在 localStorage 中，并且在刷新或其他标签页修改数据时自动更新。

```jsx
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
```

效果演示

- 值的持久化：点击按钮增加 val，页面刷新后依然会保留最新值。

- 跨标签页同步：在多个标签页打开该应用时，任意一个标签页修改 val，其他标签页会实时更新，保持同步状态。

#### **2. 订阅 history 实现路由跳转**

实现一个简易的 useHistory Hook，获取浏览器 url 信息 + 参数

```ts
import { useSyncExternalStore } from 'react';

//history  api实现push,replace页面跳转，监听history变化
export const useHistory = () => {
  const subscribe = (callback: () => void) => {
    // 订阅浏览器api 监听history变化
    // history底层：popstate
    // hash底层： hashchange
    window.addEventListener('popstate', callback);
    window.addEventListener('hashchange', callback);
    return () => {
      // 取消订阅storage事件
      window.removeEventListener('popstate', callback);
      window.removeEventListener('hashchange', callback);
    };
    // popstate只能监听浏览器前进后退按钮的点击事件，不能监听pushState，replaceState的变化，需要手动触发
  };

  const getSnapshot = () => {
    return [window.location.href];
  };

  const push = (url: string) => {
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate')); //手动触发storage事件
  };

  const replace = (url: string) => {
    window.history.replaceState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate')); //手动触发storage事件
  };

  const res = useSyncExternalStore(subscribe, getSnapshot);

  return [res, push, replace] as const; // 将数组字面量转换为 只读元组 类型
};
```

使用 useHistory Hook

让我们在组件中使用这个 useHistory Hook，实现基本的前进、后退操作以及程序化导航。

```tsx
import { useHistory } from '../hooks/useHistory';
export const App = () => {
  const [history, push, replace] = useHistory();
  return (
    <>
      <div>
        <button onClick={() => push('/AA')}>跳转</button>
        <button onClick={() => replace('/CCC')}>替换</button>
        <span>{history}</span>
      </div>
    </>
  );
};

export default App;
```

效果演示

- history：这是 useHistory 返回的当前路径值。每次 URL 变化时，useSyncExternalStore 会自动触发更新，使 history 始终保持最新路径。
- push 和 replace：点击“跳转”按钮调用 push("/AA")，会将 /AA 推入历史记录；点击“替换”按钮调用 replace("/CCC")，则会将当前路径替换为 /CCC。

### 注意事项

如果 `getSnapshot` 返回值不同于上一次，React 会重新渲染组件。这就是为什么，如果总是返回一个不同的值，会进入到一个无限循环，并产生这个报错。

```ts
Uncaught (in promise) Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
```

```ts
function getSnapshot() {
  return myStore.todos; //object
}
```

这种写法每次返回了对象的引用，即使这个对象没有改变，React 也会重新渲染组件。

如果你的 store 数据是可变的，`getSnapshot` 函数应当返回一个它的不可变快照。这意味着 确实 需要创建新对象，但不是每次调用都如此。而是应当保存最后一次计算得到的快照，并且在 store 中的数据不变的情况下，返回与上一次相同的快照。如何决定可变数据发生了改变则取决于你的可变 store。

```ts
function getSnapshot() {
  if (myStore.todos !== lastTodos) {
    // 只有在 todos 真的发生变化时，才更新快照
    lastSnapshot = { todos: myStore.todos.slice() };
    lastTodos = myStore.todos;
  }
  return lastSnapshot;
}
```

## useTransition

`useTransition` 是 React 18 中引入的一个 Hook，用于管理 UI 中的过渡状态，特别是在处理长时间运行的状态更新时。它允许你将某些更新标记为“过渡”状态，这样 React 可以优先处理更重要的更新，比如用户输入，同时延迟处理过渡更新。

### 用法

```ts
const [isPending, startTransition] = useTransition();
```

**参数**

`useTransition` 不需要任何参数

**返回值**

`useTransition` 返回一个数组,包含两个元素

1. `isPending`(boolean)，告诉你是否存在待处理的 transition。
2. `startTransition`(function) 函数，你可以使用此方法将状态更新标记为 transition。

### 例子

使用`mockjs`模拟数据

```sh
npm install mockjs
```

mockjs 文档地址：https://github.com/nuysoft/Mock/wiki/Getting-Started

开发自定义 vite mock 插件

```ts
import mockjs from 'mockjs';
import url from 'node:url';
import type { Plugin } from 'vite';
export const viteMockServer = (): Plugin => {
  return {
    name: 'vite-mock-server',
    //使用vite插件的钩子函数
    configureServer(server) {
      server.middlewares.use('/api/list', async (req: any, res) => {
        const parsedUrl = url.parse(req.originalUrl, true);
        //获取url参数 true表示返回对象 {keyWord: 'xx'}
        const query = parsedUrl.query;
        res.setHeader('Content-Type', 'application/json');
        const data = mockjs.mock({
          //返回1000条数据
          'list|1000': [
            {
              'id|+1': 1, //id自增
              name: query.keyWord, //name为url参数中的keyWord
              address: '@county(true)', //address为随机地址
            },
          ],
        });
        //返回数据
        res.end(JSON.stringify(data));
      });
    },
  };
};
```

在 vite.config.ts 中使用

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteMockServer } from './src/plugins/mock';
export default defineConfig({
  plugins: [react(), viteMockServer()],
});
```

创建了一个简单的输入框和一个列表，用于展示基于输入关键词的结果。以下是组件的主要部分：

> Input, Flex, List 来源`antd` https://ant.design/components/input/

```sh
npm install antd
```

```tsx
import { useTransition, useState } from 'react';
import { Input, Flex, List } from 'antd';
interface Item {
  id: number;
  name: string;
  address: string;
}
const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition(); // 开始过渡
  const [list, setList] = useState<Item[]>([]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    fetch(`/api/list?keyWord=${value}`)
      .then((res) => res.json())
      .then((data) => {
        const res = data?.list ?? [];
        // 使用过渡 useTransition
        startTransition(() => {
          setList([...res]);
        });
        //不使用过渡 useTransition
        //setList([...res])
      });
  };
  return (
    <>
      <Flex>
        <Input
          value={inputValue}
          onChange={handleInputChange} // 实时更新
          placeholder="请输入姓名"
        />
      </Flex>
      {isPending && <div>loading...</div>}
      <List
        dataSource={list}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.name} description={item.address} />
          </List.Item>
        )}
      />
    </>
  );
};

export default App;
```

1. 输入框和状态管理 使用 useState Hook 管理输入框的值和结果列表。 每次输入框的内容变化时，handleInputChange 函数会被触发，它会获取用户输入的值，并进行 API 请求。
2. API 请求 在 handleInputChange 中，输入的值会作为查询参数发送到 /api/list API。API 返回的数据用于更新结果列表。 为了优化用户体验，我们将结果更新放在 startTransition 函数中，这样 React 可以在处理更新时保持输入框的响应性。
3. 使用 useTransition useTransition 返回一个布尔值 isPending，指示过渡任务是否仍在进行中。 当用户输入时，如果正在加载数据，我们会显示一个简单的“loading...”提示，以告知用户当前操作仍在进行。
4. 列表渲染 使用 List 组件展示返回的结果，列表项显示每个结果的 name 和 address。

**效果测试：**

不使用 useTransition 效果：

![image-20250422173101872](/Users/dayuyu/Desktop/gogogo/react/react-19/react-demo-1/public/image-20250422173101872.png)使用 useTransition 效果：

![image-20250422173147896](/Users/dayuyu/Desktop/gogogo/react/react-19/react-demo-1/public/image-20250422173147896.png)

### 注意事项

startTransition 必须是同步的

错误做法

```ts
startTransition(() => {
  // ❌ 在调用 startTransition 后更新状态
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

正确做法

```ts
setTimeout(() => {
  startTransition(() => {
    // ✅ 在调用 startTransition 中更新状态
    setPage('/about');
  });
}, 1000);
```

**async await** 错误做法

```ts
startTransition(async () => {
  await someAsyncFunction();
  // ❌ 在调用 startTransition 后更新状态
  setPage('/about');
});
```

正确做法

```ts
await someAsyncFunction();
startTransition(() => {
  // ✅ 在调用 startTransition 中更新状态
  setPage('/about');
});
```

### 原理剖析

useTransition 的核心原理是将一部分状态更新处理为低优先级任务，这样可以将关键的高优先级任务先执行，而低优先级的过渡更新则会稍微延迟处理。这在渲染大量数据、进行复杂运算或处理长时间任务时特别有效。React 通过调度机制来管理优先级：

1. 高优先级更新：直接影响用户体验的任务，比如表单输入、按钮点击等。
2. 低优先级更新：相对不影响交互的过渡性任务，比如大量数据渲染、动画等，这些任务可以延迟执行。

```txt
+-----------------------+
|         App           |
|                       |
|  +--------------+     |
|  |    Input     |     |
|  +--------------+     |
|                       |
|  +--------------+     |
|  |   Display    |     |
|  +--------------+     |
+-----------------------+

用户输入
    |
    v
[高优先级更新] ---> [调度器] ---> [React 更新组件]
    |
    +---> [低优先级过渡更新] --> [调度器] --> [等待处理]
```

## useDeferredValue

useDeferredValue 用于延迟某些状态的更新，直到主渲染任务完成。这对于高频更新的内容（如输入框、滚动等）非常有用，可以让 UI 更加流畅，避免由于频繁更新而导致的性能问题。

### 关联问题：useTransition 和 useDeferredValue 的区别

`useTransition` 和 `useDeferredValue` 都涉及延迟更新，但它们关注的重点和用途略有不同：

- useTransition 主要关注点是`状态的过渡`。它允许开发者控制某个更新的延迟更新，还提供了过渡标识，让开发者能够添加过渡反馈。
- useDeferredValue 主要关注点是`单个值`的延迟更新。它允许你把特定状态的更新标记为低优先级。

### 用法用法

```ts
const deferredValue = useDeferredValue(value);
```

**参数**

- value: 延迟更新的值(支持任意类型)

**返回值**

- deferredValue: 延迟更新的值,在初始渲染期间，返回的延迟值将与您提供的值相同

**注意事项**

当 `useDeferredValue` 接收到与之前不同的值（使用 Object.is 进行比较）时，除了当前渲染（此时它仍然使用旧值），它还会安排一个后台重新渲染。这个后台重新渲染是可以被中断的，如果 value 有新的更新，React 会从头开始重新启动后台渲染。举个例子，如果用户在输入框中的输入速度比接收延迟值的图表重新渲染的速度快，那么图表只会在用户停止输入后重新渲染。

### 案例:延迟搜索数据的更新

```tsx
import React, { useState, useTransition, useDeferredValue } from 'react';
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
```

使用 useDeferredValue 后，输入框中的搜索内容不会立即触发列表过滤，避免频繁的渲染。输入停止片刻后(看起来像节流)，列表会自动更新为符合条件的数据，确保了较流畅的交互体验。

### 陷阱

- `useDeferredValue` 并不是防抖,防抖是需要一个固定的延迟时间，譬如 1 秒后再处理某些行为，但是 useDeferredValue 并不是一个固定的延迟，它会根据用户设备的情况进行延迟，当设备情况好，那么延迟几乎是无感知的

---

## theme: cyanosis

# 副作用

## useEffect

`useEffect` 是 React 中用于处理`副作用`的钩子。并且`useEffect` 还在这里充当生命周期函数，在之前你可能会在类组件中使用 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 来处理这些生命周期事件。

### 什么是副作用函数，什么是纯函数？

**纯函数**

- 输入决定输出：相同的输入永远会得到相同的输出。这意味着函数的行为是可预测的。
- 无副作用：纯函数`不会修改外部状态`，也不会依赖外部可变状态。因此，纯函数内部的操作不会影响外部的变量、文件、数据库等。

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

无论你执行多少次：

```ts
add(1, 2); // 永远都是 3
```

没有修改任何外部变量、没有发请求、没有打印日志 —— 这就是一个纯函数。

**副作用函数**

- 副作用函数 指的是那些在执行时会改变外部状态或依赖外部可变状态的函数。

- 可预测性降低但是副作用不一定是坏事有时候副作用带来的效果才是我们所期待的

- 高耦合度函数非常依赖外部的变量状态紧密
  - 操作引用类型
  - 操作本地存储例如`localStorage`
  - 调用外部 API，例如`fetch` `ajax`
  - 操作`DOM`
  - 计时器

```ts
let globalVariable = 0;

function calculateDouble(number) {
  globalVariable += 1; //修改函数外部环境变量

  localStorage.setItem('globalVariable', globalVariable); //修改 localStorage

  fetch(/*…*/).then((res) => {
    //网络请求
    //…
  });

  document.querySelector('.app').style.color = 'red'; //修改 DOM element

  return number * 2;
}
```

这个函数每次调用都会**改变外部状态**，所以它是一个副作用函数。

### useEffect 用法

```ts
  useEffect(setup, dependencies?)
  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId); // 执行副作用
    connection.connect();
  	return () => { // 清理函数
      connection.disconnect();
  	};
  }, [serverUrl, roomId]) // 依赖项列表

```

**参数**

- setup：Effect 处理函数,可以返回一个**清理函数**。组件挂载时执行 setup,依赖项更新时先执行 cleanup 再执行 setup,组件卸载时执行 cleanup。
- dependencies(可选)：setup 中使用到的响应式值列表(props、state 等)。必须以数组形式编写如\[dep1, dep2]。不传则每次重渲染都执行 Effect。

**返回值**

useEffect 返回 `undefined`

```tsx
let a = useEffect(() => {});
console.log('a', a); //undefined
```

### 基本使用

副作用函数能做的事情`useEffect`都能做，例如操作`DOM`、网络请求、计时器等等。

**操作 DOM**

```jsx
import { useEffect } from 'react';

function App() {
  const dom = document.getElementById('data');
  console.log(dom); // 这里的dom是null，因为useEffect是在组件渲染后执行的，此时dom还没有被渲染出来
  useEffect(() => {
    const data = document.getElementById('data');
    console.log(data); //<div id='data'>张三</div> 这里的data是有值的，因为useEffect是在组件渲染后执行的，此时dom已经被   渲染出来了
  }, []);
  return <div id="data">张三</div>;
}
```

**网络请求**

```tsx
useEffect(() => {
  fetch('http://localhost:5174/?name=AA');
}, []);
```

### 执行时机

##### **组件挂载时执行**

根据我们下面的例子可以观察到，组件在挂载的时候就执行了`useEffect`的副作用函数。

类似于`componentDidMount`

```tsx
useEffect(() => {
  console.log('组件挂载时执行');
});
```

##### 组件更新时执行

- 无依赖项更新

根据我们下面的例子可以观察到，当有响应式值发生改变时，`useEffect`的副作用函数就会执行。

类似于`componentDidUpdate` + `componentDidMount`

```tsx
import { useEffect, useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  useEffect(() => {
    console.log('执行了', count, name);
  }); // useEffect没有第二个参数，无依赖项
  return (
    <div id="data">
      <div>
        <h3>count:{count}</h3>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <h3>name:{name}</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </div>
  );
};
export default App;
```

- 有依赖项更新

根据我们下面的例子可以观察到，当依赖项数组中的`count`值发生改变时，`useEffect`的副作用函数就会执行。而当`name`值改变时,由于它不在依赖项数组中,所以不会触发副作用函数的执行。

```tsx
import { useEffect, useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  useEffect(() => {
    console.log('执行了', count, name);
  }, [count]); //当count发生改变时执行
  return (
    <div id="data">
      <div>
        <h3>count:{count}</h3>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <h3>name:{name}</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </div>
  );
};
export default App;
```

- 依赖项空值

根据我们下面的例子可以观察到，当依赖项为空数组时，`useEffect`的副作用函数只会执行一次，也就是组件挂载时执行。

适合做一些`初始化`的操作例如获取详情什么的。

```tsx
import { useEffect, useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  useEffect(() => {
    console.log('执行了', count, name);
  }, []); //只会执行一次
  return (
    <div id="data">
      <div>
        <h3>count:{count}</h3>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <h3>name:{name}</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </div>
  );
};
export default App;
```

##### 组件卸载时执行

`useEffect`的副作用函数可以返回一个清理函数，当组件卸载时，`useEffect`的副作用函数就会执行清理函数。

确切说清理函数就是副作用函数运行之前，会清楚上一次的副作用函数。

根据我们下面的例子可以观察到，当组件卸载时，`useEffect`的副作用函数就会执行。

类似于`componentWillUnmount`

```tsx
import { useEffect, useState } from 'react';
// 子组件
const Child = (props: { name: string }) => {
  useEffect(() => {
    console.log('render', props.name);
    // 返回一个清理函数
    return () => {
      console.log('unmount', props.name); // 组件卸载时执行
    };
  }, [props.name]);
  return <div>Child:{props.name}</div>;
};
const App = () => {
  const [show, setShow] = useState(true);
  const [name, setName] = useState('');
  return (
    <div id="data">
      <div>
        <h3>父组件</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => setShow(!show)}>显示/隐藏</button>
      </div>
      <hr />
      <h3>子组件</h3>
      {show && <Child name={name} />}
    </div>
  );
};

export default App;
```

##### 清理函数应用场景

例如我们下面这个例子，当`name`值发生改变时，`useEffect`的副作用函数就会执行，并且会开启一个定时器，当`name`值再次发生改变时，`useEffect`的副作用函数就会执行清理函数，清除上一次的定时器。这样就避免了接口请求的重复执行。

```tsx
import { useEffect, useState } from 'react';
// 子组件
const Child = (props: { name: string }) => {
  useEffect(() => {
    let timer = setTimeout(() => {
      fetch(`http://localhost:5174/?name=${props.name}`);
    }, 1000);
    return () => {
      clearTimeout(timer); // 当name值发生改变时，useEffect的副作用函数就会执行，并且会开启一个定时器,避免了接口请求的重复执行
    };
  }, [props.name]);
  return <div>Child</div>;
};
const App = () => {
  const [show, setShow] = useState(true);
  const [name, setName] = useState('');
  return (
    <div id="data">
      <div>
        <h3>父组件</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => setShow(!show)}>显示/隐藏</button>
      </div>
      <hr />
      <h3>子组件</h3>
      {show && <Child name={name} />}
    </div>
  );
};

export default App;
```

### 真实案例

下面是一个真实的用户信息获取案例，通过`id`获取用户信息，并且当`id`发生改变时，会获取新的用户信息。

```tsx
import React, { useState, useEffect } from 'react';
interface UserData {
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
}
function App() {
  const [userId, setUserId] = useState(1); // 假设初始用户ID为1
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  /**
   * 当 userId 发生变化时，触发副作用函数，从 API 获取用户数据
   */
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`); //免费api接口 可以直接使用
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  /**
   * 处理用户输入框值变化的函数，将输入的用户 ID 更新到 userId 状态中
   * @param event - 输入框变化事件对象
   */
  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(parseInt(event.target.value));
  };

  return (
    <div>
      <h1>用户信息应用</h1>
      <label>
        输入用户ID:
        <input type="number" value={userId} onChange={handleUserChange} min="1" max="10" />
      </label>
      {loading && <p>加载中...</p>}
      {error && <p>错误: {error}</p>}
      {userData && (
        <div>
          <h2>用户信息</h2>
          <p>姓名: {userData.name}</p>
          <p>邮箱: {userData.email}</p>
          <p>用户名: {userData.username}</p>
          <p>电话: {userData.phone}</p>
          <p>网站: {userData.website}</p>
        </div>
      )}
    </div>
  );
}

export default App;
```

## useLayoutEffect

`useLayoutEffect` 是 React 中的一个 Hook，用于在浏览器重新绘制屏幕之前触发。与 useEffect 类似。

### 用法

```jsx
useLayoutEffect(() => {
  // 副作用代码
  return () => {
    // 清理代码
  };
}, [dependencies]);
```

**参数**

- setup：Effect 处理函数,可以返回一个清理函数。组件挂载时执行 setup,依赖项更新时先执行 cleanup 再执行 setup,组件卸载时执行 cleanup。
- dependencies(可选)：setup 中使用到的响应式值列表(props、state 等)。必须以数组形式编写如\[dep1, dep2]。不传则每次重渲染都执行 Effect。

**返回值**

useLayoutEffect 返回 `undefined`

### 区别(useLayoutEffect/useEffect)

| 区别     | useLayoutEffect                      | useEffect                            |
| :------- | :----------------------------------- | :----------------------------------- |
| 执行时机 | 浏览器完成布局和绘制`之前`执行副作用 | 浏览器完成布局和绘制`之后`执行副作用 |
| 执行方式 | 同步执行                             | 异步执行                             |
| DOM 渲染 | 阻塞 DOM 渲染                        | 不阻塞 DOM 渲染                      |

### 测试 DOM 阻塞

下面这个例子展示了 useLayoutEffect 和 useEffect 在 DOM 渲染时的区别。useLayoutEffect 会阻塞 DOM 渲染,而 useEffect 不会。

```jsx
import React, { useLayoutEffect, useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  //不阻塞DOM
  // useEffect(() => {
  //    for (let i = 0; i < 50000; i++) {
  //       //console.log(i);
  //       setCount(count => count + 1)
  //    }
  // }, []);
  //阻塞DOM
  // useLayoutEffect(() => {
  //    for (let i = 0; i < 50000; i++) {
  //       //console.log(i);
  //       setCount(count => count + 1)
  //    }
  // }, []);
  return (
    <div>
      <div>app </div>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{index}</div>
      ))}
    </div>
  );
}

export default App;
```

### 测试同步异步渲染

在下面的动画示例代码中:

1.  useEffect 实现的动画效果:
    - 初始渲染时 opacity: 0
    - 浏览器完成绘制
    - useEffect 异步执行,设置 opacity: 1
    - 用户可以看到完整的淡入动画过渡效果
2.  useLayoutEffect 实现的动画效果:
    - 初始渲染时 opacity: 0
    - DOM 更新后立即同步执行 useLayoutEffect
    - 设置 opacity: 1
    - 浏览器绘制时已经是最终状态
    - 用户看不到过渡动画效果

```css
#app1 {
  width: 200px;
  height: 200px;
  background: red;
}

#app2 {
  width: 200px;
  height: 200px;
  background: blue;
  margin-top: 20px;
  position: absolute;
  top: 230px;
}
```

```tsx
import React, { useLayoutEffect, useEffect, useRef } from 'react';
function App() {
  // 使用 useEffect 实现动画效果
  useEffect(() => {
    const app1 = document.getElementById('app1') as HTMLDivElement;
    app1.style.transition = 'opacity 3s';
    app1.style.opacity = '1';
  }, []);

  // 使用 useLayoutEffect 实现动画效果
  useLayoutEffect(() => {
    const app2 = document.getElementById('app2') as HTMLDivElement;
    app2.style.transition = 'opacity 3s';
    app2.style.opacity = '1';
  }, []);

  return (
    <div>
      <div id="app1" style={{ opacity: 0 }}>
        app1
      </div>
      <div id="app2" style={{ opacity: 0 }}>
        app2
      </div>
    </div>
  );
}

export default App;
```

### 应用场景

- 需要同步读取或更改 DOM：例如，你需要读取元素的大小或位置并在渲染前进行调整。
- 防止闪烁：在某些情况下，异步的 useEffect 可能会导致可见的布局跳动或闪烁。例如，动画的启动或某些可见的快速 DOM 更改。
- 模拟生命周期方法：如果你正在将旧的类组件迁移到功能组件，并需要模拟 componentDidMount、componentDidUpdate 和 componentWillUnmount 的同步行为。

### 案例

可以记录滚动条位置，等用户返回这个页面时，滚动到之前记录的位置。增强用户体验。

```tsx
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
```

## useRef

当你在 React 中需要处理 DOM 元素或需要在组件渲染之间保持持久性数据时，便可以使用 useRef。

```ts
import { useRef } from 'react';
const refValue = useRef(initialValue);
refValue.current; // 访问ref的值 类似于vue的ref,Vue的ref是.value，其次就是vue的ref是响应式的，而react的ref不是响应式的
```

### 通过 Ref 操作 DOM 元素

**参数**

- initialValue：ref 对象的 current 属性的初始值。可以是任意类型的值。这个参数在首次渲染后被忽略。

**返回值**

- useRef 返回一个对象，对象的 current 属性指向传入的初始值。 `{current:xxxx}`

**注意**

- 改变 ref.current 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 ref 是一个普通的 JavaScript 对象。
- 除了 **初始化** 外不要在渲染期间写入或者读取 ref.current，否则会使组件行为变得不可预测。

```tsx
import { useRef } from 'react';
function App() {
  //首先，声明一个 初始值 为 null 的 ref 对象
  let div = useRef(null);
  const heandleClick = () => {
    //当 React 创建 DOM 节点并将其渲染到屏幕时，React 将会把 DOM 节点设置为 ref 对象的 current 属性
    console.log(div.current);
  };
  return (
    <>
      {/*然后将 ref 对象作为 ref 属性传递给想要操作的 DOM 节点的 JSX*/}
      <div ref={div}>dom元素</div>
      <button onClick={heandleClick}>获取dom元素</button>
    </>
  );
}
export default App;
```

### 数据存储

我们实现一个保存 count 的新值和旧值的例子，但是在过程中我们发现一个问题，就是 num 的值一直为 0，这是为什么呢？

因为等`useState`的 `SetCount`执行之后，组件会重新 rerender,num 的值又被初始化为了 0，所以 num 的值一直为 0。

```ts
import React, { useLayoutEffect, useRef, useState } from 'react';

function App() {
  let num = 0;
  let [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
    num = count;
  };
  return (
    <div>
      <button onClick={handleClick}>增加</button>
      <div>
        {count}:{num}
      </div>
    </div>
  );
}

export default App;
```

![useref1.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/4eeadaf19b5b4ea580b9738cbba26496~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQWlvbGltcA==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ3NDExMjQ3NjYzNjgyNCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1746066013&x-orig-sign=MPOgiVnW1mSRlj4lH6a%2FVdOG4%2Bk%3D)

**如何修改？**

我们可以使用 useRef 来解决这个问题，因为 useRef 只会在初始化的时候执行一次，当组件 reRender 的时候，useRef 的值不会被重新初始化。

```tsx
import React, { useLayoutEffect, useRef, useState } from 'react';

function App() {
  let num = useRef(0); // 将num转换成useRef类型，useRef的值不会被重新初始化
  let [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
    num.current = count;
  };
  return (
    <div>
      <button onClick={handleClick}>增加</button>
      <div>
        {count}:{num.current}
      </div>
    </div>
  );
}

export default App;
```

![useref2.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/aeb75748d8874a96b7bb7755c3ec3efa~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQWlvbGltcA==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ3NDExMjQ3NjYzNjgyNCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1746066013&x-orig-sign=jt3wzAJA%2FLnqRG6HZCDQpG5GliU%3D)

### 实际应用

我们实现一个计时器的例子，在点击开始计数的时候，计时器会每 300ms 执行一次，在点击结束计数的时候，计时器会被清除。

**问题**

我们发现，点击 end 的时候，计时器并没有被清除，这是为什么呢？

**原因**

这是因为组件一直在重新 ReRender,所以 timer 的值一直在被重新赋值为 null，导致无法清除计时器。

```tsx
import React, { useLayoutEffect, useRef, useState } from 'react';

function App() {
  console.log('render');
  let timer: NodeJS.Timeout | null = null;
  let [count, setCount] = useState(0);
  const handleClick = () => {
    timer = setInterval(() => {
      setCount((count) => count + 1);
    }, 300);
  };
  const handleEnd = () => {
    console.log(timer); //点击end的时候，计时器并没有被清除
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };
  return (
    <div>
      <button onClick={handleClick}>开始计数</button>
      <button onClick={handleEnd}>结束计数</button>
      <div>{count}</div>
    </div>
  );
}

export default App;
```

**如何修改？**

我们可以使用 useRef 来解决这个问题，因为 useRef 的值不会因为组件的重新渲染而改变。

```tsx
import React, { useLayoutEffect, useRef, useState } from 'react';

function App() {
  console.log('render');
  let timer = useRef<null | NodeJS.Timeout>(null); // react里，定时器需要用uesRef定义
  let [count, setCount] = useState(0);
  const handleClick = () => {
    timer.current = setInterval(() => {
      setCount((count) => count + 1);
    }, 300);
  };
  const handleEnd = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };
  return (
    <div>
      <button onClick={handleClick}>开始计数</button>
      <button onClick={handleEnd}>结束计数</button>
      <div>{count}</div>
    </div>
  );
}

export default App;
```

### 注意事项

1.  组件在重新渲染的时候，useRef 的值不会被重新初始化。
2.  改变 ref.current 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 ref 是一个普通的 JavaScript 对象。
3.  useRef 的值不能作为 useEffect 等其他 hooks 的依赖项，因为它并不是一个响应式状态。
4.  useRef 不能直接获取子组件的实例，需要使用 forwardRef。

## useImperativeHandle

可以在子组件内部暴露给父组件`句柄`，那么说人话就是，父组件可以调用子组件的方法，或者访问子组件的属性。 如果你学过 Vue，就类似于 Vue 的`defineExpose`。

### 用法

```ts
useImperativeHandle(
  ref,
  () => {
    return {
      // 暴露给父组件的方法或属性
    };
  },
  [deps]
);
```

### 参数

- ref: 父组件传递的 ref 对象
- createHandle: 返回值，返回一个对象，对象的属性就是子组件暴露给父组件的方法或属性
- deps?:\[可选] 依赖项，当依赖项发生变化时，会重新调用 createHandle 函数，类似于`useEffect`的依赖项

### 入门案例

> \[!NOTE]
>
> useRef 在`18`版本 和 `19`版本使用方式不一样

#### 18 版本

18 版本需要配合`forwardRef`一起使用

forwardRef 包装之后，会有两个参数，第一个参数是 props，第二个参数是 ref

我们使用的时候只需要将 ref 传递给`useImperativeHandle`即可，然后`useImperativeHandle` 就可以暴露子组件的方法或属性给父组件， 然后父组件就可以通过 ref 调用子组件的方法或访问子组件的属性

```tsx
import { useRef, forwardRef, useState, useImperativeHandle } from 'react';
interface ChildRef {
  name: string;
  count: number;
  addCount: () => void;
  subCount: () => void;
}

// React 18.2 版本使用，使用 forwardRef 可以将 ref 从父组件传递到子组件
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
```

#### 19 版本

1.  19 版本不需要配合`forwardRef`一起使用，直接使用即可，他会把 Ref 跟 props 放到一起，你会发现变得更加简单了
2.  19 版本 useRef 的参数改为必须传入一个参数例如`useRef<ChildRef>(null)`

```tsx
import { useRef, useState, useImperativeHandle } from 'react';
interface ChildRef {
  name: string;
  count: number;
  addCount: () => void;
  subCount: () => void;
}

//19版本不需要配合`forwardRef`一起使用，直接使用即可，他会把Ref跟props放到一起
// const Child = forwardRef<ChildRef>((_, ref) => {
const Child = ({ ref }: { ref: React.Ref<ChildRef> }) => {
  const [count, setCount] = useState(0);
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
};

function App() {
  const childRef = useRef<ChildRef>(null);
  const showRefInfo = () => {
    console.log(childRef.current);
  };
  return (
    <div>
      <h2>我是父组件</h2>
      <button onClick={showRefInfo}>获取子组件信息</button>
      <button onClick={() => childRef.current?.addCount()}>操作子组件+1</button>
      <button onClick={() => childRef.current?.subCount()}>操作子组件-1</button>
      <hr />
      <Child ref={childRef}></Child>
    </div>
  );
}

export default App;
```

### 执行时机

1.  如果不传入第三个参数，那么`useImperativeHandle`会在组件挂载时执行一次，然后状态更新时，都会执行一次

```tsx
useImperativeHandle(ref, () => {});
```

1.  如果传入第三个参数，并且是一个空数组，那么`useImperativeHandle`会在组件挂载时执行一次，然后状态更新时，不会执行

```tsx
useImperativeHandle(ref, () => {}, []);
```

1.  如果传入第三个参数，并且有值，那么`useImperativeHandle`会在组件挂载时执行一次，然后会根据依赖项的变化，决定是否重新执行

```tsx
const [count, setCount] = useState(0);
useImperativeHandle(ref, () => {}, [count]);
```

### 实际案例

例如，我们封装了一个表单组件，提供了两个方法：校验和重置。使用`useImperativeHandle`可以将这些方法暴露给父组件，父组件便可以通过`ref`调用子组件的方法。

```tsx
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
```

## useContext

useContext 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。设计的目的就是解决组件树间数据传递的问题

### 用法

```tsx
const MyThemeContext = React.createContext({ theme: 'light' }); // 创建一个上下文
function App() {
  return (
    <MyThemeContext.Provider value={{ theme: 'light' }}>
      <MyComponent />
    </MyThemeContext.Provider>
  );
}
function MyComponent() {
  const themeContext = useContext(MyThemeContext); // 使用上下文
  return <div>{themeContext.theme}</div>;
}
```

### 参数

入参

- context：是 createContext 创建出来的对象，他不保持信息，他是信息的载体。声明了可以从组件获取或者给组件提供信息。

返回值

- 返回传递的 Context 的值，并且是只读的。如果 context 发生变化，React 会自动重新渲染读取 context 的组件

### 基本用法

- 18 版本演示

首先我们先通过 createContext 创建一个上下文，然后通过 createContext 创建的组件包裹组件，传递值。

被包裹的组件，在任何一个层级都是可以获取上下文的值，那么如何使用呢？

使用的方式就是通过 useContext 这个 hook，然后传入上下文，就可以获取到上下文的值。

```tsx
import React, { useContext, useState } from 'react';
// 创建上下文
const ThemeContext = React.createContext<ThemeContextType>({} as ThemeContextType);
// 定义上下文类型
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const Child = () => {
  const themeContext = useContext(ThemeContext); //获取上下文对象
  const styles = {
    backgroundColor: themeContext.theme === 'light' ? 'white' : 'black',
    border: '1px solid red',
    width: 100 + 'px',
    height: 100 + 'px',
    color: themeContext.theme === 'light' ? 'black' : 'white',
  };
  return (
    <div style={styles}>
      <h2>我是子组件</h2>
      <button onClick={() => themeContext.setTheme(themeContext.theme === 'light' ? 'dark' : 'light')}>
        子组件修改主题色：
      </button>
      {/* 子组件调用父组件的方法 */}
    </div>
  );
};

const Parent = () => {
  // 获取上下文
  const themeContext = useContext(ThemeContext);
  const styles = {
    backgroundColor: themeContext.theme === 'light' ? 'white' : 'black',
    border: '1px solid red',
    width: 100 + 'px',
    height: 100 + 'px',
    color: themeContext.theme === 'light' ? 'black' : 'white',
  };
  return (
    <div>
      <div style={styles}>Parent</div>
      <Child />
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>切换主题</button>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Parent />
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
```

- 19 版本演示

> 其实 19 版本和 18 版本是差不多的，只是 19 版本更加简单了，不需要再使用 Provider 包裹，直接使用即可。

```tsx
import React, { useContext, useState } from 'react';
const ThemeContext = React.createContext<ThemeContextType>({} as ThemeContextType);
interface ThemeContextType {
   theme: string;
   setTheme: (theme: string) => void;
}

const Child = () => {
  const themeContext = useContext(ThemeContext); //获取上下文对象
  const styles = {
    backgroundColor: themeContext.theme === "light" ? "white" : "black",
    border: "1px solid red",
    width: 100 + "px",
    height: 100 + "px",
    color: themeContext.theme === "light" ? "black" : "white",
  };
  return (
    <div style={styles}>
      <h2>我是子组件</h2>
      <button
        onClick={() =>
          themeContext.setTheme(
            themeContext.theme === "light" ? "dark" : "light"
          )
        }
      >
        子组件修改主题色：
      </button>
       {/* 子组件调用父组件的方法 */}
    </div>
  );
};

const Parent = () => {
   const themeContext = useContext(ThemeContext);  //获取上下文对象
   const styles = {
      backgroundColor: themeContext.theme === 'light' ? 'white' : 'black',
      border: '1px solid red',
      width: 100 + 'px',
      height: 100 + 'px',
      color: themeContext.theme === 'light' ? 'black' : 'white'
   }
   return <div>
      <div style={styles}>
         Parent
      </div>
      <Child />
   </div>
}
function App() {
   const [theme, setTheme] = useState('light');
   return (
      <div>
         <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>切换主题</button>
         <ThemeContext value={{ theme, setTheme }}>
            <Parent />
         <ThemeContext>
      </div >
   );
}

export default App;
```

### 注意事项

- 使用 ThemeContext 时，传递的 key 必须为`value`

```tsx
// 🚩 不起作用：prop 应该是“value”
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
// ✅ 传递 value 作为 prop
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

- 可以使用多个 Context

> 如果使用多个 Context，那么需要注意，如果使用的值是相同的，那么会覆盖。

```tsx
const ThemeContext = React.createContext({ theme: 'light' });

function App() {
  return (
    <ThemeContext value={{ theme: 'light' }}>
      <ThemeContext value={{ theme: 'dark' }}>
        {' '}
        {/* 覆盖了上面的值 */}
        <Parent />
      </ThemeContext>
    </ThemeContext>
  );
}
```

---

## theme: cyanosis

# 状态派生

## useMemo

`useMemo` 是 React 提供的一个性能优化 Hook。它的主要功能是避免在每次渲染时执行复杂的计算和对象重建。通过记忆上一次的计算结果，仅当依赖项变化时才会重新计算，提高了性能，有点类似于 Vue 的`computed`。

### React.memo

`React.memo` 是一个 React API，用于优化性能。它通过记忆上一次的渲染结果，仅当 props 发生变化时才会重新渲染, 避免重新渲染。

#### 用法

使用 `React.memo` 包裹组件`[一般用于子组件]`，可以避免组件重新渲染。

```tsx
import React, { memo } from 'react';
const MyComponent = React.memo(({ prop1, prop2 }) => {
  // 组件逻辑
});
const App = () => {
  return <MyComponent prop1="value1" prop2="value2" />;
};
```

#### React.memo 案例

首先明确 React 组件的渲染条件：

1.  组件的 props 发生变化
2.  组件的 state 发生变化
3.  useContext 发生变化

我们来看下面这个例子，这个例子没有使用 `memo` 进行缓存，所以每次父组件的 state 发生变化，子组件都会重新渲染。

> 而我们的子组件只用到了 user 的信息，但是父组件每次 search 发生变化，子组件也会重新渲染, 这样就就造成了没必要的渲染所以我们使用 `memo` 缓存。

```tsx
import React, { useMemo, useState } from 'react';
interface User {
   name: string;
   age: number;
   email: string;
}
interface CardProps {
   user: User;
}
const Card = function ({ user }: CardProps) {
const Card = React.memo(function ({ user }: CardProps) {
   console.log('Card render'); // 每次父组件的 state 发生变化，子组件都会重新渲染
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
}
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
      </div>
   );
}

export default App;
```

当我们使用 `memo` 缓存后，只有 user 发生变化时，子组件才会重新渲染, 而 search 发生变化时，子组件不会重新渲染。

```tsx
import React, { useMemo, useState } from 'react';
interface User {
  name: string;
  age: number;
  email: string;
}
interface CardProps {
  user: User;
}
const Card = React.memo(function ({ user }: CardProps) {
  // 只有 user 发生变化时，子组件才会重新渲染
  console.log('Card render');
  const styles = {
    backgroundColor: 'lightblue',
    padding: '20px',
    borderRadius: '10px',
    margin: '10px',
  };
  return (
    <div style={styles}>
      <h1>{user.name}</h1>
      <p>{user.age}</p>
      <p>{user.email}</p>
    </div>
  );
});
function App() {
  const [users, setUsers] = useState<User>({
    name: '张三',
    age: 18,
    email: 'zhangsan@example.com',
  });
  const [search, setSearch] = useState('');
  return (
    <div>
      <h1>父组件</h1>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <div>
        <button
          onClick={() =>
            setUsers({
              name: '李四',
              age: Math.random() * 100,
              email: 'lisi@example.com',
            })
          }
        >
          更新user
        </button>
      </div>
      <Card user={users} />
    </div>
  );
}

export default App;
```

#### React.memo 总结

1.  **使用场景**：

    - 当子组件接收的 props 不经常变化时

    - 当组件重新渲染的开销较大时

    - 当需要避免不必要的渲染时

2.  **优点**：

    - 通过记忆化避免不必要的重新渲染
    - 提高应用性能
    - 减少资源消耗

3.  **注意事项**：

    - 不要过度使用，只在确实需要优化的组件上使用
    - 对于简单的组件，使用 `memo` 的开销可能比重新渲染还大
    - 如果 props 经常变化， `memo` 的效果会大打折扣

### useMemo 用法

#### 参数

入参

- 回调函数:Function：返回需要缓存的值
- 依赖项:Array：依赖项发生变化时，回调函数会重新执行`(执行时机跟useEffect类似)`

返回值

- 返回值：返回需要缓存的值`(返回之后就不是函数了)`

#### useMemo 案例

> 我们来看下面这个例子，这个例子没有使用 `useMemo` 进行缓存，所以每次 search 发生变化， `total` 都会重新计算，这样就造成了没必要的计算所以我们可以使用 `useMemo` 缓存，因为我们的 `total` 跟 `search` 没有关系，那么如果计算的逻辑比较复杂，就造成了性能问题。

```tsx
import React, { useMemo, useState } from 'react';

function App() {
  const [search, setSearch] = useState('');
  const [goods, setGoods] = useState([
    { id: 1, name: '苹果', price: 10, count: 1 },
    { id: 2, name: '香蕉', price: 20, count: 1 },
    { id: 3, name: '橘子', price: 30, count: 1 },
  ]);
  const handleAdd = (id: number) => {
    setGoods(goods.map((item) => (item.id === id ? { ...item, count: item.count + 1 } : item)));
  };
  const handleSub = (id: number) => {
    setGoods(goods.map((item) => (item.id === id ? { ...item, count: item.count - 1 } : item)));
  };
  const total = () => {
    console.log('total'); // 此时只要input发生了改变都会进入到这个函数，影响性能
    //例如很复杂的计算逻辑
    return goods.reduce((total, item) => total + item.price * item.count, 0);
  };
  return (
    <div>
      <h1>父组件</h1>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>商品名称</th>
            <th>商品价格</th>
            <th>商品数量</th>
          </tr>
        </thead>
        <tbody>
          {goods.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price * item.count}</td>
              <td>
                <button onClick={() => handleAdd(item.id)}>+</button>
                <span>{item.count}</span>
                <button onClick={() => handleSub(item.id)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>总价：{total()}</h2>
    </div>
  );
}

export default App;
```

> 当我们使用 `useMemo` 缓存后，只有 goods 发生变化时， `total` 才会重新计算, 而 search 发生变化时， `total` 不会重新计算

```tsx
import React, { useMemo, useState } from 'react';

function App() {
  const [search, setSearch] = useState('');
  const [goods, setGoods] = useState([
    { id: 1, name: '苹果', price: 10, count: 1 },
    { id: 2, name: '香蕉', price: 20, count: 1 },
    { id: 3, name: '橘子', price: 30, count: 1 },
  ]);
  const handleAdd = (id: number) => {
    setGoods(goods.map((item) => (item.id === id ? { ...item, count: item.count + 1 } : item)));
  };
  const handleSub = (id: number) => {
    setGoods(goods.map((item) => (item.id === id ? { ...item, count: item.count - 1 } : item)));
  };
  const total = useMemo(() => {
    // 只有当goods改变才会进入到这个函数
    console.log('total');
    return goods.reduce((total, item) => total + item.price * item.count, 0);
  }, [goods]);
  return (
    <div>
      <h1>父组件</h1>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>商品名称</th>
            <th>商品价格</th>
            <th>商品数量</th>
          </tr>
        </thead>
        <tbody>
          {goods.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price * item.count}</td>
              <td>
                <button onClick={() => handleAdd(item.id)}>+</button>
                <span>{item.count}</span>
                <button onClick={() => handleSub(item.id)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>总价：{total}</h2>
    </div>
  );
}

export default App;
```

#### useMemo 执行时机(依赖项)

1.  如果依赖项是个空数组，那么 `useMemo` 的回调函数会执行一次
2.  指定依赖项，当依赖项发生变化时， `useMemo` 的回调函数会执行
3.  不指定依赖项，不推荐这么用，因为每次渲染和更新都会执行

#### useMemo 总结

1.  **使用场景**：
    - 当需要缓存复杂计算结果时
    - 当需要避免不必要的重新计算时
    - 当计算逻辑复杂且耗时时
2.  **优点**：
    - 通过记忆化避免不必要的重新计算
    - 提高应用性能
    - 减少资源消耗
3.  **注意事项**：
    - 不要过度使用，只在确实需要优化的组件上使用
    - 如果依赖项经常变化，useMemo 的效果会大打折扣
    - 如果计算逻辑简单，使用 useMemo 的开销可能比重新计算还大

## useCallback

useCallback 用于优化性能，返回一个记忆化的回调函数，可以减少不必要的重新渲染，也就是说它是用于缓存组件内的函数，避免函数的重复创建。

### 为什么需要 useCallback

在 React 中，函数组件的重新渲染会导致组件内的函数被重新创建，这可能会导致性能问题。useCallback 通过缓存函数，可以减少不必要的重新渲染，提高性能。

### 用法

```tsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 参数

**入参**

- callback：回调函数
- deps：依赖项数组，当依赖项发生变化时，回调函数会被重新创建，跟 useEffect 一样。

**返回值**

- 返回一个记忆化的**回调函数**，可以减少函数的创建次数，提高性能。

**和 useMemo 的区别**

- `useMemo` 用于 **缓存计算结果**，避免在每次渲染时重复计算。
- `useCallback` 用于 **缓存函数**，避免在组件重新渲染时创建新的函数实例（函数引用不变）。

### 案例 1

来看这个实例：

- 我们创建了一个 WeakMap(用 Map 也行)，用于存储回调函数，并记录回调函数的创建次数。
- 在组件重新渲染时，changeSearch 函数会被重新创建，我们这边会进行验证，如果函数被重新创建了数量会+1，如果没有重新创建，数量默认是 1。

```tsx
import { useCallback, useState } from 'react';
const functionMap = new WeakMap();
let counter = 1;
const App: React.FC = () => {
  console.log('Render App');
  const [search, setSearch] = useState('');
  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  if (!functionMap.has(changeSearch)) {
    functionMap.set(changeSearch, counter++);
  }
  console.log('函数Id', functionMap.get(changeSearch));
  return (
    <>
      <input type="text" value={search} onChange={changeSearch} />
    </>
  );
};
export default App;
```

我们更改输入框的值，可以看到函数 Id 在增加，说明函数被重新创建了。

![usecallback1.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/01c78f65df9b49a3b507177278cae2a6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQWlvbGltcA==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ3NDExMjQ3NjYzNjgyNCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1746066046&x-orig-sign=%2BSh0uL8LT729RhPNUXoMYX2Ugj4%3D)

为什么是 4 呢，因为默认是 1，然后输入框更改了 3 次，所以是 4，那么这样好吗？我们使用 useCallback 来优化一下。

> 只需要在 changeSearch 函数上使用 useCallback，就可以优化性能。

```tsx
const changeSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setSearch(e.target.value);
}, []);
```

![usecallback2.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/4c7a86807d444f549bdea3913c33d58b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQWlvbGltcA==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ3NDExMjQ3NjYzNjgyNCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1746066046&x-orig-sign=78wCe3e1KZaI%2FrgvXa4GLvaJCDM%3D)

### 案例 2

应用于子组件：

- 我们创建了一个 Child 子组件，并使用 React.memo 进行优化，memo 在上一章讲过了，他会检测 props 是否发生变化，如果发生变化，就会重新渲染子组件。
- 我们创建了一个 childCallback 函数，传递给子组件，然后我们输入框更改值，发现子组件居然重新渲染了，但是我们并没有更改 props，这是为什么呢？
- 这是因为输入框的值发生变化，App 就会重新渲染，然后 childCallback 函数就会被重新创建，然后传递给子组件，子组件会判断这个函数是否发生变化，但是每次创建的函数内存地址都不一样，所以子组件会重新渲染。

```tsx
import React, { useCallback, useState } from 'react';
const Child = React.memo(({ user, callback }: { user: { name: string; age: number }; callback: () => void }) => {
  console.log('Render Child');
  const styles = {
    color: 'red',
    fontSize: '20px',
  };
  return (
    <div style={styles}>
      <div>{user.name}</div>
      <div>{user.age}</div>
      <button onClick={callback}>callback</button>
    </div>
  );
});

const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [user, setUser] = useState({
    name: 'John',
    age: 20,
  });
  const childCallback = () => {
    console.log('callback 执行了');
  };
  return (
    <>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      <Child callback={childCallback} user={user} />
    </>
  );
};

export default App;
```

因为 App 重新渲染了，所以 childCallback 函数会被重新创建，然后传递给子组件，子组件会判断这个函数是否发生变化，但是每次创建的函数内存地址都不一样，所以子组件会重新渲染。

![useCallback-3.Bd3ynv-p.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/c2cd993bc31a467182572e3cb2bfc59f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQWlvbGltcA==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ3NDExMjQ3NjYzNjgyNCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1746066046&x-orig-sign=x3VDxkasvsNShZ4zfG%2BQUyQK2sM%3D)

> 只需要在 childCallback 函数上使用 useCallback，就可以优化性能。

```tsx
const childCallback = useCallback(() => {
  console.log('callback 执行了');
}, []);
```

### 总结

useCallback 的使用需要有所节制，不要盲目地对每个方法应用 useCallback，这样做可能会导致不必要的性能损失。useCallback 本身也需要一定的性能开销。

useCallback 并不是为了阻止函数的重新创建，而是通过依赖项来决定是否返回新的函数或旧的函数，从而在依赖项不变的情况下确保函数的地址不变。

# 工具 Hooks

## useDebugValue

`useDebugValue` 是一个专为开发者调试自定义 Hook 而设计的 React Hook。它允许你在 React 开发者工具中为自定义 Hook 添加自定义的调试值。

### 用法

```ts
const debugValue = useDebugValue(value);
```

### 参数说明

**入参**

- `value`: 要在 React DevTools 中显示的值

- ```ts
  formatter?
  ```

  : (可选) 格式化函数

  - 作用：自定义值的显示格式
  - 调用时机：仅在 React DevTools 打开时才会调用，可以进行复杂的格式化操作
  - 参数：接收 value 作为参数
  - 返回：返回格式化后的显示值

### 返回值

- 无返回值（void）

### 获取 React DevTools

**1.Chrome 商店安装**

1.  访问 [React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=zh-cn)
2.  点击"添加至 Chrome"即可安装

2.**在微信公众号(`小满zs`) 回复 `React/React工具` 获取安装包**

> 离线安装步骤
>
> 1.  打开 Chrome 浏览器，点击右上角三个点 → 更多工具 → 扩展程序
> 2.  开启右上角的"开发者模式"
> 3.  将下载的 .crx 文件直接拖拽到扩展程序页面
> 4.  在弹出的确认框中点击"添加扩展程序"

### 实战案例：自定义 useCookie Hook

下面通过实现一个 `useCookie` Hook 来展示 `useDebugValue` 的实际应用。这个 Hook 提供了完整的 cookie 操作功能，并通过 `useDebugValue` 来增强调试体验。

```tsx
import React, { useState, useDebugValue } from 'react';

/**
 * 自定义 Hook，用于管理浏览器的 cookie。
 * @param {string} name - cookie 的名称。
 * @param {string} [initialValue=''] - cookie 的初始值，默认为空字符串。
 * @returns {[string, (value: string, options?: any) => void, () => void]} - 返回一个数组，包含当前 cookie 的值、更新 cookie 的函数和删除 cookie 的函数。
 */
const useCookie = (name: string, initialValue: string = '') => {
  const getCookie = () => {
    // 使用正则表达式匹配 cookie 字符串中指定名称的值
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`));
    return match ? match[2] : initialValue;
  };
  const [cookie, setCookie] = useState(getCookie());

  /**
   * 更新指定名称的 cookie 值。
   * @param {string} value - 要设置的新的 cookie 值。
   * @param {any} [options] - 可选的 cookie 选项，如过期时间、路径等。
   */
  const updateCookie = (value: string, options?: any) => {
    // 设置新的 cookie 值
    document.cookie = `${name}=${value};${options}`;
    // 更新状态中的 cookie 值
    setCookie(value);
  };

  /**
   * 删除指定名称的 cookie。
   */
  const deleteCookie = () => {
    // 通过设置过期时间为过去的时间来删除 cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    // 将状态中的 cookie 值重置为初始值
    setCookie(initialValue);
  };

  /**
   * 使用 useDebugValue Hook 在 React DevTools 中显示调试信息。
   * 这里将 cookie 的值格式化为 "cookie: {value}" 的形式。
   */
  useDebugValue(cookie, (value) => {
    return `cookie: ${value}`;
  });
  return [cookie, updateCookie, deleteCookie] as const;
};

/**
 * 主应用组件，演示如何使用 useCookie Hook 管理 cookie。
 * @returns {JSX.Element} - 返回一个包含显示 cookie 值和操作按钮的 JSX 元素。
 */
const App: React.FC = () => {
  const [cookie, updateCookie, deleteCookie] = useCookie('key', 'value');

  return (
    <div>
      <div>{cookie}</div>
      <button
        onClick={() => {
          updateCookie('update-value');
        }}
      >
        设置cookie
      </button>
      <button
        onClick={() => {
          deleteCookie();
        }}
      >
        删除cookie
      </button>
    </div>
  );
};

export default App;
```

#### Hook 功能说明

1.  **getCookie**: 获取指定名称的 cookie 值
2.  **updateCookie**: 更新或创建新的 cookie
3.  **deleteCookie**: 删除指定的 cookie

#### useDebugValue 的应用

在这个例子中，我们使用 `useDebugValue` 来显示当前 cookie 的值：

```tsx
useDebugValue(cookie, (value) => `cookie: ${value}`);
```

#### 调试效果展示

在 React DevTools 中的显示效果：

![useDebugValue.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e18a28c762674e2fbb3c1e11292da038~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQWlvbGltcA==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzQ3NDExMjQ3NjYzNjgyNCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1746066046&x-orig-sign=O%2FA2MHYmG0f4JLYTfWSGY%2BCwqaI%3D)

### 使用建议

1.  仅在自定义 Hook 中使用 `useDebugValue`
2.  对于简单的值，可以省略 formatter 函数
3.  当格式化值的计算比较昂贵时，建议使用 formatter 函数，因为它只在开发者工具打开时才会执行

## useId

useId 是 React 18 新增的一个 Hook，用于生成稳定的唯一标识符，主要用于解决 SSR 场景下的 ID 不一致问题，或者需要为组件生成唯一 ID 的场景。

### 使用场景

- 为组件生成唯一 ID
- 解决 SSR 场景下的 ID 不一致问题
- 无障碍交互唯一 ID

### 用法

```ts
const id = useId();
// 返回值: :r0: 多次调用值递增
```

### 参数说明

**入参**

- 无入参

### 返回值

- 唯一标识符 例如`:r0:`

### 案例

#### 1.为组件生成唯一 ID

比如表单元素，label 需要和 input 绑定，如果使用 id 属性，需要手动生成唯一 ID，使用 useId 可以自动生成唯一 ID，这就非常方便。

```tsx
/**
 * App 组件，创建一个带标签的输入框，使用 useId 生成唯一的 ID 以关联标签和输入框。
 * @returns {JSX.Element} 返回一个包含标签和输入框的 JSX 元素。
 */
export const App = () => {
  // 使用 useId 钩子生成一个唯一的 ID，用于关联标签和输入框
  const id = useId();
  return (
    <>
      {/* 使用生成的唯一 ID 关联标签和输入框，提升可访问性 */}
      <label htmlFor={id}>Name</label>
      {/* 为输入框设置唯一的 ID，与标签关联 */}
      <input id={id} type="text" />
    </>
  );
};
```

#### 2. 解决 SSR 场景下的 ID 不一致问题

在服务端渲染（SSR）场景下，组件会在服务端和客户端分别渲染一次。如果使用随机生成的 ID，可能会导致两端渲染结果不一致，引发 hydration 错误。useId 可以确保生成确定性的 ID。

```tsx
// 一个常见的 SSR 场景：带有工具提示的导航栏组件
const NavItem = ({ text, tooltip }) => {
  // ❌ 错误做法：使用随机值或递增值
  const randomId = `tooltip-${Math.random()}`;
  // 在 SSR 时服务端可能生成 tooltip-0.123
  // 在客户端可能生成 tooltip-0.456
  // 导致 hydration 不匹配

  return (
    <li>
      <a aria-describedby={randomId} href="#">
        {text}
      </a>
      <div id={randomId} role="tooltip">
        {tooltip}
      </div>
    </li>
  );
};

// ✅ 正确做法：使用 useId
const NavItemWithId = ({ text, tooltip }) => {
  const id = useId();
  const tooltipId = `${id}-tooltip`;

  return (
    <li>
      <a href="#" aria-describedby={tooltipId} className="nav-link">
        {text}
      </a>
      <div id={tooltipId} role="tooltip" className="tooltip">
        {tooltip}
      </div>
    </li>
  );
};

// 使用示例
const Navigation = () => {
  return (
    <nav>
      <ul>
        <NavItemWithId text="首页" tooltip="返回首页" />
        <NavItemWithId text="设置" tooltip="系统设置" />
        <NavItemWithId text="个人中心" tooltip="查看个人信息" />
      </ul>
    </nav>
  );
};
```

#### 3. 无障碍交互唯一 ID

`aria-describedby` 是一个 **ARIA** 属性，用于为元素提供额外的描述性文本。它通过引用其他元素的 ID 来关联描述内容，帮助屏幕阅读器为用户提供更详细的信息。

当视障用户使用屏幕阅读器浏览网页时：

1.  读到输入框时会先读出输入框的标签
2.  然后会读出通过 `aria-describedby` 关联的描述文本
3.  用户就能知道这个输入框需要输入什么内容，有什么要求

```tsx
export const App = () => {
  const id = useId();
  return (
    <div>
      <input type="text" aria-describedby={id} />
      <p id={id}>请输入有效的电子邮件地址，例如：xiaoman@example.com</p>
    </div>
  );
};
```

### 总结

**基本介绍**

useId 是 React 18 引入的新 Hook，用于生成稳定且唯一的标识符

**使用特点**

- 无需传入参数
- 返回确定性的唯一字符串（如`:r0:`）
- 同一组件多次调用会生成递增的 ID
- 适合在需要稳定 ID 的场景下使用，而不是用于视觉或样式目的

**最佳实践**

- 当需要多个相关 ID 时，应该使用同一个 useId 调用，并添加后缀
- 不要用于列表渲染的 key 属性
- 优先用于可访问性和 SSR 场景

> \[!CAUTION]
>
> 本文内容参考[小满大佬](https://juejin.cn/post/7410313831271776256)
