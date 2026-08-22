import React, { useState } from "react";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminNotification = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "INFO", // default
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8080/api/notifications",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("✅ Notifikasi berhasil dikirim!");
      setForm({ title: "", message: "", type: "INFO" });
    } catch (err) {
      console.error("❌ Gagal mengirim notifikasi:", err);
      alert("Gagal mengirim notifikasi.");
    }
  };

  // return (
  //   <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow">
  //     <h2 className="text-2xl font-bold mb-4">📢 Kirim Notifikasi</h2>
  //     <form onSubmit={handleSubmit} className="space-y-4">

  //       <div>
  //         <label className="block text-gray-300">Judul:</label>
  //         <input
  //           type="text"
  //           name="title"
  //           value={form.title}
  //           onChange={handleChange}
  //           className="w-full p-2 rounded bg-gray-800 border border-gray-600"
  //           required
  //           placeholder="Misal: Tes Dimulai"
  //         />
  //       </div>

  //       <div>
  //         <label className="block text-gray-300">Pesan:</label>
  //         <textarea
  //           name="message"
  //           value={form.message}
  //           onChange={handleChange}
  //           className="w-full p-2 rounded bg-gray-800 border border-gray-600"
  //           required
  //           placeholder="Isi pesan notifikasi..."
  //           rows={3}
  //         />
  //       </div>

  //       <div>
  //         <label className="block text-gray-300">Tipe Notifikasi:</label>
  //         <select
  //           name="type"
  //           value={form.type}
  //           onChange={handleChange}
  //           className="w-full p-2 rounded bg-gray-800 border border-gray-600"
  //         >
  //           <option value="INFO">Info</option>
  //           <option value="SUCCESS">Sukses</option>
  //           <option value="WARNING">Peringatan</option>
  //           <option value="ERROR">Error</option>
  //         </select>
  //       </div>

  //       <button
  //         type="submit"
  //         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
  //       >
  //         Kirim Notifikasi
  //       </button>
  //     </form>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
              📢
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Kirim Notifikasi
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                Kirim informasi atau pemberitahuan kepada kandidat
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-800">
              <h2 className="text-lg font-semibold">
                📝 Detail Notifikasi
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Isi informasi yang ingin dikirimkan.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6"
            >
              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Judul Notifikasi
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    🏷️
                  </span>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Misal: Tes Dimulai"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-600"
                  />
                </div>
              </div>

              {/* Pesan */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pesan
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Isi pesan notifikasi..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none resize-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-600"
                />

                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">
                    {form.message.length} karakter
                  </span>
                </div>
              </div>

              {/* Tipe */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Tipe Notifikasi
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* INFO */}
                  <label
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${form.type === "INFO"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="INFO"
                      checked={form.type === "INFO"}
                      onChange={handleChange}
                      className="hidden"
                    />

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        ℹ️
                      </div>

                      <div>
                        <p className="font-medium text-blue-400">
                          Info
                        </p>
                        <p className="text-xs text-gray-500">
                          Informasi umum
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* SUCCESS */}
                  <label
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${form.type === "SUCCESS"
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="SUCCESS"
                      checked={form.type === "SUCCESS"}
                      onChange={handleChange}
                      className="hidden"
                    />

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                        ✅
                      </div>

                      <div>
                        <p className="font-medium text-green-400">
                          Sukses
                        </p>
                        <p className="text-xs text-gray-500">
                          Proses berhasil
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* WARNING */}
                  <label
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${form.type === "WARNING"
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="WARNING"
                      checked={form.type === "WARNING"}
                      onChange={handleChange}
                      className="hidden"
                    />

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        ⚠️
                      </div>

                      <div>
                        <p className="font-medium text-yellow-400">
                          Peringatan
                        </p>
                        <p className="text-xs text-gray-500">
                          Perlu diperhatikan
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* ERROR */}
                  <label
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${form.type === "ERROR"
                        ? "border-red-500 bg-red-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="ERROR"
                      checked={form.type === "ERROR"}
                      onChange={handleChange}
                      className="hidden"
                    />

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                        ❌
                      </div>

                      <div>
                        <p className="font-medium text-red-400">
                          Error
                        </p>
                        <p className="text-xs text-gray-500">
                          Terjadi masalah
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                📤
                Kirim Notifikasi
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden h-fit">
            <div className="px-6 py-5 border-b border-gray-800">
              <h2 className="text-lg font-semibold">
                👀 Preview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Tampilan notifikasi kepada kandidat.
              </p>
            </div>

            <div className="p-6">
              {/* Notification Preview */}
              <div
                className={`rounded-2xl border p-5 transition-all ${form.type === "INFO"
                    ? "bg-blue-500/5 border-blue-500/30"
                    : form.type === "SUCCESS"
                      ? "bg-green-500/5 border-green-500/30"
                      : form.type === "WARNING"
                        ? "bg-yellow-500/5 border-yellow-500/30"
                        : "bg-red-500/5 border-red-500/30"
                  }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-xl ${form.type === "INFO"
                        ? "bg-blue-500/10"
                        : form.type === "SUCCESS"
                          ? "bg-green-500/10"
                          : form.type === "WARNING"
                            ? "bg-yellow-500/10"
                            : "bg-red-500/10"
                      }`}
                  >
                    {form.type === "INFO"
                      ? "ℹ️"
                      : form.type === "SUCCESS"
                        ? "✅"
                        : form.type === "WARNING"
                          ? "⚠️"
                          : "❌"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-white">
                        {form.title || "Judul Notifikasi"}
                      </h3>

                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        Sekarang
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                      {form.message ||
                        "Isi pesan notifikasi akan muncul di sini..."}
                    </p>

                    <div className="mt-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${form.type === "INFO"
                            ? "bg-blue-500/10 text-blue-400"
                            : form.type === "SUCCESS"
                              ? "bg-green-500/10 text-green-400"
                              : form.type === "WARNING"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-red-500/10 text-red-400"
                          }`}
                      >
                        {form.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="mt-5 p-4 rounded-xl bg-gray-800/60 border border-gray-700">
                <div className="flex gap-3">
                  <span className="text-lg">💡</span>

                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      Tips
                    </p>

                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Gunakan judul yang singkat dan pesan yang jelas
                      agar kandidat mudah memahami informasi yang
                      diberikan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;
