import React, { useState, useEffect } from 'react';

export default function CreatePayment({ onClose }) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [proofFile, setProofFile] = useState(null);
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState([]);

  // Fetch active members
  useEffect(() => {
    fetch('/api/members', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => setMembers(data.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('member_id', selectedMemberId);
    formData.append('amount', amount);
    formData.append('payment_date', paymentDate);
    formData.append('proof', proofFile);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setMessage('Unexpected server response');
        return;
      }

      if (!res.ok) {
        setMessage(data?.message || 'Failed to add payment');
        return;
      }

      setMessage(data.message || 'Payment added successfully! ✅');
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

        <h2 className="text-xl font-bold mb-4">Add Payment</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">

          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="px-3 py-2 border rounded"
            required
          >
            <option value="">Select a member</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>
                {m.first_name} {m.last_name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="px-3 py-2 border rounded"
            required
          />

          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="px-3 py-2 border rounded"
            required
          />

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setProofFile(e.target.files[0])}
            className="px-3 py-2 border rounded"
          />

          <button
            type="submit"
            className="bg-[#03023B] text-white py-2 rounded hover:text-black hover:bg-[#FFDE59] transition"
          >
            Add Payment
          </button>
        </form>

        {message && (
          <p className="mt-3 text-center text-green-600">{message}</p>
        )}

      </div>
    </div>
  );
}