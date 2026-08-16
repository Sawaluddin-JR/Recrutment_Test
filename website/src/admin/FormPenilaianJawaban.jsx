import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormPenilaianJawaban = () => {
  const navigate = useNavigate();

  // Contoh data kandidat
  const user = {
    id: 1,
    nama: "Achmad Farhan Fauzan",
    email: "achmadfauzan9132@gmail.com",
    posisi: "Backend Developer",
  };

  // Contoh data jawaban (nanti ambil dari API)
  const [jawabanList, setJawabanList] = useState([
    {
      id: 101,
      soal: "Jelaskan perbedaan antara PUT dan PATCH dalam REST API!",
      jawabanBenar:
        "✅ PUT mengganti seluruh resource dengan data baru, sedangkan PATCH hanya mengubah field tertentu.",
      jawaban:
        "Test 1",
      nilai: "",
      catatan: "",
    },
    {
      id: 102,
      soal: "Bagaimana cara mencegah SQL Injection pada aplikasi back-end?",
      jawabanBenar: "✅ Gunakan prepared statement atau parameterized query.",
      jawaban:
        "Test 2",
      nilai: "",
      catatan: "",
    },
    {
      id: 103,
      soal: "Jelaskan apa yang dimaksud dengan stateless dalam konteks REST API dan mengapa itu penting!",
      jawabanBenar:
        "✅ Stateless artinya setiap request harus membawa semua data yang dibutuhkan tanpa bergantung pada state server.",
      jawaban:
        "Stateless berarti server tidak menyimpan state/riwayat dari client antar request.",
      nilai: "",
      catatan: "",
    },
  ]);

  const handleChange = (id, field, value) => {
    setJawabanList((prev) =>
      prev.map((j) => (j.id === id ? { ...j, [field]: value } : j))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Mengirim penilaian:", jawabanList);

    try {
      // TODO: Panggil API untuk simpan penilaian di BE
      // await axios.put(`/api/testresult/{id}`, { ...payload });

      alert("✅ Penilaian berhasil disimpan!");
      navigate("/hasil-seleksi"); // pindah ke menu hasil seleksi
    } catch (err) {
      console.error("❌ Gagal simpan penilaian:", err);
      alert("Gagal menyimpan penilaian!");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
      {/* Header User Info */}
      <div className="bg-gray-700 p-4 rounded-xl">
        <h1 className="text-xl font-bold mb-2">📝 Penilaian Jawaban</h1>
        <p>
          <span className="font-semibold">Nama:</span> {user.nama}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Posisi:</span> {user.posisi}
        </p>
      </div>

      {/* Form Penilaian */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {jawabanList.map((j) => (
          <div
            key={j.id}
            className="bg-gray-700 p-4 rounded-xl shadow space-y-3"
          >
            <p className="font-semibold">🧾 {j.soal}</p>

            {/* Jawaban Benar */}
            <div className="bg-green-900 p-3 rounded">
              <p className="font-semibold text-green-300">Jawaban Benar</p>
              <p>{j.jawabanBenar}</p>
            </div>

            {/* Jawaban Kandidat */}
            <div className="bg-gray-600 p-3 rounded">
              <p className="font-semibold text-blue-300">Jawaban Kandidat</p>
              <p>{j.jawaban}</p>
            </div>

            <div>
              <label className="block mb-1">Nilai</label>
              <input
                type="number"
                min="0"
                max="100"
                value={j.nilai}
                onChange={(e) => handleChange(j.id, "nilai", e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                placeholder="Masukkan nilai (0-100)"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Catatan</label>
              <textarea
                value={j.catatan}
                onChange={(e) => handleChange(j.id, "catatan", e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                placeholder="Masukkan catatan penilaian..."
                rows="2"
              />
            </div>
          </div>
        ))}

        {/* <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          💾 Simpan Semua Penilaian
        </button> */}
      </form>
    </div>
  );
};

export default FormPenilaianJawaban;
