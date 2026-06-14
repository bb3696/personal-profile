import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/App.css';
import './css/animation.css';
import Footer from './components/Footer';

const basename = import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '');
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Parks = lazy(() => import('./pages/Parks'));
const USMap = lazy(() => import('./pages/USMap'));

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Suspense
        fallback={(
          <main className="route-fallback" aria-live="polite">
            Loading experience...
          </main>
        )}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/parks" element={<Parks />} />
          <Route path="/usmap" element={<USMap />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
