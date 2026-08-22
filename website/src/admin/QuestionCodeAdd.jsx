import React, { useEffect, useState } from "react";
import axios from "axios";

const QuestionCodeAdd = () => {
  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
    companyCode: "UMUM", // default UMUM
  });

  const [userCompany, setUserCompany] = useState(null);
  const [questionCodes, setQuestionCodes] = useState([]);
  const [editingCode, setEditingCode] = useState(null);
  const [editedCode, setEditedCode] = useState({
    code: "",
    title: "",
    description: "",
    companyCode: "UMUM",
  });

  // ambil data perusahaan user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    axios
      .get(`http://localhost:8080/api/company/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) setUserCompany(res.data);
      })
      .catch((err) => console.error("Gagal ambil data perusahaan user:", err));
  }, []);

  // ambil daftar kode soal
  const fetchQuestionCodes = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8080/api/questionscode", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Question Codes API:", res.data);
      setQuestionCodes(res.data || []);
    } catch (err) {
      console.error("Gagal ambil daftar kode soal:", err);
    }
  };

  useEffect(() => {
    fetchQuestionCodes();
  }, []);

  // Tambah kode soal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.title || !form.companyCode) {
      return alert("Kode, judul, dan perusahaan harus diisi.");
    }
    console.log("company:", form.companyCode);
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8080/api/questionscode",
        {
          code: form.code,
          title: form.title,
          description: form.description,
          companyCode: !form.companyCode ? "UMUM" : form.companyCode,
          active: true,
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      alert("✅ Kode Soal berhasil ditambahkan!");
      setForm({ code: "", title: "", description: "", companyCode: "UMUM" });
      fetchQuestionCodes();
    } catch (err) {
      console.error("❌ Gagal menambahkan kode soal:", err);
      alert("Gagal menambahkan kode soal.");
    }
  };

  // Hapus kode soal
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus kode soal ini?")) return;
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8080/api/questionscode/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestionCodes((prev) => prev.filter((qc) => qc.id !== id));
    } catch (err) {
      console.error("Gagal hapus kode soal:", err);
    }
  };

  // Edit / Update kode soal
  const handleEditClick = (qc) => {
    setEditingCode(qc.id);
    setEditedCode({
      code: qc.code,
      title: qc.title,
      description: qc.description || "",
      companyCode: qc.companyCode || "UMUM",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedCode((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:8080/api/questionscode/${id}`,
        {
          code: editedCode.code,
          title: editedCode.title,
          description: editedCode.description,
          companyCode: editedCode.companyCode === "UMUM" ? null : editedCode.companyCode,
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setQuestionCodes((prev) =>
        prev.map((qc) =>
          qc.id === id ? { ...qc, ...editedCode } : qc
        )
      );
      setEditingCode(null);
    } catch (err) {
      console.error("Gagal update kode soal:", err);
      alert("Gagal update kode soal.");
    }
  };

  // return (
  //   <div className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow space-y-6">

  //     {/* View Kode Soal */}
  //     <div>
  //       <h2 className="text-2xl font-bold mb-4">📋 Daftar Kode Soal</h2>
  //       {questionCodes.length === 0 ? (
  //         <p className="text-gray-400 italic">Belum ada kode soal.</p>
  //       ) : (
  //         <div className="space-y-2">
  //           {questionCodes.map((qc) => (
  //             <div
  //               key={qc.id}
  //               className="bg-gray-800 rounded p-3 shadow hover:shadow-lg transition"
  //             >
  //               {editingCode === qc.id ? (
  //                 <div className="space-y-2">
  //                   <input
  //                     type="text"
  //                     name="code"
  //                     value={editedCode.code}
  //                     onChange={handleEditChange}
  //                     className="w-full p-2 rounded bg-gray-700 border border-gray-500"
  //                   />
  //                   <input
  //                     type="text"
  //                     name="title"
  //                     value={editedCode.title}
  //                     onChange={handleEditChange}
  //                     className="w-full p-2 rounded bg-gray-700 border border-gray-500"
  //                   />
  //                   <textarea
  //                     name="description"
  //                     value={editedCode.description}
  //                     onChange={handleEditChange}
  //                     className="w-full p-2 rounded bg-gray-700 border border-gray-500"
  //                   />
  //                   <select
  //                     name="companyCode"
  //                     value={editedCode.companyCode}
  //                     onChange={handleEditChange}
  //                     className="w-full p-2 rounded bg-gray-700 border border-gray-500"
  //                   >
  //                     <option value="UMUM">UMUM</option>
  //                     {userCompany && (
  //                       <option value={userCompany.code}>{userCompany.code}</option>
  //                     )}
  //                   </select>
  //                   <div className="flex gap-2 mt-2">
  //                     <button
  //                       onClick={() => handleUpdate(qc.id)}
  //                       className="bg-green-600 px-3 py-1 rounded"
  //                     >
  //                       ✅ Simpan
  //                     </button>
  //                     <button
  //                       onClick={() => setEditingCode(null)}
  //                       className="bg-gray-600 px-3 py-1 rounded"
  //                     >
  //                       ❌ Batal
  //                     </button>
  //                   </div>
  //                 </div>
  //               ) : (
  //                 <>
  //                   <p className="font-bold text-blue-400">
  //                     #{qc.code}{" "}
  //                     <span className="text-gray-400">({qc.companyCode || "UMUM"})</span>
  //                   </p>
  //                   <p className="text-gray-200">{qc.title}</p>
  //                   {qc.description && <p className="text-sm text-gray-400">{qc.description}</p>}
  //                   <div className="flex gap-2 mt-2">
  //                     <button
  //                       onClick={() => handleEditClick(qc)}
  //                       className="text-blue-400 hover:underline text-sm"
  //                     >
  //                       ✏️ Edit
  //                     </button>
  //                     <button
  //                       onClick={() => handleDelete(qc.id)}
  //                       className="text-red-400 hover:underline text-sm"
  //                     >
  //                       🗑️ Hapus
  //                     </button>
  //                   </div>
  //                 </>
  //               )}
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>

  //     {/* Form Tambah Kode Soal */}
  //     <div>
  //       <h2 className="text-2xl font-bold mb-4">➕ Tambah Kode Soal</h2>
  //       <form onSubmit={handleSubmit} className="space-y-4">
  //         <div>
  //           <label className="block text-gray-300">Perusahaan / UMUM:</label>
  //           <select
  //             name="companyCode"
  //             value={form.companyCode}
  //             onChange={(e) => setForm((prev) => ({ ...prev, companyCode: e.target.value }))}
  //             className="w-full p-2 rounded bg-gray-800 border border-gray-600"
  //             required
  //           >
  //             <option value="UMUM">UMUM</option>
  //             {userCompany && <option value={userCompany.code}>{userCompany.code}</option>}
  //           </select>
  //         </div>

  //         <div>
  //           <label className="block text-gray-300">Kode Soal:</label>
  //           <input
  //             type="text"
  //             name="code"
  //             value={form.code}
  //             onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
  //             className="w-full p-2 rounded bg-gray-800 border border-gray-600"
  //             placeholder="Misal: TEST-001"
  //             required
  //           />
  //         </div>

  //         <div>
  //           <label className="block text-gray-300">Judul Set Soal:</label>
  //           <input
  //             type="text"
  //             name="title"
  //             value={form.title}
  //             onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
  //             className="w-full p-2 rounded bg-gray-800 border border-gray-600"
  //             placeholder="Misal: Tes Logika Dasar"
  //             required
  //           />
  //         </div>

  //         <div>
  //           <label className="block text-gray-300">Deskripsi:</label>
  //           <textarea
  //             name="description"
  //             value={form.description}
  //             onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
  //             className="w-full p-2 rounded bg-gray-800 border border-gray-600"
  //             placeholder="Deskripsi singkat kode soal"
  //             rows={3}
  //           />
  //         </div>

  //         <button
  //           type="submit"
  //           className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
  //         >
  //           Simpan Kode Soal
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        <section className="bg-gray-900/80 backdrop-blur rounded-2xl border border-gray-800 shadow-xl overflow-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-800">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                📋 Daftar Kode Soal
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Semua kode soal yang tersedia.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              {questionCodes.length} Kode
            </div>
          </div>

          <div className="p-5">
            {questionCodes.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">📭</div>

                <h3 className="text-lg font-semibold text-gray-200">
                  Belum ada kode soal
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Tambahkan kode soal pertama kamu melalui form di bawah.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {questionCodes.map((qc) => (
                  <div
                    key={qc.id}
                    className="group bg-gray-800/70 border border-gray-700/70 rounded-xl p-4 hover:border-blue-500/40 hover:bg-gray-800 transition-all duration-200"
                  >
                    {editingCode === qc.id ? (
                      /* ================= EDIT MODE ================= */
                      <div className="space-y-4">

                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">
                            ✏️ Edit Kode Soal
                          </h3>
                        </div>

                        {/* <div>
                          <label className="block text-sm text-gray-400 mb-1.5">
                            Kode Soal
                          </label>

                          <input
                            type="text"
                            name="code"
                            value={editedCode.code}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                          />
                        </div> */}

                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">
                            Judul Set Soal
                          </label>

                          <input
                            type="text"
                            name="title"
                            value={editedCode.title}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">
                            Deskripsi
                          </label>

                          <textarea
                            name="description"
                            value={editedCode.description}
                            onChange={handleEditChange}
                            rows={3}
                            className="w-full px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
                          />
                        </div>

                        {/* <div>
                          <label className="block text-sm text-gray-400 mb-1.5">
                            Perusahaan
                          </label>

                          <select
                            name="companyCode"
                            value={editedCode.companyCode}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition"
                          >
                            <option value="UMUM">🌐 UMUM</option>

                            {userCompany && (
                              <option value={userCompany.code}>
                                🏢 {userCompany.code}
                              </option>
                            )}
                          </select>
                        </div> */}

                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <button
                            onClick={() => handleUpdate(qc.id)}
                            className="flex-1 bg-green-600 hover:bg-green-500 px-4 py-2.5 rounded-lg font-medium transition shadow-lg shadow-green-900/20"
                          >
                            💾 Simpan Perubahan
                          </button>

                          <button
                            onClick={() => setEditingCode(null)}
                            className="sm:w-32 bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded-lg font-medium transition"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ================= VIEW MODE ================= */
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                          <div className="flex-1">

                            {/* Code */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold text-sm">
                                #{qc.code}
                              </span>

                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-700/70 text-gray-300 text-xs">
                                {qc.companyCode || "UMUM"}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-gray-100">
                              {qc.title}
                            </h3>

                            {/* Description */}
                            {qc.description ? (
                              <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
                                {qc.description}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-600 italic mt-1.5">
                                Tidak ada deskripsi
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex sm:flex-col gap-2">
                            <button
                              onClick={() => handleEditClick(qc)}
                              className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition text-sm font-medium"
                            >
                              ✏️ Edit
                            </button>

                            <button
                              onClick={() => handleDelete(qc.id)}
                              className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition text-sm font-medium"
                            >
                              🗑️ Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Form Tambah */}
        <section className="bg-gray-900/80 backdrop-blur rounded-2xl border border-gray-800 shadow-xl overflow-hidden">

          {/* Header */}
          <div className="p-5 border-b border-gray-800 bg-gradient-to-r from-green-500/5 to-blue-500/5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              ➕ Tambah Kode Soal
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Buat kode soal baru untuk digunakan dalam proses seleksi.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-5 space-y-5"
          >

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                🏢 Perusahaan / Scope
              </label>

              <select
                name="companyCode"
                value={form.companyCode}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    companyCode: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                required
              >
                <option value="UMUM">🌐 UMUM</option>

                {userCompany && (
                  <option value={userCompany.code}>
                    🏢 {userCompany.code}
                  </option>
                )}
              </select>

              <p className="text-xs text-gray-500 mt-1.5">
                Pilih apakah soal dapat digunakan umum atau khusus perusahaan.
              </p>
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                🔑 Kode Soal
              </label>

              <input
                type="text"
                name="code"
                value={form.code}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    code: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition font-mono"
                placeholder="Contoh: TEST-001"
                required
              />

              <p className="text-xs text-gray-500 mt-1.5">
                Gunakan kode yang mudah dikenali, misalnya TEST-001.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                📝 Judul Set Soal
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                placeholder="Contoh: Tes Logika Dasar"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                📄 Deskripsi
                <span className="text-gray-500 font-normal ml-1">
                  (opsional)
                </span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
                placeholder="Contoh: Kumpulan soal untuk mengukur kemampuan logika dasar kandidat."
                rows={4}
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                💾 Simpan Kode Soal
              </button>
            </div>

          </form>
        </section>

        {/* Footer Hint */}
        <div className="text-center text-xs text-gray-600 pb-4">
          💡 Pastikan kode soal unik agar mudah digunakan saat membuat tes.
        </div>

      </div>
    </div>
  );
};

export default QuestionCodeAdd;
