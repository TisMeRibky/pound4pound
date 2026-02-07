export default function SidebarUser({ user, onLogout }) {
  return (
    <div className="border-t pt-4">
      <p className="font-semibold">{user.name}</p>
      <p className="text-sm text-gray-600">{user.email}</p>

      <button
        onClick={onLogout}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}