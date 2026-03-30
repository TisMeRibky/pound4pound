import React, { useState, useEffect } from "react";

export default function EditProgramModal({ program, token, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name,
        description: program.description,
      });
    }
  }, [program]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`/api/programs/${program.program_id}`, {
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

      setMessage("Program updated successfully!");
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;

    try {
      const res = await fetch(`/api/programs/${program.program_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Failed to delete program.");
        return;
      }

      alert("Program deleted successfully!");
      onClose();
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Program</h2>

        {message && (
          <p className="text-green-600 mb-4 text-center">{message}</p>
        )}

        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            rows="4"
          />

          <button className="bg-[#03023B] text-white px-4 py-2 rounded hover:text-black hover:bg-[#FFDE59]">
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
          >
            Delete Program
          </button>
        </form>
      </div>
    </div>
  );
}