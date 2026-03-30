import React, { useState, useEffect } from "react";

export default function CreateExpense({ token, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    description: "",
    exp_date: "",
    exp_type: "",
    exp_amount: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      setMessage("Expense created successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
        {message && <p className="mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Date</label>
            <input
              type="date"
              name="exp_date"
              value={formData.exp_date}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        <div>
        <label className="block mb-1">Type</label>
        <select
            name="exp_type"
            value={formData.exp_type}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
        >
            <option value="">Select type</option>
            <option value="Utilities">Utilities</option>
            <option value="Rent">Rent</option>
            <option value="Equipment">Equipment</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Supplies">Supplies</option>
            <option value="Other">Other</option>
        </select>
        </div>
          <div>
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              name="exp_amount"
              value={formData.exp_amount}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
    