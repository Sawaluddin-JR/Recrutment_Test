import React, { useState, useEffect } from "react";
import axios from "axios";

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({
    content: "",
    type: "MULTIPLE_CHOICE",
    questionCode: "UMUM",
    options: [{ text: "", correct: false }, { text: "", correct: false }],
    correctAnswer: "",
  });

  // Ambil bank soal
  const fetchQuestions = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8080/api/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data || []);
    } catch (err) {
      console.error("❌ Gagal ambil soal:", err);
      setQuestions([]);
    }
  };

  // Mulai edit soal
  const startEdit = (q) => {
    setEditingQuestion(q.id);
    setEditedQuestion({
      content: q.content || "",
      type: q.type || "MULTIPLE_CHOICE",
      questionCode: q.questionCode || "UMUM",
      options: q.options?.length ? q.options : [{ text: "", correct: false }],
      correctAnswer: q.correctAnswer || "",
    });
  };

  // Handle perubahan field
  const handleChange = (field, value) => {
    setEditedQuestion((prev) => ({ ...prev, [field]: value }));
  };

  // Handle perubahan option
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index][field] = field === "correct" ? value === true || value === "true" : value;
    setEditedQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setEditedQuestion((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", correct: false }],
    }));
  };

  // Simpan edit pertanyaan
  const handleSaveEdit = async (id) => {
    const token = localStorage.getItem("token");
    const payload = { ...editedQuestion }; // semua field kecuali id
    console.log("paylod : ", payload);
    try {
      await axios.put(`http://localhost:8080/api/questions/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...editedQuestion } : q))
      );
      setEditingQuestion(null);
    } catch (err) {
      console.error("❌ Gagal simpan edit:", err);
    }
  };

  // Hapus pertanyaan
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("❌ Gagal hapus soal:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">📚 Bank Soal</h2>
      {questions.length === 0 ? (
        <p>Tidak ada soal tersedia.</p>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-gray-800 rounded p-4 shadow hover:shadow-lg transition"
            >
              {editingQuestion === q.id ? (
                <>
                  {/* Content */}
                  <textarea
                    value={editedQuestion.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-500 mb-2"
                  />
                  {/* Type */}
                  <select
                    value={editedQuestion.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-500 mb-2"
                  >
                    <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
                    <option value="ESSAY">Esai</option>
                  </select>
                  {/* Question Code */}
                  {/* <input
                    type="text"
                    value={editedQuestion.questionCode}
                    onChange={(e) => handleChange("questionCode", e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-500 mb-2"
                    placeholder="Kode Soal"
                  /> */}
                  {/* Options jika multiple choice */}
                  {editedQuestion.type === "MULTIPLE_CHOICE" &&
                    editedQuestion.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleOptionChange(i, "text", e.target.value)}
                          className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-500"
                          placeholder={`Pilihan ${i + 1}`}
                        />
                        <select
                          value={(opt.correct ?? false).toString()}
                          onChange={(e) => handleOptionChange(i, "correct", e.target.value)}
                          className="p-2 rounded-lg bg-gray-700 border border-gray-500"
                        >
                          <option value="false">❌ Salah</option>
                          <option value="true">✅ Benar</option>
                        </select>

                      </div>
                    ))}
                  {editedQuestion.type === "MULTIPLE_CHOICE" && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-sm text-blue-400 hover:text-blue-500 mb-2"
                    >
                      ➕ Tambah Pilihan
                    </button>
                  )}
                  {/* Correct Answer jika essay */}
                  {editedQuestion.type === "ESSAY" && (
                    <input
                      type="text"
                      value={editedQuestion.correctAnswer}
                      onChange={(e) => handleChange("correctAnswer", e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded border border-gray-500 mb-2"
                      placeholder="Jawaban Benar"
                    />
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSaveEdit(q.id)}
                      className="bg-green-600 px-3 py-1 rounded"
                    >
                      ✅ Simpan
                    </button>
                    <button
                      onClick={() => setEditingQuestion(null)}
                      className="bg-gray-600 px-3 py-1 rounded"
                    >
                      ❌ Batal
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">📝 {q.content}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Tipe:{" "}
                    <span className="uppercase font-bold text-yellow-400">{q.type}</span>
                  </p>
                  {q.type === "MULTIPLE_CHOICE" ? (
                    <ul className="list-disc ml-5 space-y-1">
                      {q.options?.map((opt) => (
                        <li
                          key={opt.id}
                          className={opt.correct ? "text-green-400 font-semibold" : "text-white"}
                        >
                          {opt.text}{" "}
                          {opt.correct && <span className="text-sm text-green-300">(✅ benar)</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2">
                      <span className="text-gray-400">Jawaban benar:</span>{" "}
                      <span className="text-green-300 font-semibold">{q.correctAnswer}</span>
                    </p>
                  )}
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => startEdit(q)}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
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
  );
};

export default QuestionBank;
