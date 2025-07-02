import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Parks from './pages/Parks'; // 后续你可以添加 Parks 页面
import USMap from './pages/USmap'; // 后续你可以添加 USmap 页面
import './css/App.css'; // 引入全局样式
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from './components/Footer';


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parks" element={<Parks />} />
        <Route path="/usmap" element={<USMap />} />
      </Routes>
      <Footer /> {/* ✅ 全局底部 */}
    </>
  );
}

export default App;
