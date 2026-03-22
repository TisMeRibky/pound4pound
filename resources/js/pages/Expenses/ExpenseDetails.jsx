import React, { useState, useEffect } from "react";

export default function ExpenseDetails({ expense, token, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    description: "",
    exp_date: "",
    exp_type: "",
    exp_amount: "",
  });

  const [message, setMessage] = useState("");

  // Populate form when expense changes
  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || "",
        exp_date: expense.exp_date
          ? expense.exp_date.split("T")[0]
          : "",
        exp_type: expense.exp_type || "",
        exp_amount: expense.exp_amount || "",
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Update failed");
        return;
      }

      setMessage("Expense updated successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  // ✅ DELETE
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Failed to delete expense.");
        return;
      }

      alert("Expense deleted successfully!");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">

        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Expense</h2>

        {message && (
          <p className={`mb-3 text-center ${
            message.includes("successfully")
              ? "text-green-600"
              : "text-red-500"
          }`}>
            {message}
          </p>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col space-y-3">

          {/* Description */}
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
            required
          />

          {/* Date */}
          <input
            type="date"
            name="exp_date"
            value={formData.exp_date}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
            required
          />

          {/* Type (Dropdown like you asked earlier) */}
          <select
            name="exp_type"
            value={formData.exp_type}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="Utilities">Utilities</option>
            <option value="Rent">Rent</option>
            <option value="Equipment">Equipment</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Salary">Salary</option>
            <option value="Others">Others</option>
          </select>

          {/* Amount */}
          <input
            type="number"
            name="exp_amount"
            placeholder="Amount"
            value={formData.exp_amount}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
            required
          />

          {/* Buttons */}
          <button
            type="submit"
            className="bg-[#03023B] text-white py-2 rounded hover:text-black hover:bg-[#FFDE59] transition"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Delete Expense
          </button>

        </form>
      </div>
    </div>
  );
}