import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  BookOpen,
  FileCheck2,
} from "lucide-react";

const AdminDashboard = () => {
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalActiveTests, setTotalActiveTests] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [candidateResponse, questionResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/candidates", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          axios.get("http://localhost:8080/api/questions", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const candidates = candidateResponse.data || [];
        const questions = questionResponse.data || [];

        setTotalCandidates(candidates.length);
        setTotalQuestions(questions.length);

        // Sementara karena endpoint tes aktif belum ada
        setTotalActiveTests(0);

      } catch (error) {
        console.error("❌ Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">👥 Total Kandidat</h3>
          <p className="text-3xl font-bold text-blue-400">{loading ? "..." : totalCandidates}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">📚 Total Soal</h3>
          <p className="text-3xl font-bold text-green-400">{loading ? "..." : totalQuestions}</p>
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
