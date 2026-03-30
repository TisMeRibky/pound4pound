import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import CreatePayment from './CreatePayment';
import white_circle from '@/assets/plus-circle-white.svg';
import black_circle from '@/assets/plus-circle-black.svg';

const TYPE_LABELS = {
  annual_membership:     'Annual Membership',
  walk_in:               'Walk-in',
  training_subscription: 'Training Subscription',
};

export default function Payments() {
  const [payments,  setPayments]  = useState([]);
  const [showForm,  setShowForm]  = useState(false);
  const navigate = useNavigate();

  const fetchPayments = () => {
    fetch('/api/payments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(r => r.json())
      .then(d => setPayments(d.data || []))
      .catch(console.error);
  };

  useEffect(() => { fetchPayments(); }, []);

  const columns = [
    { key: 'member_name',    label: 'Member' },
    { key: 'payment_type', label: 'Type', searchable: false },
    {
      key: 'notes',
      label: 'Notes',
      searchable: false,
      render: row => row.notes && row.notes !== '—'
        ? <span title={row.notes} className="block max-w-[140px] truncate text-gray-500 text-sm">{row.notes}</span>
        : <span className="text-gray-300">—</span>,
    },
    {
      key: 'payment_method',
      label: 'Method',
      searchable: false,
      type: 'badge',
      badgeColors: {
        'gcash':         'bg-sky-100 text-sky-700',
        'bank transfer': 'bg-emerald-100 text-emerald-700',
        'cash':          'bg-yellow-100 text-yellow-700',
      },
    },
    { key: 'amount',       label: 'Amount', searchable: false },
    { key: 'payment_date', label: 'Date',   searchable: false },
  ];

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Payments</h1>

       {/* <button
          onClick={() => setShowForm(true)}
          className="bg-[#03023B] font-verdana text-white px-4 h-10 flex items-center justify-center rounded gap-2 relative group hover:text-black hover:bg-[#FFDE59]"
        >
          Add Payment
          <span className="w-5 h-5 relative inline-block">
            <img src={white_circle} alt="" className="absolute top-0 left-0 w-5 h-5 opacity-100 group-hover:opacity-0" />
            <img src={black_circle} alt="" className="absolute top-0 left-0 w-5 h-5 opacity-0 group-hover:opacity-100" />
          </span>
        </button> */}
      </div>

      {showForm && (
        <CreatePayment onClose={() => { setShowForm(false); fetchPayments(); }} />
      )}

      <DataTable
        data={payments.map(p => ({
          ...p,
          payment_type:   TYPE_LABELS[p.payment_type] || p.payment_type || '—',
          payment_method: p.payment_method || '—',
          notes:          p.notes || '—',
          amount:         `₱${Number(p.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
          payment_date:   p.payment_date ? new Date(p.payment_date).toLocaleDateString() : '—',
        }))}
        columns={columns}
        itemsPerPage={10}
        onRowClick={row => navigate(`/payments/${row.id}`)}
      />
    </div>
  );
}