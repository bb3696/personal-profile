import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Parks from './pages/Parks';
import USMap from './pages/USMap';
import './css/App.css';
import './css/animation.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from './components/Footer';

const basename = import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parks" element={<Parks />} />
        <Route path="/usmap" element={<USMap />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
