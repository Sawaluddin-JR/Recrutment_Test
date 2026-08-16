import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const UserTestHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const candidateId = localStorage.getItem("id"); 
  // ⬆️ Pastikan kamu sudah set ini waktu login/register

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/testresult", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Filter hanya yang sesuai candidateId user login
      const filtered = res.data.filter(
        (h) => String(h.candidateId) === String(candidateId)
      );

      setHistory(filtered);
    } catch (err) {
      console.error("❌ Gagal ambil data history:", err);
      alert("Gagal memuat history tes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-gray-900 text-gray-100 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">📜 History Tes</h2>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-400">Belum ada data tes.</p>
      ) : (
        <table className="w-full table-auto border border-gray-700">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3 border-b border-gray-700">Candidate ID</th>
              <th className="p-3 border-b border-gray-700">Kode Soal</th>
              <th className="p-3 border-b border-gray-700">Mulai</th>
              <th className="p-3 border-b border-gray-700">Selesai</th>
              <th className="p-3 border-b border-gray-700">Jumlah Soal</th>
              <th className="p-3 border-b border-gray-700">Benar</th>
              <th className="p-3 border-b border-gray-700">Skor</th>
              <th className="p-3 border-b border-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-gray-800 transition-colors">
                <td className="p-3 border-b border-gray-700">{h.candidateId}</td>
                <td className="p-3 border-b border-gray-700">{h.questionCode}</td>
                <td className="p-3 border-b border-gray-700">
                  {h.startTime ? dayjs(h.startTime).format("DD MMM YYYY HH:mm") : "-"}
                </td>
                <td className="p-3 border-b border-gray-700">
                  {h.endTime ? dayjs(h.endTime).format("DD MMM YYYY HH:mm") : "-"}
                </td>
                <td className="p-3 border-b border-gray-700 text-center">
                  {h.totalQuestions ?? "-"}
                </td>
                <td className="p-3 border-b border-gray-700 text-center">
                  {h.correctAnswers ?? "-"}
                </td>
                <td className="p-3 border-b border-gray-700 text-center">
                  {h.score ?? "-"}
                </td>
                <td className="p-3 border-b border-gray-700 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      h.status === "SUBMITTED"
                        ? "bg-green-700 text-green-100"
                        : "bg-yellow-700 text-yellow-100"
                    }`}
                  >
                    {h.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTestHistory;
