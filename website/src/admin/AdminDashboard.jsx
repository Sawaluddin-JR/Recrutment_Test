import React from "react";

const AdminDashboard = () => {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">📊 Dashboard Admin</h2>
      <p className="text-gray-400 mb-6">
        Selamat datang kembali di sistem rekrutmen. Berikut ringkasan hari ini:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">👥 Total Kandidat</h3>
          <p className="text-3xl font-bold text-blue-400">128</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">📚 Total Soal</h3>
          <p className="text-3xl font-bold text-green-400">245</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">📝 Tes Aktif</h3>
          <p className="text-3xl font-bold text-yellow-400">4</p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">📅 Jadwal Tes Terdekat</h3>
        <ul className="space-y-3">
          <li className="bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-gray-300">🗓️ 21 Juni 2025</p>
            <p className="text-white font-medium">Tes Frontend Developer - Batch 1</p>
          </li>
          <li className="bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-gray-300">🗓️ 23 Juni 2025</p>
            <p className="text-white font-medium">Tes Backend Developer - Batch 2</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
