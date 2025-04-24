import './index.css';
interface Props {
  title?: string;
  children?: React.ReactNode;
}

const defaultProps: Partial<Props> = {
  title: '默认标题',
};

export default function Card(props: Props) {
  const { title } = { ...defaultProps, ...props };
  return (
    <div className="card">
      <header>
        <div>{title}</div>
        <div>副标题</div>
      </header>
      <main>内容区域</main>
      <footer>
        <button>确认</button>
        <button>取消</button>
      </footer>
    </div>
  );
}
