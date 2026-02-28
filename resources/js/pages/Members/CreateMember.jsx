import React, { useState } from 'react';

export default function CreateMember({ token, onSuccess }) {
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
      if (data.errors?.email) {
        setMessage(data.errors.email[0]);
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
      return;
    }

      setMessage('Member created successfully!');

      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setStatus('');

        if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);
      setMessage('Server error. Check console.');
    }
  };
  

  return (
    <div className=" font-verdana">
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
        </select>

        <button
          type="submit"
          className="bg-[#03023B] text-white py-2 rounded hover:text-black hover:bg-[#FFDE59] transition"
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