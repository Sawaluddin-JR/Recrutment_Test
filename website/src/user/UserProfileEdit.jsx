import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserProfileEdit() {
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    education: "",
    experience: "",
    position: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  // Ambil data kandidat berdasarkan email
  useEffect(() => {
    if (!email) return;
    axios
      .get(`http://localhost:8080/api/candidates/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [email, token]);

  // Handler perubahan form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler submit update
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:8080/api/candidates/profile/${formData.email}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setMessage("Profil berhasil diperbarui");
        navigate("/home/user/profile"); // <-- arahkan kembali ke halaman profile
      })
      .catch((err) => {
        console.error(err);
        setMessage("Gagal memperbarui profil");
      }, [email, token]);
  };

  if (loading) return <p>Memuat data...</p>;

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Profil</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block font-medium">Nama Lengkap</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ""}
            onChange={handleChange}
            className="border rounded w-full p-2 text-black"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="border rounded w-full p-2"
            disabled
          />
        </div>
        <div>
          <label className="block font-medium">No. Telepon</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="border rounded w-full p-2 text-black"
          />
        </div>
        <div>
          <label className="block font-medium">Alamat</label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="border rounded w-full p-2 text-black"
          />
        </div>
        <div>
          <label className="block font-medium">Pendidikan</label>
          <input
            type="text"
            name="education"
            value={formData.education || ""}
            onChange={handleChange}
            className="border rounded w-full p-2 text-black"
          />
        </div>
        <div>
          <label className="block font-medium">Pengalaman</label>
          <input
            type="text"
            name="experience"
            value={formData.experience || ""}
            onChange={handleChange}
            className="border rounded w-full p-2 text-black"
          />
        </div>
        <div>
          <label className="block font-medium">Posisi</label>
          <input
            type="text"
            name="position"
            value={formData.position || ""}
            onChange={handleChange}
            className="border rounded w-full p-2 text-black"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
