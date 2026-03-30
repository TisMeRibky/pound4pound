import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import CreateExpense from './CreateExpense';
import ExpenseDetails from './ExpenseDetails';
import white_circle from '@/assets/plus-circle-white.svg';
import black_circle from '@/assets/plus-circle-black.svg';

export default function Expense({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch expenses from API
  const fetchExpenses = () => {
    fetch ('/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const expensesArray = Array.isArray(data.data)
            ? data.data
            : data.data?.expenses || [];

        setExpenses(expensesArray);
        })
      .catch(err => {
        console.error('Error fetching expenses:', err);
        setExpenses([]);
      });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  
  const columns = [
    { key: 'description', label: 'Description' },
    {
      key: 'exp_date',
      label: 'Date',
      render: (row) => row.exp_date
        ? new Date(row.exp_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
        : '—',
    },
    { key: 'exp_type', label: 'Type' },
    { key: 'exp_amount', label: 'Amount', type: 'currency' },
  ];

  return (
    <div className="flex">
      <main className="flex-1 p-5">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontFamily: 'var(--font-verdana)' }} className="text-2xl font-bold leading-none">Expenses</h1>
            
            <button
                onClick={() => setShowCreate(true)}
                className="bg-[#03023B] font-verdana text-white px-4 h-10 flex items-center justify-center rounded mt-5 gap-2 relative group hover:text-black hover:bg-[#FFDE59]"
            >
        Add Expense
    <span className="w-5 h-5 relative inline-block">
        <img
        src={white_circle}
        alt="Add"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300"
        />
        <img
        src={black_circle}
        alt="Add Hover"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
    </span>
</button>
        </div>

        {/* Create Expense Modal */}
        {showCreate && (
          <CreateExpense
            token={token}
            onSuccess={() => {
              setShowCreate(false);
              fetchExpenses();
            }}
            onClose={() => setShowCreate(false)}
          />
        )}

        {/* Edit/Delete Expense Modal */}
        {selectedExpense && (
          <ExpenseDetails
            expense={selectedExpense}
            token={token}
            onSuccess={() => {
              setSelectedExpense(null);
              fetchExpenses();
            }}
            onClose={() => setSelectedExpense(null)}
          />
        )}

        <DataTable
          data={expenses}
          columns={columns}
          onRowClick={(expense) => setSelectedExpense(expense)}
          itemsPerPage={10}
        />
      </main>
    </div>
  );    
}