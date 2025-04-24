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
