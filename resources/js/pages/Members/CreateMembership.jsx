import React, { useState, useEffect } from 'react';

export default function CreateMembership({ onClose }) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [message, setMessage] = useState('');
  const [membersWithoutMembership, setMembersWithoutMembership] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch members who are active and have no memberships yet
  useEffect(() => {
    fetch('/api/members/without-membership', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => setMembersWithoutMembership(data.data || []))
    .catch(err => console.error(err));
  }, []);

  // Auto-calculate end date (1 year from start)
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      setEndDate(end.toISOString().split('T')[0]);
    } else {
      setEndDate('');
    }
  }, [startDate]);

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
          start_date: startDate,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setMessage('Unexpected server response');
        return;
      }

      if (!res.ok) {
        setMessage(data?.message || 'Failed to add membership');
        return;
      }

      setMessage(data.message || 'Membership added successfully!');
      setTimeout(() => onClose(), 1500);

    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
      <div className="font-verdana p-6 max-w-md w-full bg-white rounded shadow-md relative">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-1">Add Membership</h2>
        <p className="text-sm text-gray-500 mb-4">
          Annual membership · <span className="font-semibold text-[#03023B]">₱1,000</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">

          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="px-3 py-2 border rounded"
            required
          >
            <option value="">Select a member</option>
            {membersWithoutMembership.map(m => (
              <option key={m.id} value={m.id}>
                {m.first_name} {m.last_name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded"
            required
          />

          {startDate && (
            <input
              type="date"
              value={endDate}
              readOnly
              className="px-3 py-2 border rounded bg-gray-100 text-gray-500"
            />
          )}

          <button
            type="submit"
            className="bg-[#03023B] text-white py-2 rounded hover:text-black hover:bg-[#FFDE59] transition"
          >
            Add Membership
          </button>
        </form>

        {message && (
          <p className={`mt-3 text-center font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}