import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';

export default function Layout({ onLogout }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar is only here */}
      <SidebarMenu onLogout={onLogout} />
      
      {/* Main content */}
    <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}