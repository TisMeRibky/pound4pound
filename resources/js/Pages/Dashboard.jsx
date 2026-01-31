import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/'); // redirect to login if no token
      return;
    }

    fetch('/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(data => {
        setUser(data.data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/'); // redirect to login
      });
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setMessage('Logout failed.');
    }
    
  };

  const handleMenuClick = (menu) => {
    console.log("Clicked:", menu);
    // you can also update state or navigate
  };

  if (loading) return <p>Loading...</p>;

  

return (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    {/* Sidebar */}
    <div
      style={{
        width: '200px',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      }}
    >
      <h3>Menu</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '10px 0' }}>Dashboard</li>
        <li style={{ margin: '10px 0' }}>Profile</li>
        <li style={{ margin: '10px 0' }}>Settings</li>
      </ul>
    </div>

    {/* Main Content */}
    <div style={{ flex: 1, padding: '50px', textAlign: 'center' }}>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>

      {message && <p>{message}</p>}

      <button
        onClick={handleLogout}
        style={{ marginTop: '20px', padding: '10px 20px' }}
      >
        Logout
      </button>
    </div>
  </div>
);

}
