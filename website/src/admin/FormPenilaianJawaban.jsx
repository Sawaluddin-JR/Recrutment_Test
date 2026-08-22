import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormPenilaianJawaban = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [testResult, setTestResult] = useState(null);
  const [jawabanList, setJawabanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Contoh data kandidat
  // const user = {
  //   id: 1,
  //   nama: "Sawaluddin",
  //   email: "sawaluddinsrg472@gmail.com",
  //   posisi: "Backend Developer",
  // };

  // Contoh data jawaban (nanti ambil dari API)
  // const [jawabanList, setJawabanList] = useState([
  //   {
  //     id: 101,
  //     soal: "Jelaskan perbedaan antara PUT dan PATCH dalam REST API!",
  //     jawabanBenar:
  //       "✅ PUT mengganti seluruh resource dengan data baru, sedangkan PATCH hanya mengubah field tertentu.",
  //     jawaban:
  //       "Test 1",
  //     nilai: "",
  //     catatan: "",
  //   },
  //   {
  //     id: 102,
  //     soal: "Bagaimana cara mencegah SQL Injection pada aplikasi back-end?",
  //     jawabanBenar: "✅ Gunakan prepared statement atau parameterized query.",
  //     jawaban:
  //       "Test 2",
  //     nilai: "",
  //     catatan: "",
  //   },
  //   {
  //     id: 103,
  //     soal: "Jelaskan apa yang dimaksud dengan stateless dalam konteks REST API dan mengapa itu penting!",
  //     jawabanBenar:
  //       "✅ Stateless artinya setiap request harus membawa semua data yang dibutuhkan tanpa bergantung pada state server.",
  //     jawaban:
  //       "Stateless berarti server tidak menyimpan state/riwayat dari client antar request.",
  //     nilai: "",
  //     catatan: "",
  //   },
  // ]);

  useEffect(() => {
    fetchTestResult();
  }, [id]);

  const fetchTestResult = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/api/testresult/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      console.log("🔥 TEST RESULT:", data);

      setTestResult(data);

      setJawabanList(
        (data.answers || []).map((answer) => ({
          ...answer,
          score: answer.score ?? "",
          evaluationNote: answer.evaluationNote ?? "",
        }))
      );
    } catch (err) {
      console.error("❌ Gagal mengambil data:", err);
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);

      setError("Gagal mengambil data penilaian.");
    } finally {
      setLoading(false);
    }
  };

  // const handleChange = (id, field, value) => {
  //   setJawabanList((prev) =>
  //     prev.map((j) => (j.id === id ? { ...j, [field]: value } : j))
  //   );
  // };

  const handleChange = (answerId, field, value) => {
    setJawabanList((prev) =>
      prev.map((answer) =>
        answer.id === answerId
          ? {
            ...answer,
            [field]: value,
          }
          : answer
      )
    );
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("📤 Mengirim penilaian:", jawabanList);

  //   try {
  //     // TODO: Panggil API untuk simpan penilaian di BE
  //     // await axios.put(`/api/testresult/{id}`, { ...payload });

  //     alert("✅ Penilaian berhasil disimpan!");
  //     navigate("/hasil-seleksi"); // pindah ke menu hasil seleksi
  //   } catch (err) {
  //     console.error("❌ Gagal simpan penilaian:", err);
  //     alert("Gagal menyimpan penilaian!");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        answers: jawabanList.map((answer) => ({
          id: answer.id,
          score:
            answer.score === "" ? 0 : Number(answer.score),
          evaluationNote: answer.evaluationNote,
        })),
      };

      await axios.put(
        `http://localhost:8080/api/testresult/${id}/answers`,
        payload
      );

      alert("✅ Penilaian berhasil disimpan!");

      navigate("/hasil-seleksi");
    } catch (err) {
      console.error("Gagal menyimpan penilaian:", err);
      alert("❌ Gagal menyimpan penilaian.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl text-white">
        Loading data penilaian...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl text-red-400">
        {error}
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl text-white">
        Data tidak ditemukan.
      </div>
    );
  }

  const candidate = testResult.candidate;

  // return (
  //   <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">

  //     <div className="bg-gray-700 p-4 rounded-xl">
  //       <h1 className="text-xl font-bold mb-2">📝 Penilaian Jawaban</h1>
  //       <p>
  //         <span className="font-semibold">Nama :</span> {user.nama}
  //       </p>
  //       <p>
  //         <span className="font-semibold">Email :</span> {user.email}
  //       </p>
  //       <p>
  //         <span className="font-semibold">Posisi :</span> {user.posisi}
  //       </p>
  //     </div>

  //     {/* Form Penilaian */}
  //     <form onSubmit={handleSubmit} className="space-y-6">
  //       {jawabanList.map((j) => (
  //         <div
  //           key={j.id}
  //           className="bg-gray-700 p-4 rounded-xl shadow space-y-3"
  //         >
  //           <p className="font-semibold">🧾 {j.soal}</p>

  //           {/* Jawaban Benar */}
  //           <div className="bg-green-900 p-3 rounded">
  //             <p className="font-semibold text-green-300">Jawaban Benar</p>
  //             <p>{j.jawabanBenar}</p>
  //           </div>

  //           {/* Jawaban Kandidat */}
  //           <div className="bg-gray-600 p-3 rounded">
  //             <p className="font-semibold text-blue-300">Jawaban Kandidat</p>
  //             <p>{j.jawaban}</p>
  //           </div>

  //           <div>
  //             <label className="block mb-1">Nilai</label>
  //             <input
  //               type="number"
  //               min="0"
  //               max="100"
  //               value={j.nilai}
  //               onChange={(e) => handleChange(j.id, "nilai", e.target.value)}
  //               className="w-full p-2 rounded bg-gray-800 border border-gray-600"
  //               placeholder="Masukkan nilai (0-100)"
  //               required
  //             />
  //           </div>

  //           <div>
  //             <label className="block mb-1">Catatan</label>
  //             <textarea
  //               value={j.catatan}
  //               onChange={(e) => handleChange(j.id, "catatan", e.target.value)}
  //               className="w-full p-2 rounded bg-gray-800 border border-gray-600"
  //               placeholder="Masukkan catatan penilaian..."
  //               rows="2"
  //             />
  //           </div>
  //         </div>
  //       ))}

  //       {/* <button
  //         type="submit"
  //         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
  //       >
  //         💾 Simpan Semua Penilaian
  //       </button> */}
  //     </form>
  //   </div>
  // );

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 text-white">

      {/* Header */}
      <div className="bg-gray-700 p-4 rounded-xl">
        <h1 className="text-xl font-bold mb-3">
          📝 Penilaian Jawaban
        </h1>

        <p>
          <span className="font-semibold">Nama:</span>{" "}
          {candidate?.fullName || "-"}
        </p>

        <p>
          <span className="font-semibold">Email:</span>{" "}
          {candidate?.email || "-"}
        </p>

        <p>
          <span className="font-semibold">Posisi:</span>{" "}
          {candidate?.position || "-"}
        </p>

        <p>
          <span className="font-semibold">Kode Soal:</span>{" "}
          {testResult.questionCode || "-"}
        </p>

        <p>
          <span className="font-semibold">Status:</span>{" "}
          {testResult.status || "-"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {jawabanList.length === 0 ? (
          <div className="bg-gray-700 p-4 rounded-xl">
            Tidak ada jawaban kandidat.
          </div>
        ) : (
          jawabanList.map((j, index) => (
            <div
              key={j.id}
              className="bg-gray-700 p-5 rounded-xl shadow space-y-4"
            >

              {/* Nomor + Soal */}
              <div>
                <p className="font-bold text-lg mb-2">
                  Soal {index + 1}
                </p>

                <p className="text-gray-200">
                  {j.question || "Soal tidak ditemukan"}
                </p>
              </div>

              {/* Jawaban Benar */}
              <div className="bg-green-900 p-3 rounded-lg">
                <p className="font-semibold text-green-300 mb-1">
                  Jawaban Benar
                </p>

                <p>
                  {j.correctAnswer || "Tidak tersedia"}
                </p>
              </div>

              {/* Jawaban Kandidat */}
              <div className="bg-gray-600 p-3 rounded-lg">
                <p className="font-semibold text-blue-300 mb-1">
                  Jawaban Kandidat
                </p>

                <p>
                  {j.answerText || "Tidak ada jawaban"}
                </p>
              </div>

              {/* Nilai */}
              <div>
                <label className="block mb-1 font-semibold">
                  Nilai
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={j.score}
                  onChange={(e) =>
                    handleChange(
                      j.id,
                      "score",
                      e.target.value
                    )
                  }
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="0 - 100"
                  required
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="block mb-1 font-semibold">
                  Catatan
                </label>

                <textarea
                  value={j.evaluationNote}
                  onChange={(e) =>
                    handleChange(
                      j.id,
                      "evaluationNote",
                      e.target.value
                    )
                  }
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Masukkan catatan penilaian..."
                  rows="3"
                />
              </div>

            </div>
          ))
        )}

        {/* Tombol */}
        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => navigate("/home/admin/hasilseleksi")}
            className="bg-gray-600 hover:bg-gray-500 px-5 py-2 rounded-lg"
          >
            Kembali
          </button>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 px-5 py-2 rounded-lg"
          >
            {saving
              ? "Menyimpan..."
              : "💾 Simpan Penilaian"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default FormPenilaianJawaban;
