import React, { useState, useEffect } from 'react';

const WALK_IN_RATE_NO_MEMBERSHIP = 200;
const WALK_IN_RATE_WITH_MEMBERSHIP = 150;

export default function CreateWalkIn({ onClose }) {
  const [membersWithMembership, setMembersWithMembership] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const rate = isMember ? WALK_IN_RATE_WITH_MEMBERSHIP : WALK_IN_RATE_NO_MEMBERSHIP;

  useEffect(() => {
    fetch('/api/members/with-membership', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMembersWithMembership(data.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const body = {
      date,
      notes,
      has_membership: isMember,
      amount: rate,
      ...(isMember
        ? { member_id: selectedMemberId }
        : { guest_name: guestName }),
    };

    try {
      const res = await fetch('/api/walk-ins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.message || 'Failed to log walk-in');
        return;
      }

      setMessage('Walk-in logged successfully!');
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
      <div className="font-verdana p-6 max-w-md w-full bg-white rounded shadow-md relative">

        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-1">Log Walk-In</h2>

        {/* Rate preview */}
        <p className="text-sm text-gray-500 mb-4">
          Fee:{' '}
          <span className="font-bold text-[#03023B] text-base">₱{rate}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">

          {/* Member toggle */}
          <div className="flex rounded overflow-hidden border border-gray-300">
            <button
              type="button"
              onClick={() => { setIsMember(false); setSelectedMemberId(''); }}
              className={`flex-1 py-2 text-sm font-medium transition ${
                !isMember
                  ? 'bg-[#03023B] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Non-Member · ₱{WALK_IN_RATE_NO_MEMBERSHIP}
            </button>
            <button
              type="button"
              onClick={() => { setIsMember(true); setGuestName(''); }}
              className={`flex-1 py-2 text-sm font-medium transition ${
                isMember
                  ? 'bg-[#03023B] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Member · ₱{WALK_IN_RATE_WITH_MEMBERSHIP}
            </button>
          </div>

          {/* Name input */}
          {isMember ? (
            <select
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
              className="px-3 py-2 border rounded"
              required
            >
              <option value="">Select Member</option>
              {membersWithMembership.map(m => (
                <option key={m.id} value={m.id}>
                  {m.first_name} {m.last_name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Guest Name"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              className="px-3 py-2 border rounded"
              required
            />
          )}

          {/* Date */}
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="px-3 py-2 border rounded"
            required
          />

          {/* Notes */}
          <input
            type="text"
            placeholder="Notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="px-3 py-2 border rounded"
          />

          <button
            type="submit"
            className="bg-[#03023B] text-white py-2 rounded hover:text-black hover:bg-[#FFDE59] transition"
          >
            Log Walk-In
          </button>
        </form>

        {message && (
          <p
            className={`mt-3 text-center font-medium ${
              message.includes('successfully') ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
