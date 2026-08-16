import React, { useEffect, useState } from "react";
import axios from "axios";

const FormHasilSeleksi = () => {
  const [kandidat, setKandidat] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1️⃣ Ambil data kandidat
      const [candidateRes, testResultRes] = await Promise.all([
        axios.get("http://localhost:8080/api/candidates", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/testresult", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const candidates = candidateRes.data;
      const testResults = testResultRes.data;

      // 2️⃣ Filter hanya status SUBMITTED
      const filteredResults = testResults.filter(
        (h) => h.status === "SUBMITTED"
      );

      // 3️⃣ Join dengan kandidat berdasarkan candidateId
      const mapped = filteredResults.map((h) => {
        const candidate = candidates.find((c) => c.id === h.candidateId);
        return {
          id: h.id,
          candidateId: h.candidateId,
          nama: candidate?.fullName || "Tidak Diketahui",
          email: candidate?.email || "-",
          status: "lolos", // default untuk submitted
        };
      });

      setKandidat(mapped);
    } catch (err) {
      console.error("❌ Gagal ambil data kandidat / hasil tes:", err);
      alert("Gagal memuat hasil seleksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = (id, value) => {
    setKandidat((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: value } : k))
    );
  };

  const handleSimpan = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/testresult/save-status",
        kandidat,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("✅ Hasil seleksi berhasil disimpan!");
    } catch (err) {
      console.error("❌ Gagal simpan:", err);
      alert("Gagal simpan hasil seleksi.");
    }
  };

  const kirimNotifikasi = async (user) => {
    try {
      await axios.post(
        "http://localhost:8080/api/notifications",
        {
          title: "Hasil Seleksi",
          message: `Status Anda: ${user.status.toUpperCase()}`,
          type: user.status === "lolos" ? "SUCCESS" : "INFO",
          targetEmail: user.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`📢 Notifikasi terkirim ke ${user.nama}`);
    } catch (err) {
      console.error("❌ Gagal kirim notifikasi:", err);
      alert("Gagal kirim notifikasi.");
    }
  };

  const kirimSemuaNotifikasi = async () => {
    for (const k of kandidat) {
      await kirimNotifikasi(k);
    }
    alert("📢 Semua notifikasi terkirim!");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold mb-4">🎯 Hasil Seleksi</h1>

      {loading ? (
        <p>Loading...</p>
      ) : kandidat.length === 0 ? (
        <p className="text-gray-300">Belum ada kandidat yang statusnya SUBMITTED.</p>
      ) : (
        <table className="w-full text-left border border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2">Nama</th>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kandidat.map((k) => (
              <tr key={k.id} className="border-t border-gray-700">
                <td className="p-2">{k.nama}</td>
                <td className="p-2">{k.email}</td>
                <td className="p-2">
                  <select
                    value={k.status}
                    onChange={(e) => handleChangeStatus(k.id, e.target.value)}
                    className="bg-gray-700 p-1 rounded"
                  >
                    <option value="lolos">✅ Lolos</option>
                    <option value="tidak">❌ Tidak Lolos</option>
                    <option value="cadangan">🕒 Cadangan</option>
                  </select>
                </td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => kirimNotifikasi(k)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    🔔 Kirim Notif
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {kandidat.length > 0 && (
        <div className="flex justify-between mt-4">
          {/* <button
            onClick={handleSimpan}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            💾 Simpan Hasil
          </button> */}

          <button
            onClick={kirimSemuaNotifikasi}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            📢 Kirim Semua
          </button>
        </div>
      )}
    </div>
  );
};

export default FormHasilSeleksi;
