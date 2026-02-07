import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SidebarMenu() {
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
            <li className={subItem} onClick={() => navigate('/membership')}>
              Membership
            </li>
            <li className={subItem}>
              Training Subs.
            </li>
            <li className={subItem}>
              Payments
            </li>
          </ul>
        )}
      </ul>
    </div>
  );
}