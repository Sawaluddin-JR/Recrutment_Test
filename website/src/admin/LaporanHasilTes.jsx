import React from "react";

const LaporanHasilTes = () => {
  const data = [
    { nama: "User A", nilai: 85, status: "Lolos" },
    { nama: "User B", nilai: 60, status: "Tidak Lolos" },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">📊 Laporan & Hasil Tes</h1>
      <table className="w-full text-left border border-gray-700">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2">Nama</th>
            <th className="p-2">Nilai</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => (
            <tr key={idx} className="border-t border-gray-700">
              <td className="p-2">{d.nama}</td>
              <td className="p-2">{d.nilai}</td>
              <td className="p-2">{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LaporanHasilTes;
