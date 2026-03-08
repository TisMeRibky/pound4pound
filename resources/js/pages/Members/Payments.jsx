import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import CreatePayment from './CreatePayment';
import white_circle from '@/assets/plus-circle-white.svg';
import black_circle from '@/assets/plus-circle-black.svg';

export default function Payments({ user }) {
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch payments safely
  const fetchPayments = () => {
    fetch('/api/payments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setPayments(data.data || []))
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
          className="bg-[#03023B] font-verdana text-white px-4 h-10 flex items-center justify-center rounded mt-5 gap-2 relative group hover:text-black hover:bg-[#FFDE59]"
          onClick={() => setShowForm(true)}
        >
          Add Payment
          <span className="w-5 h-5 relative inline-block">
            <img
              src={white_circle}
              alt="white circle"
              className="absolute top-0 left-0 w-5 h-5 opacity-100 group-hover:opacity-0"
            />
            <img
              src={black_circle}
              alt="black circle"
              className="absolute top-0 left-0 w-5 h-5 opacity-0 group-hover:opacity-100"
            />
          </span>
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