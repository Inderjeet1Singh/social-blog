import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
     ${
       isActive
         ? "bg-blue-100 text-blue-700 font-medium"
         : "hover:bg-gray-100 text-gray-700"
     }`;
  const NavItems = () => {
    if (user?.role === "admin") {
      return (
        <NavLink
          to="/admin"
          className={linkClasses}
          onClick={() => setOpen(false)}
        >
          🛠 <span>Admin Dashboard</span>
        </NavLink>
      );
    }
    return (
      <>
        <NavLink
          to="/dashboard"
          className={linkClasses}
          onClick={() => setOpen(false)}
        >
          📊 <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/posts"
          className={linkClasses}
          onClick={() => setOpen(false)}
        >
          📝 <span>Posts</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={linkClasses}
          onClick={() => setOpen(false)}
        >
          👤 <span>Profile</span>
        </NavLink>
      </>
    );
  };
  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white border-b px-4 py-3">
        <h2 className="text-lg font-bold text-gray-800">Social Blog</h2>
        <button
          onClick={() => setOpen(true)}
          className="text-2xl text-gray-700"
        >
          ☰
        </button>
      </header>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        <div className="flex flex-col h-full p-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Social Blog</h2>
            <button
              onClick={() => setOpen(false)}
              className="md:hidden text-xl text-gray-600"
            >
              ✕
            </button>
          </div>
          <nav className="space-y-2 flex-1 overflow-y-auto">
            <NavItems />
          </nav>
          <div className="border-t pt-4">
            {user && (
              <>
                <div className="text-xs text-gray-500 mb-1">Logged in as</div>
                <div className="text-sm font-medium text-gray-800 mb-3 overflow-x-hidden">
                  {user.name}
                </div>
              </>
            )}

            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
      <div className="md:hidden h-14"></div>
      <div className="md:hidden h-14"></div>
    </>
  );
}
