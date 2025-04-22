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
