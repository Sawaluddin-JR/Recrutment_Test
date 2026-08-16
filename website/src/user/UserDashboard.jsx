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
    <div>
      <h1 className="text-xl font-bold mb-4">🏠 Dashboard</h1>
      <p className="text-gray-400 mb-6">
        Selamat datang, {email}. Berikut ringkasan akun Anda.
      </p>

      {/* Tes Aktif */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">📌 Tes yang Harus Diikuti</h2>
        <div className="bg-gray-800 p-4 rounded">
          <p className="text-gray-400">Belum ada tes yang dijadwalkan</p>
        </div>
      </section>

      {/* Progres Rekrutmen */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">📈 Progres Rekrutmen</h2>
        <ul className="list-disc pl-5 text-gray-400">
          <li>✅ Sudah Mendaftar</li>
          <li>{latestTest ? "✅ Sudah Ikut Tes" : "❌ Belum Ikut Tes"}</li>
          <li>⏳ Menunggu Penilaian</li>
          <li>🟡 Menunggu Hasil Seleksi</li>
        </ul>
      </section>

      {/* Riwayat Tes */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🎓 Hasil Tes Terakhir</h2>
        <div className="bg-gray-800 p-4 rounded">
          {loadingTest ? (
            <p className="text-gray-400">Memuat data...</p>
          ) : latestTest ? (
            <>
              <p>
                <strong>Nama Tes:</strong> {latestTest.questionCode}
              </p>
              <p>
                <strong>Skor:</strong> {latestTest.score ?? "-"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-400">{latestTest.status}</span>
              </p>
              <p className="text-gray-400 text-sm">
                Diselesaikan pada {dayjs(latestTest.endTime).format("DD MMM YYYY HH:mm")}
              </p>
            </>
          ) : (
            <p className="text-gray-400">Belum ada hasil tes.</p>
          )}
        </div>
      </section>

      {/* Notifikasi */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🔔 Notifikasi Terbaru</h2>
        <div className="bg-gray-800 p-4 rounded space-y-2">
          {loadingNotif ? (
            <p className="text-gray-400">Memuat notifikasi...</p>
          ) : notifications.length === 0 ? (
            <p className="text-gray-400">✨ Tidak ada notifikasi baru.</p>
          ) : (
            notifications.slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className={`p-2 rounded ${
                  notif.type === "SUCCESS"
                    ? "bg-green-800"
                    : notif.type === "WARNING"
                    ? "bg-yellow-800"
                    : notif.type === "ERROR"
                    ? "bg-red-800"
                    : "bg-gray-700"
                }`}
              >
                <strong>{notif.title}</strong>
                <p className="text-sm">{notif.message}</p>
                <span className="text-xs text-gray-300">
                  📅 {dayjs(notif.createdAt).format("DD MMM YYYY HH:mm")}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
