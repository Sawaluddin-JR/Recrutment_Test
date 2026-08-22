import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormHasilSeleksi = () => {
  const navigate = useNavigate();
  const [kandidat, setKandidat] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1️⃣ Ambil data kandidat
      const [candidateRes, testResultRes] = await Promise.all([
        axios.get("http://localhost:8080/api/candidates", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/testresult", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const candidates = candidateRes.data;
      const testResults = testResultRes.data;

      // 2️⃣ Filter hanya status SUBMITTED
      const filteredResults = testResults.filter(
        (h) => h.status === "SUBMITTED"
      );

      // 3️⃣ Join dengan kandidat berdasarkan candidateId
      const mapped = filteredResults.map((h) => {
        const candidate = candidates.find((c) => c.id === h.candidateId);
        return {
          id: h.id,
          candidateId: h.candidateId,
          nama: candidate?.fullName || "Tidak Diketahui",
          email: candidate?.email || "-",
          status: "lolos", // default untuk submitted
        };
      });

      setKandidat(mapped);
    } catch (err) {
      console.error("❌ Gagal ambil data kandidat / hasil tes:", err);
      alert("Gagal memuat hasil seleksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = (id, value) => {
    setKandidat((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: value } : k))
    );
  };

  const handleSimpan = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/testresult/save-status",
        kandidat,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("✅ Hasil seleksi berhasil disimpan!");
    } catch (err) {
      console.error("❌ Gagal simpan:", err);
      alert("Gagal simpan hasil seleksi.");
    }
  };

  const kirimNotifikasi = async (user) => {
    try {
      await axios.post(
        "http://localhost:8080/api/notifications",
        {
          title: "Hasil Seleksi",
          message: `Status Anda: ${user.status.toUpperCase()}`,
          type: user.status === "lolos" ? "SUCCESS" : "INFO",
          targetEmail: user.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`📢 Notifikasi terkirim ke ${user.nama}`);
    } catch (err) {
      console.error("❌ Gagal kirim notifikasi:", err);
      alert("Gagal kirim notifikasi.");
    }
  };

  const kirimSemuaNotifikasi = async () => {
    for (const k of kandidat) {
      await kirimNotifikasi(k);
    }
    alert("📢 Semua notifikasi terkirim!");
  };

  // return (
  //   <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
  //     <h1 className="text-2xl font-bold mb-4">🎯 Hasil Seleksi</h1>

  //     {loading ? (
  //       <p>Loading...</p>
  //     ) : kandidat.length === 0 ? (
  //       <p className="text-gray-300">Belum ada kandidat yang statusnya SUBMITTED.</p>
  //     ) : (
  //       <table className="w-full text-left border border-gray-700">
  //         <thead>
  //           <tr className="bg-gray-700">
  //             <th className="p-2">Nama</th>
  //             <th className="p-2">Email</th>
  //             <th className="p-2">Status</th>
  //             <th className="p-2 text-right">Aksi</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {kandidat.map((k) => (
  //             <tr key={k.id} className="border-t border-gray-700">
  //               <td className="p-2">{k.nama}</td>
  //               <td className="p-2">{k.email}</td>
  //               <td className="p-2">
  //                 <select
  //                   value={k.status}
  //                   onChange={(e) => handleChangeStatus(k.id, e.target.value)}
  //                   className="bg-gray-700 p-1 rounded"
  //                 >
  //                   <option value="lolos">✅ Lolos</option>
  //                   <option value="tidak">❌ Tidak Lolos</option>
  //                   <option value="cadangan">🕒 Cadangan</option>
  //                 </select>
  //               </td>
  //               <td className="p-2 text-right">
  //                 <button
  //                   onClick={() =>
  //                     navigate(`/home/admin/penilaianjawaban/${k.id}`)
  //                   }
  //                   className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
  //                 >
  //                   📝 Nilai
  //                 </button>

  //                 <button
  //                   onClick={() => kirimNotifikasi(k)}
  //                   className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
  //                 >
  //                   🔔 Kirim Notif
  //                 </button>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     )}

  //     {kandidat.length > 0 && (
  //       <div className="flex justify-between mt-4">
  //         {/* <button
  //           onClick={handleSimpan}
  //           className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
  //         >
  //           💾 Simpan Hasil
  //         </button> */}

  //         <button
  //           onClick={kirimSemuaNotifikasi}
  //           className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
  //         >
  //           📢 Kirim Semua
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                🎯
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Hasil Seleksi
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Kelola hasil seleksi dan penilaian kandidat
                </p>
              </div>
            </div>
          </div>

          {/* {kandidat.length > 0 && (
            <button
              onClick={kirimSemuaNotifikasi}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-900/20 transition-all duration-200 hover:scale-[1.02]"
            >
              📢
              <span>Kirim Semua Notifikasi</span>
            </button>
          )} */}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-semibold text-lg">
              Daftar Kandidat
            </h2>
            <p className="text-sm text-gray-500">
              Kandidat yang telah menyelesaikan proses seleksi
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">
              Memuat data kandidat...
            </p>
          </div>
        ) : kandidat.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-4xl mb-5">
              📭
            </div>

            <h3 className="text-lg font-semibold mb-2">
              Belum Ada Kandidat
            </h3>

            <p className="text-gray-400 max-w-md text-sm">
              Belum ada kandidat yang memiliki status{" "}
              <span className="text-blue-400 font-medium">
                SUBMITTED
              </span>
              .
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800/70 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="px-5 py-4 font-medium">
                    Kandidat
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Email
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-5 py-4 font-medium text-right">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {kandidat.map((k) => (
                  <tr
                    key={k.id}
                    className="hover:bg-gray-800/40 transition-colors duration-150"
                  >
                    {/* Kandidat */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-md">
                          {/* {k.nama?.charAt(0)?.toUpperCase() || "?"} */}
                          {k.nama?.split(" ").map(n => n.charAt(0)).slice(0, 2).join("").toUpperCase() || "?"}
                        </div>

                        <div>
                          <p className="font-medium text-white">
                            {k.nama}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <span className="text-gray-300 text-sm">
                        {k.email}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <select
                        value={k.status}
                        onChange={(e) =>
                          handleChangeStatus(k.id, e.target.value)
                        }
                        className={`
                        appearance-none
                        px-3 py-2
                        rounded-lg
                        border
                        text-sm
                        font-medium
                        outline-none
                        cursor-pointer
                        transition
                        bg-gray-800
                        ${k.status === "lolos"
                            ? "border-green-500/30 text-green-400"
                            : k.status === "tidak"
                              ? "border-red-500/30 text-red-400"
                              : "border-yellow-500/30 text-yellow-400"
                          }
                        hover:bg-gray-700
                        focus:ring-2
                        focus:ring-blue-500/30
                      `}
                      >
                        <option value="lolos">
                          ✅ Lolos
                        </option>

                        <option value="tidak">
                          ❌ Tidak Lolos
                        </option>

                        <option value="cadangan">
                          🕒 Cadangan
                        </option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/home/admin/penilaianjawaban/${k.id}`
                            )
                          }
                          className="inline-flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                          title="Nilai Jawaban"
                        >
                          📝
                          <span className="hidden lg:inline">
                            Nilai
                          </span>
                        </button>

                        <button
                          onClick={() => kirimNotifikasi(k)}
                          className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                          title="Kirim Notifikasi"
                        >
                          🔔
                          <span className="hidden lg:inline">
                            Notif
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && kandidat.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-800 bg-gray-900/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Menampilkan{" "}
              <span className="text-gray-300 font-medium">
                {kandidat.length}
              </span>{" "}
              kandidat
            </p>

            <button
              onClick={kirimSemuaNotifikasi}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              📢 Kirim Semua Notifikasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormHasilSeleksi;
