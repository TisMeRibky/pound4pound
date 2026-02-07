import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Programs({ user, onLogout }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 p-10 bg-gray-50 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Programs</h1>
        <p>Here you can manage your programs.</p>
      </main>
    </div>
  );
}