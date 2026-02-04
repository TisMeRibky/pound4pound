import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const handleMemberClick = (member) => {
    console.log("Clicked:", member);
    switch(member) {
        case 'Member Profile':
            navigate ('/memberprofiles');
            break;
        case 'Membership':
            navigate ('/membership');
            break;
        case 'Plans':
            navigate ('/plans');
            break;
        case 'Payment':
            navigate ('/payment');
            break;
    }
  }

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
        <li
        style={{
            margin: '10px 0',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px'
        }}
        onClick={() => navigate('/dashboard')}
        >
        Dashboard
        </li>
        <li
        style={{
            margin: '10px 0',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px'
        }}
        onClick={() => navigate('/programs')}
        >
        Programs
        </li>
        <li
        style={{
            margin: '10px 0',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px'
        }}
        onClick={() => navigate('/plans')}
        >
        Plans
        </li>
        <li
        style={{
            margin: '10px 0',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px'
        }}
        onClick={() => navigate('/payment')}
        >
        Payment
        </li>

        {/*Member Dropdown*/}
        <li
        style={{
            margin: '10px 0',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px'
        }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        >
        
        Members {dropdownOpen ? '▼' : '▶'}
        </li>

        {/* Member Dropdown items */}
          {dropdownOpen && (
            <ul style={{ listStyle: 'none', paddingLeft: '20px' }}>
              <li style={{ margin: '25px 0', cursor: 'pointer' }} onClick={() => handleMemberClick('Member Profile')}>
                Member Profile
              </li>
              <li style={{ margin: '25px 0', cursor: 'pointer' }} onClick={() => handleMemberClick('Membership')}>
                Membership
              </li>
                <li style={{ margin: '25px 0', cursor: 'pointer' }} onClick={() => handleMemberClick('Training Subs.,')}>
                Training Subs.,
              </li>
                <li style={{ margin: '25px 0', cursor: 'pointer' }} onClick={() => handleMemberClick('Payments')}>
                Payments
              </li>
            </ul>
          )}
      </ul>
    </div>

    {/* User Section */}
  <div style={{ marginTop: '30px', textAlign: 'left', padding: '10px', borderTop: '1px solid #ccc' }}>
    <p style={{ margin: 0, fontWeight: 'bold' }}>{user.name}</p>
    <p style={{ margin: '5px 0 10px 0', fontSize: '0.85rem', color: '#555' }}>{user.email}</p>
    <button
      onClick={handleLogout}
      style={{
        padding: '8px 12px',
        width: '100%',
        borderRadius: '4px',
        backgroundColor: '#f56565', // soft red
        color: 'white',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      Logout
    </button>
    
    </div>
  </div>
);

}
