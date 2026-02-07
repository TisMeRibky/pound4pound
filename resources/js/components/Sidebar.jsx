import SidebarMenu from './SidebarMenu';
import SidebarUser from './SidebarUser';

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="w-[220px] h-screen bg-gray-100 p-5 shadow-md flex flex-col justify-between">
      <SidebarMenu />
      <SidebarUser user={user} onLogout={onLogout} />
    </aside>
  );
}