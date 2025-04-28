import React from 'react';
import { NavLink } from 'react-router';
import { useSearchParams, useLocation } from 'react-router';
const About: React.FC = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('id'));
  console.log(searchParams.get('name'));
  const location = useLocation();
  console.log(location.pathname); //获取search参数 ?id=123
  return (
    <div>
      <p>about</p> <NavLink to={'/home'}>跳转到home</NavLink>
    </div>
  );
};
export default About;
