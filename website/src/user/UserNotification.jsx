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
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            🔔 Notifikasi Saya
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Informasi terbaru terkait proses rekrutmen kamu.
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium">
          {notifications.length} Notifikasi
        </div>
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-10 text-center shadow-lg">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 flex items-center justify-center text-2xl mb-4">
            ✨
          </div>

          <h3 className="text-white font-semibold text-lg">
            Belum ada notifikasi
          </h3>

          <p className="text-gray-500 text-sm mt-2">
            Semua informasi terbaru akan muncul di halaman ini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {

            const notificationStyle =
              notif.type === "SUCCESS"
                ? {
                  container:
                    "bg-green-500/10 border-green-500/20 hover:border-green-500/40",
                  icon: "bg-green-500/20 text-green-400",
                  iconText: "✓",
                }
                : notif.type === "WARNING"
                  ? {
                    container:
                      "bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40",
                    icon: "bg-yellow-500/20 text-yellow-400",
                    iconText: "!",
                  }
                  : notif.type === "ERROR"
                    ? {
                      container:
                        "bg-red-500/10 border-red-500/20 hover:border-red-500/40",
                      icon: "bg-red-500/20 text-red-400",
                      iconText: "×",
                    }
                    : {
                      container:
                        "bg-gray-800 border-gray-700 hover:border-gray-600",
                      icon: "bg-gray-700 text-gray-300",
                      iconText: "🔔",
                    };

            return (
              <div
                key={notif.id}
                className={`
                group
                border
                rounded-2xl
                p-4 sm:p-5
                transition-all
                duration-200
                hover:shadow-lg
                ${notificationStyle.container}
              `}
              >
                <div className="flex items-start gap-4">

                  {/* Icon */}
                  <div
                    className={`
                    flex-shrink-0
                    w-11 h-11
                    rounded-xl
                    flex items-center justify-center
                    font-bold text-lg
                    ${notificationStyle.icon}
                  `}
                  >
                    {notificationStyle.iconText}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-semibold text-white">
                        {notif.title}
                      </h3>

                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(notif.createdAt).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Type Badge */}
                    <div className="mt-3">
                      <span
                        className={`
                        inline-flex items-center
                        px-2.5 py-1
                        rounded-full
                        text-[11px]
                        font-medium
                        ${notif.type === "SUCCESS"
                            ? "bg-green-500/10 text-green-400"
                            : notif.type === "WARNING"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : notif.type === "ERROR"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-gray-700 text-gray-400"
                          }
                      `}
                      >
                        {notif.type || "INFO"}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default UserNotification;
