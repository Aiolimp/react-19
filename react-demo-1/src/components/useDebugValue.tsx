
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
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`)) 
    return match ? match[2] : initialValue
  }
  const [cookie, setCookie] = useState(getCookie())

  /**
   * 更新指定名称的 cookie 值。
   * @param {string} value - 要设置的新的 cookie 值。
   * @param {any} [options] - 可选的 cookie 选项，如过期时间、路径等。
   */
  const updateCookie = (value: string, options?: any) => {
    // 设置新的 cookie 值
    document.cookie = `${name}=${value};${options}`
    // 更新状态中的 cookie 值
    setCookie(value)
  }

  /**
   * 删除指定名称的 cookie。
   */
  const deleteCookie = () => {
    // 通过设置过期时间为过去的时间来删除 cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
    // 将状态中的 cookie 值重置为初始值
    setCookie(initialValue)
  }

  /**
   * 使用 useDebugValue Hook 在 React DevTools 中显示调试信息。
   * 这里将 cookie 的值格式化为 "cookie: {value}" 的形式。
   */
  useDebugValue(cookie, (value) => {
    return `cookie: ${value}`
  })
  return [cookie, updateCookie, deleteCookie] as const
}

/**
 * 主应用组件，演示如何使用 useCookie Hook 管理 cookie。
 * @returns {JSX.Element} - 返回一个包含显示 cookie 值和操作按钮的 JSX 元素。
 */
const App: React.FC = () => {
  const [cookie, updateCookie, deleteCookie] = useCookie('key', 'value')

  return (
    <div>
      <div>{cookie}</div>
      <button onClick={() => { updateCookie('update-value') }}>设置cookie</button>
      <button onClick={() => { deleteCookie() }}>删除cookie</button>
    </div>
  );
}

export default App;