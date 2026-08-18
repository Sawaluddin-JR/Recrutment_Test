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
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [candidateResponse, questionResponse, scheduleResponse] = await Promise.all([
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

          axios.get("http://localhost:8080/api/schedules", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const candidates = candidateResponse.data || [];
        const questions = questionResponse.data || [];
        const schedules = scheduleResponse.data || [];

        setTotalCandidates(candidates.length);
        setTotalQuestions(questions.length);
        setSchedules(schedules);

        const activeSchedules = schedules.filter(
          (schedule) => schedule.active === true
        );

        // Sementara karena endpoint tes aktif belum ada
        // setTotalActiveTests(0);
        setTotalActiveTests(activeSchedules.length);

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

      {/* <div className="mt-10">
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
      </div> */}

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">
          📅 Jadwal Tes Terdekat
        </h3>

        {schedules.length === 0 ? (
          <div className="bg-gray-800 p-4 rounded-lg text-gray-400">
            Belum ada jadwal tes.
          </div>
        ) : (
          <ul className="space-y-3">
            {schedules
              .filter((schedule) => {
                // Hanya ambil jadwal yang belum lewat
                return new Date(schedule.startTime) >= new Date();
              })
              .sort(
                (a, b) =>
                  new Date(a.startTime) - new Date(b.startTime)
              )
              .slice(0, 5)
              .map((schedule) => (
                <li
                  key={schedule.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-sm"
                >
                  <p className="text-gray-300">
                    🗓️{" "}
                    {new Date(schedule.startTime).toLocaleString(
                      "id-ID",
                      {
                        dateStyle: "full",
                        timeStyle: "short",
                      }
                    )}
                  </p>

                  <p className="text-white font-medium mt-1">
                    {schedule.title || schedule.codeTest}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
