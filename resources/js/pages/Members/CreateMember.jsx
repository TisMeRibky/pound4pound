import React, { useState } from 'react';

export default function CreateMember({ token }) {
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

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Error creating member');
        return;
      }

      setMessage('Member created successfully! ✅');
      // reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setStatus('Active');
    } catch (err) {
      console.error(err);
      setMessage('Server error. Check console.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create New Member</h2>

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
          <option value="Premium">Premium</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Create Member
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center text-green-600">{message}</p>
      )}
    </div>
  );
}