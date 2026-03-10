import React, { useState, useEffect } from 'react';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs/Programs';
import Plans from './pages/Plans/Plans';
import MemberProfiles from './pages/Members/MemberProfiles';
import MemberProfile from './pages/Members/MemberProfile';
import Memberships from './pages/Members/Memberships';
import TrainingSubs from './pages/Members/TrainingSubs';
import Payments from './pages/Members/Payments';
import PaymentDetails from './pages/Members/PaymentDetails';

function PrivateRoute({ user, loading, children }) {
  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ user, loading, children }) {
  if (loading) return <div>Loading...</div>;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
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
        setLoading(false); 
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

    setUser(null);
  };

  return (
  <Routes>
    <Route
      path="/"
      element={
        <PublicRoute user={user} loading={loading}>
          <Login user={user} setUser={setUser} />
        </PublicRoute>
      }
    />
    <Route
      element={
        <PrivateRoute user={user} loading={loading}>
          <Layout onLogout={handleLogout} />
        </PrivateRoute>
      }
    >
      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard user={user} />} />

      {/* Programs */}
      <Route path="/programs" element={<Programs user={user} />} />

      {/* Plans */}
      <Route path="/plans" element={<Plans user={user} />} />
      
      {/* Members */}
      <Route path="/memberprofiles" element={<MemberProfiles user={user} />} />
      <Route path="/memberships" element={<Memberships user={user} />} />
      <Route path="/trainingsubs" element={<TrainingSubs user={user} />} />
      <Route path="/payments" element={<Payments user={user} />} />
      <Route path="/payments/:id" element={<PaymentDetails />} />

      <Route path="/members/:id" element={<MemberProfile user={user} />} />
    </Route>
  </Routes>
  );
}



createRoot(document.getElementById('app')).render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);