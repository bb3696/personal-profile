import React from 'react';
import AvatarCard from '../components/AvatarCard';
import BioSection from '../components/BioSection';
import '../css/Home.css'; // 引入 Home 页面样式

function Home() {

  return (
    <div className="layout-container fade-in">
      <div className="top-name">Tony Yang</div>
      <div className="about-me"><a className="static-link" href="#">About</a></div>
      <BioSection />
      <AvatarCard />
    </div>
  );
}

export default Home;
