function App() {
  const str = 'aiolimp'
  const flag:boolean = true
  const classValue = 'test'
  const style = {
    color:'red'
  }
  const fn =<T,> (e:T)=>{
    console.log('点击事件',e)
  }
  const arr = [1,2,3]
  const htmlTemplate = '<div>我是html</div>'
  return (
    <>
      <div>{'字符串：'}<span>{'我是字符串'}</span></div>
      <div>{'数字：'}<span>{1231313}</span></div>
      <div>{'三元表达式：'}<span>{flag?'yes':'no'}</span></div>
      <div>{'绑定class：需要className'}<span className={classValue}>{1231313}</span></div>
      <div>{'绑定多个className'}<span className={`${classValue} className2` }>{1231313}</span></div>
      <div>{'绑定样式style'}<span style={style}>{1231313}</span></div>
      <div onClick={fn}>{'绑定事件onClick小驼峰'}</div>
      <div onClick={()=>{fn(str)}}>{'事件传参'}</div>
      <div> <span>{'遍历元素：'}</span>{arr.map(v=>v)} </div>
      <div> <span>{'遍历html代码片段：'}</span> <span dangerouslySetInnerHTML={{__html:htmlTemplate}}></span> </div>
    </>
  );
}
export default App;
