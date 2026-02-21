import logout from '@/assets/Logout.svg';
import logo from '@/assets/Logo.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SidebarMenu({ onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menuItem =
  'font-bebas text-2xl my-2 pl-0 pr-3 py-2 rounded-r-lg cursor-pointer text-white hover:text-black hover:bg-[#FFDE59]';

  const subItem =
    'font-bebas text-xl my-2 ml-4 cursor-pointer text-sm text-white hover:text-black hover:bg-[#FFDE59] rounded px-2 py-1';

  return (
    <div className="flex flex-col h-screen">
      <img src={logo} alt="Pound for Pound Fitness" className="mb-6 h-20"/>

      <ul className="flex flex-col flex-1">
        <li className={menuItem} onClick={() => navigate('/dashboard')}>
          Dashboard
        </li>

        <li className={menuItem} onClick={() => navigate('/programs')}>
          Programs
        </li>

        <li className={menuItem} onClick={() => navigate('/plans')}>
          Plans
        </li>

        {/* Dropdown */}
        <li
          className={menuItem}
          onClick={() => setOpen(!open)}
        >
          Members {open ? '▼' : '▶'}
        </li>

        {open && (
          <ul>
            <li className={subItem} onClick={() => navigate('/memberprofiles')}>
              Member Profile
            </li>
            <li className={subItem} onClick={() => navigate('/memberships')}>
              Membership
            </li>
            <li className={subItem} onClick={() => navigate('/trainingsubs')}>
              Training Subs.
            </li>
            <li className={subItem} onClick={() => navigate('/payments')}>
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