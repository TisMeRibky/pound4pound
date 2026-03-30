import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateMember from './CreateMember';
import DataTable from '../../components/DataTable';
import white_circle from '@/assets/plus-circle-white.svg';
import black_circle from '@/assets/plus-circle-black.svg';

export default function MemberProfiles({ user }) {
  const [members,  setMembers]  = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchMembers = () => {
    fetch('/api/members', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.json())
      .then(data => setMembers(data.data || []))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchMembers(); }, []);

  const columns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name',  label: 'Last Name' },
    { key: 'facebook',   label: 'Facebook', sortable: false, searchable: false,
      render: row => {
        if (!row.facebook) return <span className="text-gray-300">—</span>;
        const url = row.facebook.startsWith('http') ? row.facebook : `https://${row.facebook}`;
        return (
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm truncate block max-w-[160px]"
            onClick={e => { e.stopPropagation(); e.preventDefault(); window.open(url, '_blank'); }}>
            {row.facebook}
          </a>
        );
      }
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', sortable: false },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      searchable: false,
      badgeColors: {
        active:   'bg-emerald-100 text-emerald-700',
        inactive: 'bg-rose-100 text-rose-700',
      },
    },
  ];

  return (
    <div className="flex">
      <main className="flex-1 p-5">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontFamily: 'var(--font-verdana)' }} className="text-2xl font-bold leading-none">
            Member Profiles
          </h1>

          <button
            onClick={() => setShowForm(true)}
            className="bg-[#03023B] font-verdana text-white px-4 h-10 flex items-center justify-center rounded mt-5 gap-2 relative group hover:text-black hover:bg-[#FFDE59]"
          >
            Add Member
            <span className="w-5 h-5 relative inline-block">
              <img src={white_circle} alt="" className="absolute top-0 left-0 w-5 h-5 opacity-100 group-hover:opacity-0" />
              <img src={black_circle} alt="" className="absolute top-0 left-0 w-5 h-5 opacity-0 group-hover:opacity-100" />
            </span>
          </button>
        </div>

        <DataTable
          data={members.map(m => ({
            ...m,
            status: m.status, // keep original for badge lookup (DataTable lowercases it)
          }))}
          columns={columns}
          itemsPerPage={10}
          onRowClick={row => navigate(`/members/${row.id}`)}
        />

        {showForm && (
          <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
              <CreateMember
                token={localStorage.getItem('token')}
                onClose={() => { fetchMembers(); setShowForm(false); }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}