import React, { useState } from "react";

const HalamanKelolaSoal = () => {
  const [soal, setSoal] = useState([
    { id: 1, pertanyaan: "Apa ibukota Indonesia?", tipe: "Pilihan Ganda" },
  ]);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">📚 Kelola Soal</h1>
      <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mb-4">
        ➕ Tambah Soal
      </button>
      <table className="w-full text-left border border-gray-700">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2">Pertanyaan</th>
            <th className="p-2">Tipe</th>
            <th className="p-2 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {soal.map((s) => (
            <tr key={s.id} className="border-t border-gray-700">
              <td className="p-2">{s.pertanyaan}</td>
              <td className="p-2">{s.tipe}</td>
              <td className="p-2 text-right space-x-2">
                <button className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700">
                  Edit
                </button>
                <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HalamanKelolaSoal;
