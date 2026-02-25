import React, { useState, useEffect } from 'react';

export default function AddMembershipForm({ onClose }) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [type, setType] = useState('Annual');
  const [message, setMessage] = useState('');
  const [membersWithoutMembership, setMembersWithoutMembership] = useState([]);

  // Fetch members who are active and have no memberships yet
  useEffect(() => {
    fetch('/api/members/no-membership', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => setMembersWithoutMembership(data.data || []))
    .catch(err => console.error(err));
  }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
        const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            member_id: selectedMemberId,
            type,
        }),
        });

        let data;
        try {
        data = await res.json(); // attempt to parse JSON
        } catch {
        setMessage('Unexpected server response');
        return;
        }

        if (!res.ok) {
        setMessage(data?.message || 'Failed to add membership');
        return;
        }

        setMessage(data.message || 'Membership added successfully! ✅');

        setTimeout(() => onClose(), 1500);

    } catch (err) {
        console.error(err);
        setMessage('Server error');
    }
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">Add Membership</h2>

        <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
          >
            <option value="">Select a member</option>
            {membersWithoutMembership.map(m => (
  <option key={m.id} value={m.id}>
    {m.first_name} {m.last_name}
  </option>
))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="Annual">Annual</option>
            <option value="Walk-in">Walk-in</option>
          </select>

          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Membership
          </button>
        </form>

        {message && <p className="text-green-600 mt-3">{message}</p>}
      </div>
    </div>
  );
}