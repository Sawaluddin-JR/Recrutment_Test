import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet,useNavigate  } from "react-router-dom";

const AdminProfile = () => {
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    axios.get(`http://localhost:8080/api/candidates/email/${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setCandidate(res.data))
    .catch((err) => console.error(err));
  }, []);


  if (!candidate) return <p>Loading atau data admin tidak ditemukan...</p>;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
        👤 Profil Kandidat
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-gray-400">Nama Lengkap:</label>
          <p className="font-semibold">{candidate.fullName || "Belum diisi"}</p>
        </div>

        <div>
          <label className="text-gray-400">Email:</label>
          <p className="font-semibold">{candidate.email}</p>
        </div>

        <div>
          <label className="text-gray-400">Telepon:</label>
          <p className="font-semibold">{candidate.phone || "Belum diisi"}</p>
        </div>

        <div>
          <label className="text-gray-400">Alamat:</label>
          <p className="font-semibold">{candidate.address || "Belum diisi"}</p>
        </div>

        <div>
          <label className="text-gray-400">Pendidikan:</label>
          <p className="font-semibold">{candidate.education || "Belum diisi"}</p>
        </div>

        <div>
          <label className="text-gray-400">Pengalaman:</label>
          <p className="font-semibold">{candidate.experience || "Belum diisi"}</p>
        </div>

        <div>
          <label className="text-gray-400">Posisi:</label>
          <p className="font-semibold">{candidate.position || "Belum diisi"}</p>
        </div>

        <div>
          <label className="text-gray-400">Status:</label>
          <span
            className={`inline-block px-2 py-1 text-sm rounded ${
              candidate.status === "aktif"
                ? "bg-green-600"
                : "bg-gray-600"
            }`}
          >
            {candidate.status}
          </span>
        </div>

        {/* Tombol tindakan */}
        <div className="mt-6 flex gap-4">
          <Link
            to="/home/admin/profile/edit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
          >
            ✏️ Edit Profil
          </Link>
          <Link
            to="/home/admin/profile/changepass"
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm"
          >
            🔒 Ganti Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

