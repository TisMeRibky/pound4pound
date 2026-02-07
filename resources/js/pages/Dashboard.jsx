import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    fetch('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setUser(data.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.clear();
    navigate('/');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex">
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold">
          Welcome, {user.name}
        </h1>
      </main>
    </div>
  );
}