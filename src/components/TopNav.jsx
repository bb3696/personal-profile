import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/TopNav.css';

export default function TopNav() {
  const { pathname } = useLocation();
  const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
  const isAbout = pathname === '/' || pathname === base || pathname === `${base}/`;
  const isParks = pathname === '/parks' || pathname.endsWith('/parks');
  const isStates = pathname === '/usmap' || pathname.endsWith('/usmap');

  return (
    <nav className="top-nav">
      {isAbout ? (
        <span className="top-nav-link top-nav-link--current">About</span>
      ) : (
        <Link to="/" className="top-nav-link">About</Link>
      )}
      <span className="top-nav-sep">·</span>
      {isParks ? (
        <span className="top-nav-link top-nav-link--current">Parks</span>
      ) : (
        <Link to="/parks" className="top-nav-link">Parks</Link>
      )}
      <span className="top-nav-sep">·</span>
      {isStates ? (
        <span className="top-nav-link top-nav-link--current">States</span>
      ) : (
        <Link to="/usmap" className="top-nav-link">States</Link>
      )}
    </nav>
  );
}
