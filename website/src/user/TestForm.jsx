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
  // const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); // 2 jam (dalam detik)
  // const [timeLeft, setTimeLeft] = useState(1 * 1 * 60); // 1 jam (dalam detik)
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 menit (dalam detik)

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
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");

    return `${m}:${s}`;
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
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
      <div className="flex justify-end items-center mb-6">
        {!showResult && (
          <div className="flex items-center gap-2 bg-gray-900/80 border border-yellow-500/30 px-4 py-2 rounded-xl text-yellow-300 font-mono shadow">
            <span className="text-lg">⏳</span>
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* {showResult ? (
        <div className="p-6 bg-gray-700 rounded">
          <h3 className="text-xl font-bold mb-4">📊 Hasil Tes</h3>
          <p className="mb-2">Total Soal: {resultDetail?.totalQuestions}</p>
          <p className="mb-2">Jawaban Benar: {resultDetail?.correctAnswers}</p>
          <p className="mb-2">Nilai: {resultDetail?.score}</p>
          <p className="mb-2">Status: {resultDetail?.status}</p>
        </div>
      ) : questions.length === 0 ? (
        <p className="text-gray-400">⏳ Soal belum tersedia...</p> */}

      {showResult ? (
        /* ================= HASIL TES ================= */
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 border border-gray-600">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Tes Selesai!
            </h3>

            <p className="text-gray-400">
              Terima kasih sudah menyelesaikan tes. Berikut hasil yang kamu peroleh.
            </p>
          </div>

          {/* Score */}
          <div className="bg-gray-900 rounded-2xl p-6 text-center mb-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">
              Nilai Akhir
            </p>

            <div className="text-5xl font-extrabold text-yellow-400 mb-2">
              {resultDetail?.score * 10 ?? 0}
            </div>

            <div className="text-sm text-gray-500">
              dari 100
            </div>
          </div>

          {/* Statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

            {/* Total Soal */}
            <div className="bg-gray-900/70 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  📝
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Total Soal
                  </p>

                  <p className="text-xl font-bold text-white">
                    {resultDetail?.totalQuestions ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Jawaban Benar */}
            <div className="bg-gray-900/70 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  ✅
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Jawaban Benar
                  </p>

                  <p className="text-xl font-bold text-green-400">
                    {resultDetail?.correctAnswers ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-900/70 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  🏆
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <p className="text-lg font-bold text-white">
                    {resultDetail?.status || "-"}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Progress */}
          <div className="bg-gray-900/70 rounded-xl p-5 border border-gray-700">

            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">
                Tingkat Ketepatan
              </span>

              <span className="text-sm font-semibold text-white">
                {resultDetail?.totalQuestions
                  ? Math.round(
                    (resultDetail.correctAnswers /
                      resultDetail.totalQuestions) *
                    100
                  )
                  : 0}
                %
              </span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${resultDetail?.totalQuestions
                      ? Math.round(
                        (resultDetail.correctAnswers /
                          resultDetail.totalQuestions) *
                        100
                      )
                      : 0
                    }%`,
                }}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              📌 Hasil tes kamu telah berhasil disimpan.
            </p>
          </div>

        </div>

      ) : questions.length === 0 ? (

        /* ================= BELUM ADA SOAL ================= */
        <div className="flex flex-col items-center justify-center py-16 text-center">

          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
            <span className="text-3xl animate-pulse">
              ⏳
            </span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">
            Menyiapkan Soal...
          </h3>

          <p className="text-gray-400 text-sm max-w-md">
            Soal sedang dipersiapkan. Mohon tunggu sebentar sebelum memulai tes.
          </p>

        </div>
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
