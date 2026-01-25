import React, { useEffect } from 'react';
import AvatarCard from '../components/AvatarCard';
import BioSection from '../components/BioSection';
import { Link } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  useEffect(() => {
    const originalBg = document.body.style.background;

    const onMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const angle = Math.round(x * 360);
      document.body.style.background = `linear-gradient(${angle}deg, #0d1a26, #1f3b4d)`;
    };

    document.addEventListener('mousemove', onMove);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.body.style.background = originalBg;
    };
  }, []);

  return (
    <div className="layout-container fade-in">
      <div className="top-name">Tony Yang</div>
      <div className="about-me">
        <span className="static-link" title="Coming soon">About</span>
      </div>
      <BioSection />
      <AvatarCard />
    </div>
  );
}

export default Home;
