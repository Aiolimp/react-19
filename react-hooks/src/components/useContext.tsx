import React, { useContext, useState } from "react";
// 定义上下文类型
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}
const ThemeContext = React.createContext<ThemeContextType>(
  {} as ThemeContextType
); //创建一个上下文对象，默认值为light

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
      </button>{" "}
      {/* 子组件调用父组件的方法 */}
    </div>
  );
};
const Parent = () => {
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
      <h2>我是父组件</h2>
      <Child></Child>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <div>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        修改主题色
      </button>
      <h2>我是爷组件</h2>
      {/* 使用 ThemeContext 时，传递的key必须为value */}
      {/* 如果使用多个Context，那么需要注意，如果使用的值是相同的，那么会覆盖。 */}
      <ThemeContext.Provider value={{ theme: "light", setTheme }}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <Parent></Parent>
        </ThemeContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
