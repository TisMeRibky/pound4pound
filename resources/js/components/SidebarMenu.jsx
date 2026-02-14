import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SidebarMenu({ onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menuItem =
    'my-2 px-3 py-2 rounded cursor-pointer hover:bg-gray-200';

  const subItem =
    'my-2 ml-4 cursor-pointer text-sm hover:text-blue-600';

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Menu</h3>

      <ul>
        <li className={menuItem} onClick={() => navigate('/dashboard')}>
          Dashboard
        </li>

        <li className={menuItem} onClick={() => navigate('/programs')}>
          Programs
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
      className="my-4 px-3 py-2 rounded cursor-pointer text-red-600 hover:bg-red-100"
      onClick={onLogout}
    >
      Logout
      </li>
      </ul>
    </div>
  );
}