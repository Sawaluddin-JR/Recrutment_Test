import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const TestForm = () => {
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [testResultId, setTestResultId] = useState(null);

  const [showResult, setShowResult] = useState(false);
  const [resultDetail, setResultDetail] = useState(null);

  // timer
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); // 2 jam (dalam detik)
  // const [timeLeft, setTimeLeft] = useState(1 * 1 * 60); // 2 jam (dalam detik)

  const location = useLocation();
  const questionCode = location.state?.code || "UMUM"; // default ke UMUM kalau null
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  // Ambil soal + buat TestResult baru
  useEffect(() => {
    const fetchQuestionsAndInitTest = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/questions/code/${questionCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestions(res.data || []);

        // Buat TestResult di backend
        const testRes = await axios.post(
          "http://localhost:8080/api/testresult",
          {
            candidateId: id, // TODO: ambil dari auth login user
            questionCode,
            startTime: new Date(),
            status: "IN_PROGRESS",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTestResultId(testRes.data.id);
      } catch (err) {
        console.error("❌ Gagal inisialisasi tes:", err);
      }
    };

    fetchQuestionsAndInitTest();
  }, [questionCode]);

  // TIMER effect
  useEffect(() => {
    if (showResult) return; // stop timer jika sudah selesai
    if (timeLeft <= 0) {
      handleSubmit(); // auto-submit jika waktu habis
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, showResult]);

  // format waktu ke hh:mm:ss
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // handle jawaban
  const handleChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!testResultId) return;

    try {
      // simpan semua jawaban
      for (const q of questions) {
        const payload = {
          questionId: q.id,
          selectedOptionId: q.type === "MULTIPLE_CHOICE" ? answers[q.id] : null,
          answerText: q.type === "ESSAY" ? answers[q.id] : null,
        };

        await axios.post(
          `http://localhost:8080/api/candidateanswer/${testResultId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // submit test
      const updated = await axios.put(
        `http://localhost:8080/api/testresult/${testResultId}/submit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResultDetail(updated.data);
      setShowResult(true);
    } catch (err) {
      console.error("❌ Gagal submit jawaban:", err);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          📑 Kerjakan Tes ({questionCode})
        </h2>
        {!showResult && (
          <div className="bg-gray-700 px-3 py-1 rounded text-yellow-300 font-mono">
            ⏳ {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {showResult ? (
        <div className="p-6 bg-gray-700 rounded">
          <h3 className="text-xl font-bold mb-4">📊 Hasil Tes</h3>
          <p className="mb-2">Total Soal: {resultDetail?.totalQuestions}</p>
          <p className="mb-2">Jawaban Benar: {resultDetail?.correctAnswers}</p>
          <p className="mb-2">Nilai: {resultDetail?.score}</p>
          <p className="mb-2">Status: {resultDetail?.status}</p>
        </div>
      ) : questions.length === 0 ? (
        <p className="text-gray-400">⏳ Soal belum tersedia...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 bg-gray-700 rounded">
              <p className="font-bold mb-2">
                {idx + 1}. {q.content}
              </p>

              {q.type === "MULTIPLE_CHOICE" ? (
                <div className="space-y-1">
                  {q.options.map((opt) => (
                    <label key={opt.id} className="block">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt.id}
                        checked={answers[q.id] === String(opt.id)}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        className="mr-2"
                      />
                      {opt.text}
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  className="w-full p-2 rounded bg-gray-600 text-white"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder="Jawaban Anda..."
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
          >
            ✅ Submit Jawaban
          </button>
        </form>
      )}
    </div>
  );
};

export default TestForm;
