import React, { useState, useEffect } from 'react';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setUser(data.data.user))
      .catch(() => localStorage.removeItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
      <Route path="/programs" element={<Programs user={user} onLogout={handleLogout} />} />
    </Routes>
  );
}

createRoot(document.getElementById('app')).render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);