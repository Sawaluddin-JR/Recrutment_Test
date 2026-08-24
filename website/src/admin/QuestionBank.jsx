import React, { useState, useEffect } from "react";
import axios from "axios";

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [editedQuestion, setEditedQuestion] = useState({
    content: "",
    type: "MULTIPLE_CHOICE",
    options: [
      { text: "", correct: false },
      { text: "", correct: false },
    ],
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

  // const startEdit = (q) => {
  //   setEditingQuestion(q.id);
  //   setEditedQuestion({
  //     content: q.content || "",
  //     type: q.type || "MULTIPLE_CHOICE",
  //     questionCode: q.questionCode || "UMUM",
  //     options: q.options?.length ? q.options : [{ text: "", correct: false }],
  //     correctAnswer: q.correctAnswer || "",
  //   });
  // };

  const startEdit = (q) => {
    setEditingQuestion(q.id);

    setEditedQuestion({
      content: q.content || "",
      type: q.type || "MULTIPLE_CHOICE",
      options: q.options?.length
        ? q.options.map((opt) => ({
          text: opt.text || "",
          correct: !!opt.isCorrect,
        }))
        : [
          { text: "", correct: false },
          { text: "", correct: false },
        ],
      correctAnswer: q.correctAnswer || "",
    });
  };

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
    // const payload = { ...editedQuestion };

    const payload = {
      content: editedQuestion.content,
      type: editedQuestion.type,
      correctAnswer:
        editedQuestion.type === "ESSAY"
          ? editedQuestion.correctAnswer
          : null,
      options:
        editedQuestion.type === "MULTIPLE_CHOICE"
          ? editedQuestion.options
          : [],
    };

    console.log("paylod : ", payload);

    try {
      await axios.put(`http://localhost:8080/api/questions/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...editedQuestion } : q))
      );

      // Ambil ulang data terbaru dari backend
      await fetchQuestions();

      // Keluar dari mode edit
      setEditingQuestion(null);

    } catch (err) {
      console.error("❌ Gagal simpan edit:", err);
    }
  };

  // Hapus pertanyaan
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus soal ini?"
    );
    
    if (!confirmed) {
      return;
    }

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
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              📚 Bank Soal
            </h2>

            <p className="text-gray-400 mt-1">
              Kelola dan review soal-soal untuk proses seleksi kandidat.
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl px-5 py-3">
            <p className="text-xs text-gray-400">
              Total Soal
            </p>

            <p className="text-2xl font-bold text-blue-400">
              {questions.length}
            </p>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center shadow-lg">
            <div className="text-5xl mb-4">
              📭
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Belum ada soal
            </h3>

            <p className="text-gray-400">
              Tidak ada soal tersedia di bank soal saat ini.
            </p>
          </div>
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg hover:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                {editingQuestion === q.id ? (
                  <>
                    <div className="mb-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                          {index + 1}
                        </div>
                      </div>
                    </div>

                    <label className="block text-sm text-gray-400 mb-2">
                      Pertanyaan
                    </label>

                    <textarea
                      value={editedQuestion.content}
                      onChange={(e) =>
                        handleChange("content", e.target.value)
                      }
                      className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none mb-4"
                      rows="4"
                    />

                    <label className="block text-sm text-gray-400 mb-2">
                      Tipe Soal
                    </label>

                    <select
                      value={editedQuestion.type}
                      onChange={(e) =>
                        handleChange("type", e.target.value)
                      }
                      className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none mb-4"
                    >
                      <option value="MULTIPLE_CHOICE">
                        Pilihan Ganda
                      </option>

                      <option value="ESSAY">
                        Esai
                      </option>
                    </select>

                    {/* <input
                      type="text"
                      value={editedQuestion.questionCode}
                      onChange={(e) => handleChange("questionCode", e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded border border-gray-500 mb-2"
                      placeholder="Kode Soal"
                    /> 
                    */}

                    {editedQuestion.type === "MULTIPLE_CHOICE" && (
                      <div className="mb-4">

                        <label className="block text-sm text-gray-400 mb-2">
                          Pilihan Jawaban
                        </label>

                        <div className="space-y-2">
                          {editedQuestion.options?.map((opt, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2"
                            >

                              <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-sm font-bold">
                                {String.fromCharCode(65 + i)}
                              </div>

                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) =>
                                  handleOptionChange(
                                    i,
                                    "text",
                                    e.target.value
                                  )
                                }
                                className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
                                placeholder={`Pilihan ${i + 1}`}
                              />

                              <select
                                value={(opt.correct ?? false).toString()}
                                onChange={(e) =>
                                  handleOptionChange(
                                    i,
                                    "correct",
                                    e.target.value
                                  )
                                }
                                className="p-2 rounded-lg bg-gray-800 border border-gray-700"
                              >
                                <option value="false">
                                  ❌ Salah
                                </option>

                                <option value="true">
                                  ✅ Benar
                                </option>
                              </select>

                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={addOption}
                          className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition"
                        >
                          ➕ Tambah Pilihan
                        </button>

                      </div>
                    )}
                    {editedQuestion.type === "ESSAY" && (
                      <div className="mb-4">

                        <label className="block text-sm text-gray-400 mb-2">
                          Jawaban Benar
                        </label>

                        <input
                          type="text"
                          value={editedQuestion.correctAnswer}
                          onChange={(e) =>
                            handleChange(
                              "correctAnswer",
                              e.target.value
                            )
                          }
                          className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none"
                          placeholder="Masukkan jawaban benar"
                        />

                      </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-800">

                      <button
                        onClick={() => handleSaveEdit(q.id)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-medium transition"
                      >
                        ✅ Simpan
                      </button>

                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition"
                      >
                        ❌ Batal
                      </button>

                    </div>
                  </>
                ) : (
                  <>

                    <div className="flex items-start justify-between gap-4 mb-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                          {index + 1}
                        </div>

                        <div>

                          <span
                            className={`inline-flex items-center mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${q.type === "MULTIPLE_CHOICE"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              }`}
                          >
                            {q.type === "MULTIPLE_CHOICE"
                              ? "☑️ Pilihan Ganda"
                              : "✍️ Essay"}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="mb-5">

                      <h3 className="text-lg font-semibold leading-relaxed text-gray-100">
                        {q.content}
                      </h3>

                    </div>

                    {q.type === "MULTIPLE_CHOICE" ? (
                      <div className="space-y-3">

                        {/* Pilihan Jawaban */}
                        <div className="bg-gray-950/70 border border-gray-800 rounded-xl p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                            Pilihan Jawaban
                          </p>

                          <div className="space-y-2">
                            {q.options?.map((opt, optIndex) => (
                              <div
                                key={opt.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition ${opt.isCorrect
                                  ? "bg-green-500/10 border-green-500/30"
                                  : "bg-gray-800/50 border-gray-700"
                                  }`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${opt.isCorrect
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-700 text-gray-300"
                                    }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}
                                </div>

                                <span
                                  className={
                                    opt.isCorrect
                                      ? "text-green-300 font-semibold"
                                      : "text-gray-300"
                                  }
                                >
                                  {opt.text}
                                </span>

                                {opt.isCorrect && (
                                  <span className="ml-auto text-xs text-green-400 font-semibold">
                                    ✓ Benar
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (

                      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                          Jawaban Benar
                        </p>

                        <p className="text-green-300 font-semibold">
                          {q.correctAnswer || "-"}
                        </p>

                      </div>

                    )}

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-800">

                      <span className="text-xs text-gray-500">

                      </span>

                      <div className="flex items-center gap-2">

                        <button
                          onClick={() => startEdit(q)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => handleDelete(q.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition"
                        >
                          🗑️ Hapus
                        </button>

                      </div>

                    </div>

                  </>

                )}

              </div>

            ))}

          </div>
        )}

      </div>
    </div >
  );
};
export default QuestionBank;
