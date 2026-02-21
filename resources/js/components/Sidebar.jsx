import SidebarMenu from './SidebarMenu';
import SidebarUser from './SidebarUser';

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="fixed inset-y-0 w-[220px] bg-[#03023B] p-5 … overflow-hidden">
      <SidebarMenu onLogout={onLogout} />
      <SidebarUser user={user} onLogout={onLogout} />
    </aside>
  );
}