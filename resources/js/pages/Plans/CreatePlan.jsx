import React, { useState, useEffect } from "react";

export default function CreatePlan({ token, onSuccess, onClose }) {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    program_id: "",
    name: "",
    duration_days: "",
    price: "",
    is_promo: false,
    promo_start_date: "",
    promo_end_date: "",
    max_slots: "",
  });
  const [message, setMessage] = useState("");

  // Fetch programs for dropdown
  useEffect(() => {
    fetch("/api/programs", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setPrograms(data.data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Prepare payload
      const payload = {
        ...formData,
        is_active: true,
        promo_start_date: formData.is_promo ? formData.promo_start_date : null,
        promo_end_date: formData.is_promo ? formData.promo_end_date : null,
        max_slots: formData.is_promo ? Number(formData.max_slots) : null,
      };

      const res = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      setMessage("Plan created successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">Create New Plan</h2>
        {message && <p className="text-green-600 mb-3 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <select
            name="program_id"
            value={formData.program_id}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
            required
          >
            <option value="">Select Program</option>
            {programs.map((p) => (
              <option key={p.program_id} value={p.program_id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Plan Name"
            value={formData.name}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="duration_days"
            placeholder="Duration (days)"
            value={formData.duration_days}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_promo"
              checked={formData.is_promo}
              onChange={handleChange}
            />
            Is Promo (Limited Time)
          </label>

          {formData.is_promo && (
            <>
              <input
                type="date"
                name="promo_start_date"
                value={formData.promo_start_date}
                onChange={handleChange}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="date"
                name="promo_end_date"
                value={formData.promo_end_date}
                onChange={handleChange}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="number"
                name="max_slots"
                placeholder="Max Redeemable Slots"
                value={formData.max_slots}
                onChange={handleChange}
                className="px-3 py-2 border rounded"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="bg-[#03023B] text-white py-2 rounded hover:text-black hover:bg-[#FFDE59] transition"
          >
            Create Plan
          </button>
        </form>
      </div>
    </div>
  );
}