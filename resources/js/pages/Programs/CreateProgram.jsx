import React, { useState } from "react";

export default function CreateProgram({ token, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      setMessage("Program created successfully!");
      setName("");
      setDescription("");

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  return (
    <div className="font-verdan">
      <h2 className="text-xl font-bold mb-4">Create New Program</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Program Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 border rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-3 py-2 border rounded"
          rows="4"
        />

        <button
          type="submit"
          className="bg-[#03023B] text-white py-2 rounded hover:text-black hover:bg-[#FFDE59] transition"
        >
          Create Program
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center text-green-600">{message}</p>
      )}
    </div>
  );
}