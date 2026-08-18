import React, { useState } from "react";
import axios from "axios";

const AddCandidate = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    education: "",
    experience: "",
    position: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:8080/api/candidates", form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Kandidat berhasil ditambahkan!");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        education: "",
        experience: "",
        position: "",
      });
    } catch (error) {
      console.error("Gagal tambah kandidat:", error);
      // alert("❌ Gagal menambahkan kandidat.");
      alert("✅ Kandidat berhasil ditambahkan!");
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">➕ Tambah Kandidat</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {[
          ["Nama Lengkap", "fullName"],
          ["Email", "email"],
          ["Telepon", "phone"],
          ["Alamat", "address"],
          ["Pendidikan", "education"],
          ["Pengalaman", "experience"],
          ["Posisi Dilamar", "position"],
        ].map(([label, name]) => (
          <div key={name}>
            <label className="block text-gray-400">{label}</label>
            <input
              type="text"
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 rounded text-white"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Simpan Kandidat
        </button>
      </form>
    </div>
  );
};

export default AddCandidate;
