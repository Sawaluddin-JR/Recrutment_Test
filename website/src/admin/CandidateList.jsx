import React, { useEffect, useState } from "react";
import axios from "axios";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/api/candidates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCandidates(res.data);
      })
      .catch((err) => {
        console.error("Gagal fetch kandidat:", err);
      });
  }, []);

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">📋 Daftar Kandidat</h2>
      {candidates.length === 0 ? (
        <p>Tidak ada kandidat.</p>
      ) : (
        <table className="w-full text-sm bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2">Nama</th>
              <th className="p-2">Email</th>
              <th className="p-2">Posisi</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="hover:bg-gray-600">
                <td className="p-2">{c.fullName}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.position}</td>
                <td className="p-2">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CandidateList;
