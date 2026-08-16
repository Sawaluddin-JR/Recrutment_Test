import React, { useEffect, useState } from "react";
import axios from "axios";

const UserNotification = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `http://localhost:8080/api/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("❌ Gagal mengambil notifikasi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  if (loading) return <p className="text-gray-400">⏳ Memuat notifikasi...</p>;

  if (notifications.length === 0)
    return <p className="text-gray-400">✨ Tidak ada notifikasi baru.</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">🔔 Notifikasi Saya</h2>
      <ul className="space-y-3">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`p-4 rounded shadow ${
              notif.type === "SUCCESS"
                ? "bg-green-800"
                : notif.type === "WARNING"
                ? "bg-yellow-800"
                : notif.type === "ERROR"
                ? "bg-red-800"
                : "bg-gray-800"
            }`}
          >
            <h3 className="font-semibold">{notif.title}</h3>
            <p className="text-sm">{notif.message}</p>
            <span className="text-xs text-gray-300">
              📅 {new Date(notif.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserNotification;
