import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const redirect = sessionStorage.getItem('redirect');
if (redirect) {
  sessionStorage.removeItem('redirect');

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const route = redirect.startsWith('/') ? redirect : `/${redirect}`;
  window.history.replaceState(null, '', `${basePath}${route}`);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
