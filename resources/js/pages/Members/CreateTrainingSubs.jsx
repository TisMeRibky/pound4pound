import React, { useState, useEffect } from 'react';

export default function CreateTrainingSubs({ onClose }) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  // Fetch active members
  useEffect(() => {
    fetch('/api/members/with-membership', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMembers(data.data || []))
      .catch(err => console.error(err));
  }, []);

  // Fetch active plans
  useEffect(() => {
    fetch('/api/plans', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPlans(data.data.filter(plan => plan.is_active) || []))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/training-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          member_id: selectedMemberId,
          plan_id: selectedPlanId,
          start_date: startDate
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.message || 'Failed to add subscription');
        return;
      }

      setMessage('Training subscription added successfully');

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

        <h2 className="text-xl font-bold mb-4">Add Training Subscription</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="px-3 py-2 border rounded"
            required
          >
            <option value="">Select Member</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.first_name} {member.last_name}
              </option>
            ))}
          </select>

          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="px-3 py-2 border rounded"
            required
          >
            <option value="">Select Plan</option>
            {plans.map(plan => {
              const isFull = plan.is_promo && 
                            plan.max_slots !== null && 
                            plan.training_subscriptions_count >= plan.max_slots;

              const slotsDisplay = plan.is_promo && plan.max_slots !== null
                ? ` (${plan.max_slots - (plan.training_subscriptions_count || 0)} slots left)`
                : '';

              return (
                <option key={plan.id} value={plan.id} disabled={isFull}>
                  {plan.name} - ₱{plan.price}{isFull ? ' (Full)' : slotsDisplay}
                </option>
              );
            })}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded"
            required
          />

          <button
            type="submit"
            className="bg-[#03023B] text-white py-2 rounded hover:text-black hover:bg-[#FFDE59] transition"
          >
            Assign Plan
          </button>
        </form>

        {message && (
          <p className={`mt-3 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}