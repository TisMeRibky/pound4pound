import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Plans({ user, onLogout }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex-1 p-10 bg-gray-50 overflow-auto">
        <h1 className="text-3xl font-bebas mb-6">Plans</h1>
        <p>Here you can manage your plan.</p>
      </main>
    </div>
  );
}