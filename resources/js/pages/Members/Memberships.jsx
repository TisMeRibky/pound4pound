import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import CreateMembership from './CreateMembership';
import white_circle from '@/assets/plus-circle-white.svg';
import black_circle from '@/assets/plus-circle-black.svg';

export default function Memberships() {
  const [memberships, setMemberships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchMemberships = () => {
    fetch('/api/memberships', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setMemberships(data.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const columns = [
    { key: 'member_name', label: 'Member Name' },
    { key: 'type', label: 'Membership Type' },
    { key: 'created_at', label: 'Joined On' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'status', label: 'Status', type: 'badge', badgeColors: { active: 'bg-green-100 text-green-700', expired: 'bg-red-100 text-red-700' } },
  ];

  return (
    <div className="flex">
      <main className="flex-1 p-5">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontFamily: 'var(--font-verdana)' }} className="text-2xl font-bold leading-none">Memberships</h1>

      <button
        onClick={() => setShowForm(true)}
        className="bg-[#03023B] font-verdana text-white px-4 h-10 flex items-center justify-center rounded mt-5 gap-2 relative group hover:text-black hover:bg-[#FFDE59]"
      >
        Add Membership
      <span className="w-5 h-5 relative inline-block">
          <img
            src={white_circle}
            alt="white circle"
            className="absolute top-0 left-0 w-5 h-5 opacity-100 group-hover:opacity-0"
          />
          <img
            src={black_circle}
            alt="black circle"
            className="absolute top-0 left-0 w-5 h-5 opacity-0 group-hover:opacity-100"
          />
        </span>
      </button>
    </div>

      {showForm && (
        <CreateMembership
          onClose={() => {
            setShowForm(false);
            fetchMemberships(); 
          }}
        />
      )}

      <DataTable 
      data={memberships.map(m => ({
        ...m,
        member_id: m.member_id,
        type: m.type === 'walk-in' ? 'Walk-in' : 'Annual'
      }))}
      columns={columns} 
      itemsPerPage={10}
      onRowClick={(row) => navigate(`/members/${row.member_id}`)} />
      </main>
    </div>
  );
}