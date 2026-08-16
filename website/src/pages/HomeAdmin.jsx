  import React, { useState } from "react";
  import { Link, Outlet } from "react-router-dom";

  const HomeAdmin = () => {
    const [showSidebar, setShowSidebar] = useState(true);

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      window.location.href = "/login";
    };

    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("role") || "Admin";
      
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
                <Link to="/home/admin/" className="hover:underline text-sm">📊 Dashboard</Link>
                <Link to="/home/admin/candidates" className="hover:underline text-sm">👥 Candidate</Link>
                <Link to="/home/admin/" className="hover:underline text-sm">🔔</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href = "/home/admin/company"}
              className="text-sm text-gray-300 hover:text-white transition"
            >
              🏬 Company
            </button>
            <button
              onClick={() => window.location.href = "/home/admin/profile"}
              className="text-sm text-gray-300 hover:text-white transition"
            >
              👤 {userName}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Body content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {showSidebar && (
            <aside className="w-64 bg-gray-800 p-6 space-y-4 overflow-y-auto">
              <nav className="space-y-2">
                <Link to="/home/admin/" className="block hover:bg-gray-700 p-2 rounded">
                  📊 Dashboard
                </Link>

                <div>
                  <p className="text-sm text-gray-400 mt-4">Kandidat</p>
                  <Link to="/home/admin/candidates" className="block hover:bg-gray-700 p-2 rounded">
                    📋 Daftar Kandidat
                  </Link>
                  {/* <Link to="/home/admin/candidates/add" className="block hover:bg-gray-700 p-2 rounded">
                    ➕ Tambah Kandidat
                  </Link> */}
                </div>

                <div>
                  <p className="text-sm text-gray-400 mt-4">Soal Tes</p>
                  <Link to="/home/admin/questions" className="block hover:bg-gray-700 p-2 rounded">
                    📚 Bank Soal
                  </Link>
                  <Link to="/home/admin/questions/add" className="block hover:bg-gray-700 p-2 rounded">
                    ➕ Tambah Soal
                  </Link>
                  <Link to="/home/admin/questionscode/add" className="block hover:bg-gray-700 p-2 rounded">
                    ➕ Tambah Kode Soal
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mt-4">Jadwal Tes</p>
                  <Link to="/home/admin/schedule" className="block hover:bg-gray-700 p-2 rounded">
                    🗓️ Jadwal Tes
                  </Link>
                  <Link to="/home/admin/schedule/add" className="block hover:bg-gray-700 p-2 rounded">
                    ➕ Tambah Jadwal
                  </Link>
                </div>

                <Link to="/home/admin/penilaianjawaban" className="block hover:bg-gray-700 p-2 rounded">
                  📝 Penilaian Jawaban
                </Link>
                <Link to="/home/admin/hasilseleksi" className="block hover:bg-gray-700 p-2 rounded">
                  🎯 Hasil Seleksi
                </Link>
                <Link to="/home/admin/manajementuser" className="block hover:bg-gray-700 p-2 rounded">
                  🛠️ Manajemen User
                </Link>
                <Link to="/home/admin/notification" className="block hover:bg-gray-700 p-2 rounded">
                  🔔 Notifikasi
                </Link>
              </nav>
            </aside>
          )}

          {/* Main content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Selamat Datang, Admin 👋</h2>
            <p className="text-gray-400 mb-6">
              Gunakan menu untuk mengelola sistem rekrutmen.
            </p>
            <Outlet />
          </main>
        </div>
      </div>
    );
  };

  export default HomeAdmin;
