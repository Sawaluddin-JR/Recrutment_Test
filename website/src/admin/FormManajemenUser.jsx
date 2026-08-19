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
    <div className="bg-gray-900 min-h-screen text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen User</h1>
          <p className="text-sm text-gray-400 mt-1">
            Kelola akun kandidat yang terdaftar
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 px-5 py-3 rounded-xl">
          <p className="text-xs text-gray-400">Total Kandidat</p>
          <p className="text-xl font-bold text-blue-400">
            {candidates.length}
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center">
          <div className="text-3xl mb-3">⏳</div>
          <p className="text-gray-400">Memuat data kandidat...</p>
        </div>
      ) : candidates.length === 0 ? (
        /* Empty State */
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="font-semibold text-lg mb-1">
            Tidak ada kandidat
          </h3>
          <p className="text-gray-400 text-sm">
            Belum ada kandidat yang terdaftar dalam sistem.
          </p>
        </div>
      ) : (
        /* Table */
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-750 border-b border-gray-700">
                <tr className="text-gray-400">
                  <th className="px-6 py-4 text-left font-medium">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    Posisi
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {candidates.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-750 transition-colors duration-200"
                  >
                    {/* Nama */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-white">
                            {c.fullName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-300">
                      {c.email}
                    </td>

                    {/* Posisi */}
                    <td className="px-6 py-4 text-gray-300">
                      {c.position}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 font-medium ${c.status === "aktif"
                            ? "text-green-400"
                            : "text-gray-400"
                          }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${c.status === "aktif"
                              ? "bg-green-400"
                              : "bg-gray-500"
                            }`}
                        />

                        {c.status
                          ? c.status.charAt(0).toUpperCase() +
                          c.status.slice(1)
                          : "-"}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleResetPassword(c.email)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                                 bg-yellow-600/20 text-yellow-400
                                 border border-yellow-600/30
                                 hover:bg-yellow-600 hover:text-white
                                 transition-all duration-200"
                      >
                        🔑
                        <span>Reset Password</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormManajemenUser;
