import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const UserDashboard = () => {
  const email = localStorage.getItem("email") || "user@example.com";
  const token = localStorage.getItem("token");
  const candidateId = localStorage.getItem("id");

  const [latestTest, setLatestTest] = useState(null);
  const [loadingTest, setLoadingTest] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(true);

  useEffect(() => {
    fetchLatestTest();
    fetchNotifications();
  }, []);

  // 🔹 Ambil tes terakhir (status SUBMITTED)
  const fetchLatestTest = async () => {
    setLoadingTest(true);
    try {
      const res = await axios.get("http://localhost:8080/api/testresult", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = res.data
        .filter(
          (t) => String(t.candidateId) === String(candidateId) && t.status === "SUBMITTED"
        )
        .sort((a, b) => new Date(b.endTime) - new Date(a.endTime));

      setLatestTest(filtered.length > 0 ? filtered[0] : null);
    } catch (err) {
      console.error("❌ Gagal ambil data tes:", err);
    } finally {
      setLoadingTest(false);
    }
  };

  // 🔹 Ambil notifikasi user
  const fetchNotifications = async () => {
    setLoadingNotif(true);
    try {
      const res = await axios.get("http://localhost:8080/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Gagal mengambil notifikasi:", err);
    } finally {
      setLoadingNotif(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Dashboard Kandidat 👋
        </h1>
        <p className="text-gray-400 mt-1">
          Pantau jadwal tes dan progres rekrutmen kamu di sini.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Tes */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tes Dijadwalkan</p>
              <h3 className="text-3xl font-bold text-white mt-2">
                {latestTest ? "1" : "0"}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
              📝
            </div>
          </div>

          <p className="text-blue-100 text-xs mt-4">
            Jadwal tes kamu
          </p>
        </div>

        {/* Status */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Status Tes</p>
              <h3 className="text-xl font-bold text-white mt-3">
                {latestTest ? "Sudah Ikut" : "Belum Ikut"}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
              {latestTest ? "✓" : "⏳"}
            </div>
          </div>

          <p className="text-emerald-100 text-xs mt-4">
            Status pengerjaan tes
          </p>
        </div>

        {/* Hasil */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Skor Terakhir</p>
              <h3 className="text-3xl font-bold text-white mt-2">
                {latestTest?.score * 10 ?? "-"}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
              🎯
            </div>
          </div>

          <p className="text-purple-100 text-xs mt-4">
            Hasil tes terakhir
          </p>
        </div>
      </div>

      {/* Tes yang harus diikuti */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">
            📌 Tes yang Harus Diikuti
          </h2>
        </div>

        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-5 shadow-lg">

          {latestTest ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">
                  📝
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Tes {latestTest.questionCode}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Tes telah dijadwalkan untuk kamu
                  </p>
                </div>
              </div>

              <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                ✓ Tersedia
              </span>

            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center text-xl">
                📭
              </div>

              <div>
                <p className="text-white font-medium">
                  Belum ada tes
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Saat ini belum ada tes yang dijadwalkan untuk kamu.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Progress Recruitment */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">
          📈 Progres Rekrutmen
        </h2>

        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6 shadow-lg">

          <div className="relative">

            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-1 bg-gray-700 rounded-full" />

            <div className="relative grid grid-cols-3 gap-4">

              {/* Step 1 */}
              <div className="text-center">
                <div
                  className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center border-4 border-gray-800 ${latestTest
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-400"
                    }`}
                >
                  ✓
                </div>

                <p className="text-sm font-medium text-white mt-3">
                  Tes
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {latestTest ? "Selesai" : "Belum"}
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div
                  className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center border-4 border-gray-800 ${latestTest
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-700 text-gray-400"
                    }`}
                >
                  ⏳
                </div>

                <p className="text-sm font-medium text-white mt-3">
                  Penilaian
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Menunggu
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center border-4 border-gray-800">
                  🏆
                </div>

                <p className="text-sm font-medium text-white mt-3">
                  Hasil Seleksi
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Menunggu
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Hasil Tes & Notifikasi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Hasil Tes */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            🎓 Hasil Tes Terakhir
          </h2>

          <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-5 shadow-lg h-full">

            {loadingTest ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-400">
                  Memuat data...
                </p>
              </div>
            ) : latestTest ? (

              <div className="space-y-5">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      ID Tes
                    </p>

                    <p className="text-white font-semibold mt-1">
                      {latestTest.questionCode}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    {latestTest.status}
                  </span>
                </div>

                <div className="border-t border-gray-700 pt-5">

                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Skor
                  </p>

                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-4xl font-bold text-white">
                      {latestTest.score * 10 ?? "-"}
                    </span>

                    {latestTest.score !== null &&
                      latestTest.score !== undefined && (
                        <span className="text-gray-500 mb-1">
                          / 100
                        </span>
                      )}
                  </div>

                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>📅</span>

                  <span>
                    Diselesaikan pada{" "}
                    {dayjs(latestTest.endTime).format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </span>
                </div>

              </div>

            ) : (

              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl mb-4">
                  📄
                </div>

                <p className="text-white font-medium">
                  Belum ada hasil tes
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Hasil tes kamu akan muncul di sini.
                </p>
              </div>

            )}

          </div>
        </section>

        {/* Notifikasi */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            🔔 Notifikasi Terbaru
          </h2>

          <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-4 shadow-lg">

            {loadingNotif ? (

              <div className="flex items-center justify-center py-8">
                <p className="text-gray-400">
                  Memuat notifikasi...
                </p>
              </div>

            ) : notifications.length === 0 ? (

              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-xl mb-3">
                  ✨
                </div>

                <p className="text-gray-300">
                  Tidak ada notifikasi baru.
                </p>
              </div>

            ) : (

              <div className="space-y-3">

                {notifications.slice(0, 3).map((notif) => (

                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition ${notif.type === "SUCCESS"
                        ? "bg-green-500/10 border-green-500/20"
                        : notif.type === "WARNING"
                          ? "bg-yellow-500/10 border-yellow-500/20"
                          : notif.type === "ERROR"
                            ? "bg-red-500/10 border-red-500/20"
                            : "bg-gray-700/50 border-gray-600"
                      }`}
                  >

                    <div className="flex items-start gap-3">

                      <div className="text-lg">
                        {notif.type === "SUCCESS"
                          ? "✅"
                          : notif.type === "WARNING"
                            ? "⚠️"
                            : notif.type === "ERROR"
                              ? "❌"
                              : "🔔"}
                      </div>

                      <div className="flex-1">

                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-white text-sm">
                            {notif.title}
                          </strong>
                        </div>

                        <p className="text-sm text-gray-400 mt-1">
                          {notif.message}
                        </p>

                        <span className="text-xs text-gray-500 block mt-2">
                          {dayjs(notif.createdAt).format(
                            "DD MMM YYYY HH:mm"
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>
        </section>

      </div>
    </div>
  );
};

export default UserDashboard;
