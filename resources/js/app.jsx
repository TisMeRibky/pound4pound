import React, { useState, useEffect } from 'react';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';

function PrivateRoute({ user, loading, children }) {
  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

    fetch('/api/user', {
      headers: { 
        Authorization: `Bearer ${token}`, 
        Accept: 'application/json' 
      },
    })
      .then(res => res.json())
      .then(data => setUser(data.data.user))
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false); // ✅ important
      });
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // redirect happens via PrivateRoute
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
    <Route
      path="/dashboard"
      element={
        <PrivateRoute user={user} loading={loading}>
          <Dashboard user={user} onLogout={handleLogout} />
        </PrivateRoute>
      }
    />

    <Route
      path="/programs"
      element={
        <PrivateRoute user={user} loading={loading}>
          <Programs user={user} onLogout={handleLogout} />
        </PrivateRoute>
      }
    />
    </Routes>
  );
}

createRoot(document.getElementById('app')).render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);