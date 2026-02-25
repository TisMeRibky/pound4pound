import logout from '@/assets/Logout.svg';
import logo from '@/assets/Logo.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function SidebarMenu({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); // get current path
  const currentPath = location.pathname;

  const [open, setOpen] = useState(currentPath.startsWith('/member')); // open dropdown if on member page

  const menuItem =
    'font-bebas text-2xl my-2 px-3 py-2 rounded cursor-pointer text-white hover:text-black hover:bg-[#FFDE59]';
  const subItem =
    'font-bebas text-xl my-2 ml-4 cursor-pointer text-sm rounded px-2 py-1 flex items-center';

  // Helper function for active state
  const isActive = (path) => currentPath === path;
  const isDropdownActive = (paths) => paths.some((p) => currentPath === p);

  return (
    <div className="flex flex-col h-screen">
      <img src={logo} alt="Pound for Pound Fitness" className="mb-6 h-20" />

      <ul className="flex flex-col flex-1">
        {/* Main Menu Items */}
        <li
          className={`${menuItem} ${
            isActive('/dashboard') ? 'text-black bg-[#FFDE59]' : 'text-white hover:text-black hover:bg-[#FFDE59]'
          }`}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </li>

        <li
          className={`${menuItem} ${
            isActive('/programs') ? 'text-black bg-[#FFDE59]' : 'text-white hover:text-black hover:bg-[#FFDE59]'
          }`}
          onClick={() => navigate('/programs')}
        >
          Programs
        </li>

        <li
          className={`${menuItem} ${
            isActive('/plans') ? 'text-black bg-[#FFDE59]' : 'text-white hover:text-black hover:bg-[#FFDE59]'
          }`}
          onClick={() => navigate('/plans')}
        >
          Plans
        </li>

       <li
          className={`${menuItem} text-white hover:text-black hover:bg-[#FFDE59]`}
          onClick={() => setOpen(!open)}
        >
          Members {open ? '▼' : '▶'}
        </li>

        {open && (
          <ul>
            <li
              className={`${subItem} ${
                isActive('/memberprofiles')
                  ? 'text-black bg-[#FFDE59]'
                  : 'text-white hover:text-black hover:bg-[#FFDE59]'
              }`}
              onClick={() => navigate('/memberprofiles')}
            >
              Member Profile
            </li>
            <li
              className={`${subItem} ${
                isActive('/memberships')
                  ? 'text-black bg-[#FFDE59]'
                  : 'text-white hover:text-black hover:bg-[#FFDE59]'
              }`}
              onClick={() => navigate('/memberships')}
            >
              Membership
            </li>
            <li
              className={`${subItem} ${
                isActive('/trainingsubs')
                  ? 'text-black bg-[#FFDE59]'
                  : 'text-white hover:text-black hover:bg-[#FFDE59]'
              }`}
              onClick={() => navigate('/trainingsubs')}
            >
              Training Subs.
            </li>
            <li
              className={`${subItem} ${
                isActive('/payments')
                  ? 'text-black bg-[#FFDE59]'
                  : 'text-white hover:text-black hover:bg-[#FFDE59]'
              }`}
              onClick={() => navigate('/payments')}
            >
              Payments
            </li>
          </ul>
        )}

        {/* Logout */}
        <li
          className="mt-auto font-bebas text-2xl mb-8 px-3 py-2 rounded cursor-pointer text-red-600 hover:bg-red-100 flex items-center"
          onClick={onLogout}
        >
          Logout <img src={logout} alt="Logout Icon" className="ml-2 h-6 w-6" />
        </li>
      </ul>
    </div>
  );
}