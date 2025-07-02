import React from 'react';
import { useEffect, useState } from 'react';
import AvatarCard from '../components/AvatarCard';
import BioSection from '../components/BioSection';
import { Link } from 'react-router-dom';
import '../css/Home.css'; // 引入 Home 页面样式

function Home() {

  return (
    <div className="layout-container fade-in">
      <div className="top-name">Tony Yang</div>
      <div className="about-me"><Link className="static-link" to="#">About</Link></div>
      <BioSection />
      <AvatarCard />
    </div>
  );
}

export default Home;
