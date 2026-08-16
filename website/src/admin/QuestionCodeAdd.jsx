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
    console.log("Kontol :",id);
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

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow space-y-6">

      {/* View Kode Soal */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📋 Daftar Kode Soal</h2>
        {questionCodes.length === 0 ? (
          <p className="text-gray-400 italic">Belum ada kode soal.</p>
        ) : (
          <div className="space-y-2">
            {questionCodes.map((qc) => (
              <div
                key={qc.id}
                className="bg-gray-800 rounded p-3 shadow hover:shadow-lg transition"
              >
                {editingCode === qc.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="code"
                      value={editedCode.code}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-500"
                    />
                    <input
                      type="text"
                      name="title"
                      value={editedCode.title}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-500"
                    />
                    <textarea
                      name="description"
                      value={editedCode.description}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-500"
                    />
                    <select
                      name="companyCode"
                      value={editedCode.companyCode}
                      onChange={handleEditChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-500"
                    >
                      <option value="UMUM">UMUM</option>
                      {userCompany && (
                        <option value={userCompany.code}>{userCompany.code}</option>
                      )}
                    </select>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleUpdate(qc.id)}
                        className="bg-green-600 px-3 py-1 rounded"
                      >
                        ✅ Simpan
                      </button>
                      <button
                        onClick={() => setEditingCode(null)}
                        className="bg-gray-600 px-3 py-1 rounded"
                      >
                        ❌ Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-bold text-blue-400">
                      #{qc.code}{" "}
                      <span className="text-gray-400">({qc.companyCode || "UMUM"})</span>
                    </p>
                    <p className="text-gray-200">{qc.title}</p>
                    {qc.description && <p className="text-sm text-gray-400">{qc.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditClick(qc)}
                        className="text-blue-400 hover:underline text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(qc.id)}
                        className="text-red-400 hover:underline text-sm"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Tambah Kode Soal */}
      <div>
        <h2 className="text-2xl font-bold mb-4">➕ Tambah Kode Soal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300">Perusahaan / UMUM:</label>
            <select
              name="companyCode"
              value={form.companyCode}
              onChange={(e) => setForm((prev) => ({ ...prev, companyCode: e.target.value }))}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              required
            >
              <option value="UMUM">UMUM</option>
              {userCompany && <option value={userCompany.code}>{userCompany.code}</option>}
            </select>
          </div>

          <div>
            <label className="block text-gray-300">Kode Soal:</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              placeholder="Misal: TEST-001"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300">Judul Set Soal:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              placeholder="Misal: Tes Logika Dasar"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300">Deskripsi:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              placeholder="Deskripsi singkat kode soal"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
          >
            Simpan Kode Soal
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionCodeAdd;
