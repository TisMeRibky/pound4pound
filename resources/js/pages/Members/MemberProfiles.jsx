import React, { useState, useEffect } from 'react';
import CreateMember from './CreateMember'; 
import DataTable from '../../components/DataTable';

export default function MemberProfiles({ user }) {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('/api/members', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setMembers(data.data));
  }, []);

  const columns = [
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  {
    key: 'status',
    label: 'Status',
    type: 'badge',
    badgeColors: { /* badge color classes based on status value */
      active: 'bg-emerald-100 text-emerald-700',
      inactive: 'bg-rose-100 text-rose-700',
    }
  },
];

  const fetchMembers = () => {
    fetch('/api/members', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setMembers(data.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="flex">
      <main className="flex-1 p-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Member Profiles</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add Member
          </button>
        </div>

        {/* Reusable table */}
        <DataTable data={members} columns={columns} itemsPerPage={10} />

        {/* Modal Pop-up for CreateMember */}
        {showForm && (
          <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={() => setShowForm(false)}
              >
                ✖
              </button>

              <CreateMember
                token={localStorage.getItem('token')}
                onSuccess={() => {
                  fetchMembers();
                  setShowForm(false);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}