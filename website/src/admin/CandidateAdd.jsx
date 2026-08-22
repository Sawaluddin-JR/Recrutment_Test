import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
      console.log("TOKEN:", token);
      console.log("FORM:", form);

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

      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Gagal menambahkan kandidat.";

      alert(`❌ ${message} Email belum terdaftar di Users.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Tambah Kandidat
              </h2>
              <p className="text-gray-400 text-sm">
                Masukkan informasi kandidat untuk proses rekrutmen.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {[
              ["Nama Lengkap", "fullName", "Contoh : John Doe"],
              ["Email", "email", "Contoh : kandidat@gmail.com"],
              ["Telepon", "phone", "Contoh : 081234567890"],
              ["Alamat", "address", "Contoh : Bandung, Jawa Barat"],
              ["Pendidikan", "education", "Contoh : S1 Teknik Informatika"],
              ["Pengalaman", "experience", "Contoh : 2 Tahun"],
              ["Posisi Dilamar", "position", "Contoh : Java Backend Developer"],
            ].map(([label, name, placeholder]) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {label}
                  <span className="text-red-400 ml-1">*</span>
                </label>

                <input
                  id={name}
                  type={name === "email" ? "email" : "text"}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="
                  w-full
                  px-4 py-3
                  bg-gray-800
                  border border-gray-700
                  rounded-xl
                  text-white
                  placeholder-gray-500
                  outline-none
                  transition-all
                  duration-200
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  hover:border-gray-600
                "
                />
              </div>
            ))}

            {/* Action */}
            <div className="pt-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Link
                to="/home/admin/"
                className="
                  px-5 py-3
                  rounded-xl
                  bg-gray-800
                  hover:bg-gray-700
                  border border-gray-700
                  text-gray-300
                  transition
                  text-center
                "
              >
                Kembali
              </Link>

              <button
                type="submit"
                className="
                px-6 py-3
                rounded-xl
                bg-blue-600
                hover:bg-blue-500
                active:bg-blue-700
                text-white
                font-semibold
                shadow-lg
                shadow-blue-600/20
                transition-all
                duration-200
                hover:-translate-y-0.5
              "
              >
                <span className="mr-2">➕</span>
                Tambah Kandidat
              </button>
            </div>

          </form>
        </div>

        {/* Footer Hint */}
        <p className="text-center text-gray-600 text-xs mt-5">
          Pastikan informasi kandidat sudah benar sebelum disimpan.
        </p>
      </div>
    </div>
  );
};

export default AddCandidate;
