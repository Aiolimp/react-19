import React from 'react';
import { NavLink, useParams, Link, useNavigate } from 'react-router';

const Home: React.FC = () => {
  const Card = () => {
    const { id } = useParams();
    console.log(id); //获取路由参数id:hell
  };
  Card();
  const navigate = useNavigate(); //编程式导航
  const handleClick = () => {
    navigate('/about?id=777&name=aixleft33'); // 点击按钮时，导航到对应的页面
  };
  return (
    <div>
      <p>Home</p>
      <NavLink to={'/about?id=6666&name=aixleft'}>NavLink跳转到about</NavLink>
      <Link to={'/about?id=8888&name=aixleft22222'}>NavLink跳转到about</Link>
      <button onClick={handleClick}>navigate跳转到about</button>
    </div>
  );
};
export default Home;
