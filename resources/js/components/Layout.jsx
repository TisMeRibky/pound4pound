import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ user, onLogout }) {
  return (
    <>
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 ml-[220px] min-h-screen p-6 bg-gray-50">
        <Outlet />
      </div>
    </>
  );
}