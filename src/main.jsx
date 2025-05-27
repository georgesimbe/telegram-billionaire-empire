// Import polyfills first
import './polyfills.js';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import TestApp from './TestApp.jsx';
import SimpleApp from './SimpleApp.jsx';
import TestDashboard from './TestDashboard.jsx';
import TestHomePage from './TestHomePage.jsx';
import './index.css';

// Initialize Telegram Web App
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);