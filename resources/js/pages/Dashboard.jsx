import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AnnualStatCard from '../components/AnnualStatCard';
import MonthlyStatCard from '../components/MonthlyStatCard';

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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-50 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user.name}
        </h1>

        {/* Annual Statistics */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Annual Statistics</h2>
          <AnnualStatCard
            stats={{
              annualCustomers: 120,
              walkIns: 40,
              activeMembers: 75,
              annualRevenueTotal: 45000,
              annualRevenueData: [
                { name: 'Jan', value: 4000 },
                { name: 'Feb', value: 5000 },
                { name: 'Mar', value: 4500 },
                { name: 'Apr', value: 6000 },
                { name: 'May', value: 7000 },
                { name: 'Jun', value: 6500 },
              ],
            }}
          />
        </section>

        {/* Monthly Statistics */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Monthly Statistics</h2>
          <MonthlyStatCard
            stats={{
              annualCustomers: 40,
              walkIns: 20,
              activeMembers: 13,
              monthlyRevenueTotal: 1000,
              monthlyRevenueData: [
                { name: 'Jan', value: 4000 },
                { name: 'Feb', value: 5000 },
                { name: 'Mar', value: 4500 },
                { name: 'Apr', value: 6000 },
                { name: 'May', value: 7000 },
                { name: 'Jun', value: 6500 },
              ],
            }}
          />
        </section>
      </main>
    </div>
  );
}