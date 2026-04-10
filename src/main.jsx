import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// Restore auth session from sessionStorage (survives page refresh)
try {
  const stored = sessionStorage.getItem('peach_auth');
  if (stored) {
    const auth = JSON.parse(stored);
    // Check JWT expiry before restoring
    let expired = true;
    try {
      const parts = auth.token.split('.');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      expired = !payload.exp || (Date.now() / 1000) >= (payload.exp - 30);
    } catch {}
    if (!expired) {
      window.__PEACH_AUTH__ = auth;
    } else {
      sessionStorage.removeItem('peach_auth');
      try { localStorage.setItem('peach_logged_in', 'false'); } catch {}
    }
  }
} catch {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
