import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const QuestionFormEdit = () => {
  const { id } = useParams(); // ambil id soal dari route
  const navigate = useNavigate();

  const [form, setForm] = useState({
    content: "",
    type: "MULTIPLE_CHOICE",
    companyId: null,
    options: [
      { text: "", correct: false },
      { text: "", correct: false },
    ],
    correctAnswer: "",
  });

  const [userCompany, setUserCompany] = useState(null);
  const [userId, setUserId] = useState(null);

  // Ambil user info & data perusahaan user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const uid = localStorage.getItem("id");
    setUserId(uid);

    axios
      .get(`http://localhost:8080/api/company/user/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
          setUserCompany(res.data);
        }
      })
      .catch((err) => console.error("Gagal ambil data perusahaan user:", err));
  }, []);

  // Ambil data soal yang mau diedit
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8080/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setForm({
          content: data.content,
          type: data.type,
          companyId: data.companyId || null,
          options: data.type === "MULTIPLE_CHOICE" ? data.options : [],
          correctAnswer: data.type === "ESSAY" ? data.correctAnswer : "",
        });
      })
      .catch((err) => {
        console.error("Gagal ambil soal:", err);
        alert("Gagal memuat soal.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...form.options];
    newOptions[index][field] = field === "correct" ? value === "true" : value;
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", correct: false }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      content: form.content,
      type: form.type,
      companyId: form.companyId,
      updatedById: Number(userId), // user yang update
      options: form.type === "MULTIPLE_CHOICE" ? form.options : undefined,
      correctAnswer: form.type === "ESSAY" ? form.correctAnswer : undefined,
    };

    try {
      await axios.put(`http://localhost:8080/api/questions/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      alert("✅ Soal berhasil diperbarui!");
      navigate("/questions"); // kembali ke daftar soal
    } catch (err) {
      console.error("❌ Gagal update soal:", err);
      alert("Gagal memperbarui soal.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">✏️ Edit Soal</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-300">Perusahaan:</label>
          <select
            name="companyId"
            value={form.companyId || ""}
            onChange={(e) => setForm((prev) => ({ ...prev, companyId: Number(e.target.value) }))}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            required
          >
            {userCompany && <option value={userCompany.id}>{userCompany.name}</option>}
            <option value="">Umum</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Isi Soal:</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Tipe Soal:</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
            <option value="ESSAY">Esai</option>
          </select>
        </div>

        {form.type === "MULTIPLE_CHOICE" && (
          <div className="space-y-3">
            <label className="text-gray-300">Pilihan Jawaban:</label>
            {form.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Pilihan ${i + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(i, "text", e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={opt.correct.toString()}
                  onChange={(e) => handleOptionChange(i, "correct", e.target.value)}
                  className="p-2 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="false">❌ Salah</option>
                  <option value="true">✅ Benar</option>
                </select>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-sm text-blue-400 hover:text-blue-500 transition-colors"
            >
              ➕ Tambah Pilihan
            </button>
          </div>
        )}

        {form.type === "ESSAY" && (
          <div>
            <label className="block text-gray-300 mb-1">Jawaban Benar (Essay):</label>
            <input
              type="text"
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-medium"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default QuestionFormEdit;
