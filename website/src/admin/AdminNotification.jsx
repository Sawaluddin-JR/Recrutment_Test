import React, { useState } from "react";
import axios from "axios";
import { Link, Outlet,useNavigate  } from "react-router-dom";

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

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">📢 Kirim Notifikasi</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-gray-300">Judul:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            required
            placeholder="Misal: Tes Dimulai"
          />
        </div>

        <div>
          <label className="block text-gray-300">Pesan:</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            required
            placeholder="Isi pesan notifikasi..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-gray-300">Tipe Notifikasi:</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          >
            <option value="INFO">Info</option>
            <option value="SUCCESS">Sukses</option>
            <option value="WARNING">Peringatan</option>
            <option value="ERROR">Error</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          Kirim Notifikasi
        </button>
      </form>
    </div>
  );
};

export default AdminNotification;
