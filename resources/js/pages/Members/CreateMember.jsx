import React, { useState } from 'react';

export default function CreateMember({ token, onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Active');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          status,
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
        setMessage(data?.message || 'Failed to create member');
        return;
      }

      setMessage(data.message || 'Member created successfully!');

      setTimeout(() => onClose(), 1500);

    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };
  

  return (
  <div className="font-verdana">

      
    <h2 className="text-xl font-bold mb-4">Create New Member</h2>
    
    {/* Close Button */}
    <button
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
      onClick={onClose}
    >
      ✖
    </button>

    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="px-3 py-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="px-3 py-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-3 py-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="px-3 py-2 border rounded"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 border rounded"
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <button
        type="submit"
        className="bg-[#03023B] text-white py-2 rounded hover:text-black hover:bg-[#FFDE59] transition"
      >
        Create Member
      </button>
    </form>

    {/* Message */}
    {message && (
      <p className="mt-3 text-center text-green-600 font-semibold">{message}</p>
    )}
  </div>
  );
}