import { createBrowserRouter } from 'react-router';
import Home from '../pages/Home';
// import About from '../pages/About';
import Layout from '../layout';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // 模拟异步请求
const router = createBrowserRouter([
  {
    // path: '/index', // 根路径
    Component: Layout, // 使用布局组件作为父级
    children: [
      // 嵌套路由配置
      {
        path: 'home', // 子路由不需要增加/了直接写子路由的path即可
        Component: Home,
      },
      {
        path: 'about',
        lazy: async () => {
          await sleep(2000); // 模拟异步请求
          const Component = await import('../pages/About'); // 异步导入组件
          console.log(Component);
          return {
            Component: Component.default,
          }; // 返回加载完成组件
        },
      },
    ],
  },
]);

export default router;
