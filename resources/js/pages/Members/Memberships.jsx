import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import AddMembershipForm from './AddMembershipForm';

export default function Memberships() {
  const [memberships, setMemberships] = useState([]);
  const [showForm, setShowForm] = useState(false);

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
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Joined On' },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Memberships</h1>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-4"
      >
        Add Membership
      </button>

      {showForm && (
        <AddMembershipForm
          onClose={() => {
            setShowForm(false);
            fetchMemberships(); // auto-refresh the table after adding
          }}
        />
      )}

      <DataTable data={memberships} columns={columns} itemsPerPage={10} />
    </div>
  );
}