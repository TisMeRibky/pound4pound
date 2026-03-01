import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/payments/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setPayment(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="p-5">Loading...</div>;
  if (!payment) return <div className="p-5">Payment not found</div>;

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500 hover:underline">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-3">Payment Details</h1>

      <p><strong>Member:</strong> {payment.member_name}</p>
      <p><strong>Amount:</strong> ₱{payment.amount}</p>
      <p><strong>Date:</strong> {payment.payment_date}</p>
      <p><strong>Payment Method:</strong> {payment.payment_method || '-'}</p>

      {payment.proof && (
        <div className="mt-4">
          <strong>Proof of Payment:</strong>
          <div className="mt-2">
            {payment.proof.endsWith('.pdf') ? (
              <a href={`/payments/${payment.proof}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                View PDF
              </a>
            ) : (
              <img src={`/payments/${payment.proof}`} alt="Proof" className="max-w-full h-auto border rounded" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}