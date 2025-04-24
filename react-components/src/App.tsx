import Card from './components/Card';
function App() {
  return (
    <>
      <Card title={'标题1'}></Card>
      <Card></Card>
      <Card></Card>
      <button onClick={() => window.onShow()}>确认</button>
    </>
  );
}
export default App;
