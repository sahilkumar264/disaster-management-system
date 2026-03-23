import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Search Victims", path: "/admin/victims" },
    { name: "Add Victim", path: "/admin/add-victim" },
    { name: "Donations", path: "/admin/donations" },
    { name: "Database Tables", path: "/admin/database" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex w-72 flex-col justify-between bg-gray-900 text-white">
        <div>
          <h2 className="border-b border-gray-700 p-4 text-2xl font-bold">
            Relief Admin
          </h2>

          <nav className="space-y-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded p-3 transition ${
                  pathname === item.path ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={logout}
          className="m-4 rounded bg-red-500 p-3 hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
