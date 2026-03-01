import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import CreatePayment from './CreatePayment';

export default function Payments({ user, onLogout }) {
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchPayments = () => {
    fetch('/api/payments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setPayments(data.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

    const columns = [
    { key: 'member_name', label: 'Member Name' },
    { key: 'amount', label: 'Amount' },
    { key: 'payment_date', label: 'Date' },
    { key: 'proof', label: 'Proof' },
  ];

return (
    <div className="p-5">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Payments</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Add Payment
        </button>
      </div>

      {showForm && (
        <CreatePayment
          onClose={() => {
            setShowForm(false);
            fetchPayments(); // refresh after adding
          }}
        />
      )}

      <DataTable
        data={payments.map(p => ({
          ...p,
          member_name: p.member_name,
          payment_date: new Date(p.payment_date).toLocaleDateString(),
        }))}
        columns={columns}
        itemsPerPage={10}
        onRowClick={(row) => navigate(`/payments/${row.id}`)}
      />
    </div>
  );
}