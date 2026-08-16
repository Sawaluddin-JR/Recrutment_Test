import React, { useEffect, useState } from "react";
import axios from "axios";

const FormManajemenUser = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/candidates", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCandidates(res.data))
      .catch((err) => console.error("❌ Gagal fetch kandidat:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleResetPassword = async (email) => {
    if (!window.confirm(`Reset password kandidat ${email}?`)) return;

    try {
      await axios.put(
        `http://localhost:8080/api/users/${email}/reset-password`,
        {}, // body kosong
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Password kandidat ${email} berhasil direset menjadi 123123`);
    } catch (err) {
      console.error("❌ Gagal reset password:", err);
      alert("Gagal reset password kandidat");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">🛠️ Manajemen User (Kandidat)</h1>

      {loading ? (
        <p className="text-gray-400">⏳ Memuat data kandidat...</p>
      ) : candidates.length === 0 ? (
        <p className="text-gray-400">✨ Tidak ada kandidat.</p>
      ) : (
        <table className="w-full text-left border border-gray-700 text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2">Nama</th>
              <th className="p-2">Email</th>
              <th className="p-2">Posisi</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="border-t border-gray-700 hover:bg-gray-600">
                <td className="p-2">{c.fullName}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.position}</td>
                <td className="p-2">{c.status}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleResetPassword(c.email)}
                    className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FormManajemenUser;
