import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import CreateWalkIn from './CreateWalkIn';
import white_circle from '@/assets/plus-circle-white.svg';
import black_circle from '@/assets/plus-circle-black.svg';

const WALK_IN_RATE_NO_MEMBERSHIP = 200;
const WALK_IN_RATE_WITH_MEMBERSHIP = 150;

export default function WalkIns() {
  const [walkIns, setWalkIns] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchWalkIns = () => {
    fetch('/api/walk-ins', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.json())
      .then(data => setWalkIns(data.data || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchWalkIns();
  }, []);

  const columns = [
    { key: 'member_name', label: 'Name' },
    { key: 'date', label: 'Date' },
    {
      key: 'has_membership',
      label: 'Membership',
      searchable: false,
      render: row => (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            row.has_membership
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.has_membership ? 'Member' : 'Non-Member'}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Fee',
      searchable: false,
      render: row => `₱${Number(row.amount).toFixed(2)}`,
    },
    { key: 'notes', label: 'Notes', sortable: false },
  ];

  return (
    <div className="flex">
      <main className="flex-1 p-5">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1
              style={{ fontFamily: 'var(--font-verdana)' }}
              className="text-2xl font-bold leading-none"
            >
              Walk-Ins
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Non-member: <span className="font-semibold text-gray-700">₱{WALK_IN_RATE_NO_MEMBERSHIP}</span>
              &nbsp;·&nbsp;
              Member: <span className="font-semibold text-gray-700">₱{WALK_IN_RATE_WITH_MEMBERSHIP}</span>
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-[#03023B] font-verdana text-white px-4 h-10 flex items-center justify-center rounded mt-5 gap-2 relative group hover:text-black hover:bg-[#FFDE59]"
          >
            Log Walk-In
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

        {/* Create Modal */}
        {showForm && (
          <CreateWalkIn
            onClose={() => {
              setShowForm(false);
              fetchWalkIns();
            }}
          />
        )}

        {/* Table */}
        <DataTable
          data={walkIns.map(w => ({
            ...w,
            date: w.date ? new Date(w.date).toLocaleDateString() : '-',
          }))}
          columns={columns}
          itemsPerPage={10}
        />
      </main>
    </div>
  );
}