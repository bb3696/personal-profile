import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/TopNav.css';

const NAV_ITEMS = [
  { label: 'About', paths: ['/'], to: '/' },
  { label: 'Projects', paths: ['/projects', '/parks', '/usmap'], to: '/projects' },
];

export default function TopNav() {
  const location = useLocation();

  return (
    <nav className="top-nav" aria-label="Primary navigation">
      <ul className="top-nav-list">
        {NAV_ITEMS.map((item) => {
          const isCurrent = item.paths.includes(location.pathname);

          return (
            <li key={item.to}>
              <Link
                className={[
                  'top-nav-link',
                  isCurrent ? 'top-nav-link--current' : '',
                ].filter(Boolean).join(' ')}
                to={item.to}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
