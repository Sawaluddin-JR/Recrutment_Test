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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Daftar Kandidat</h2>
          <p className="text-sm text-gray-400 mt-1">
            Daftar kandidat yang terdaftar dalam sistem
          </p>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-400">Tidak ada kandidat.</p>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-750 border-b border-gray-700">
                <tr className="text-gray-400">
                  <th className="px-6 py-4 text-left font-medium">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    Posisi
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {candidates.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-750 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-white">
                            {c.fullName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {c.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {c.position}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 text-sm font-medium ${c.status === "aktif"
                            ? "text-green-400"
                            : "text-gray-400"
                          }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${c.status === "aktif"
                              ? "bg-green-400"
                              : "bg-gray-500"
                            }`}
                        ></span>

                        {c.status
                          ? c.status.charAt(0).toUpperCase() +
                          c.status.slice(1)
                          : "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateList;
