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
