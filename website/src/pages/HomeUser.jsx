import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import {
  Menu,
  X,
  Home,
  ClipboardList,
  History,
  User,
  LogOut
} from "lucide-react";

const HomeUser = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const userName = localStorage.getItem("username") || "email";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <header className="bg-gray-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
          >
            {showSidebar ? "❌ Sembunyikan Menu" : "📂 Menu Lengkap"}
          </button>
          {!showSidebar && (
            <>
              <Link to="/home/user/" className="hover:underline text-sm">🏠 Dashboard</Link>
              <Link to="/home/user/tests" className="hover:underline text-sm">📝 Tes</Link>
              <Link to="/home/user/history" className="hover:underline text-sm">📜 Riwayat</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = "/home/user/profile"}
            className="text-sm text-gray-300 hover:text-white transition"
          >
            👤 {userName}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-gray-800 p-6 space-y-4 overflow-y-auto">
            <nav className="space-y-2">
              <Link to="/home/user/" className="block hover:bg-gray-700 p-2 rounded">
                🏠 Dashboard
              </Link>
              <Link to="/home/user/take-test" className="block hover:bg-gray-700 p-2 rounded">
                📝 Ikuti Tes
              </Link>
              <Link to="/home/user/history" className="block hover:bg-gray-700 p-2 rounded">
                📜 Riwayat Tes
              </Link>
              <Link to="/home/user/profile" className="block hover:bg-gray-700 p-2 rounded">
                👤 Profil Saya
              </Link>
              <Link to="/home/user/notifications" className="block hover:bg-gray-700 p-2 rounded">
                🔔 Notifikasi
              </Link>
            </nav>
          </aside>
        )}

        <main className="flex-1 p-6 overflow-y-auto">
          {/* <h2 className="text-2xl font-bold mb-4">Selamat Datang, {userName} 👋</h2>
          <p className="text-gray-400 mb-6">
            Silakan gunakan menu di sebelah kiri untuk mengakses tes, melihat riwayat, dan mengelola profil Anda.
          </p> */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomeUser;
