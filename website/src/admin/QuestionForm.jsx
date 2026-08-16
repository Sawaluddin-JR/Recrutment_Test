import React, { useEffect, useState } from "react";
import axios from "axios";

const QuestionForm = () => {
  const [form, setForm] = useState({
    content: "",
    type: "MULTIPLE_CHOICE",
    companyId: null,
    companyCode: null,
    questionCode: "UMUM", // ✅ default UMUM
    options: [
      { text: "", correct: false },
      { text: "", correct: false },
    ],
    correctAnswer: "",
  });

  const [userCompany, setUserCompany] = useState(null);
  const [userId, setUserId] = useState(null);
  const [questionCodes, setQuestionCodes] = useState([]);

  // ✅ ambil perusahaan user
  const fetchCompany = async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    setUserId(id);

    try {
      const res = await axios.get(`http://localhost:8080/api/company/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const company = res.data;
      if (company && company.id) {
        setUserCompany(company);
        setForm((prev) => ({ ...prev, companyId: company.id }));
        setForm((prev) => ({ ...prev, companyCode: company.code }));
      } else {
        setUserCompany(null);
        setForm((prev) => ({ ...prev, companyId: null }));
      }
    } catch (err) {
      console.error("❌ Gagal ambil data perusahaan user:", err);
      setUserCompany(null);
      setForm((prev) => ({ ...prev, companyId: null }));
    }
  };

  // ✅ ambil kode soal dari perusahaan
  const fetchQuestionCodes = async (companyCode) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:8080/api/questionscode/company/${companyCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestionCodes(res.data || []);
    } catch (err) {
      console.error("❌ Gagal ambil question code:", err);
      setQuestionCodes([]);
    }
  };


  // ✅ useEffect cuma manggil function
  useEffect(() => {
    fetchCompany();
    // console.log("Cok1");
  }, []);

  // image?
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
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
      companyId: userCompany ? userCompany.id : null,
      createdById: Number(userId),
      questionCode: form.questionCode || "UMUM", // ✅ kirim kode
      options: form.type === "MULTIPLE_CHOICE" ? form.options : undefined,
      correctAnswer: form.type === "ESSAY" ? form.correctAnswer : undefined,
    };
    console.log("Company ID : "+form.companyId)
    console.log("Company ID : "+form.companyCode)
    try {
      await axios.post("http://localhost:8080/api/questions", payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      alert("✅ Soal berhasil ditambahkan!");
      setForm({
        content: "",
        type: "MULTIPLE_CHOICE",
        companyId: userCompany ? userCompany.id : null,
        questionCode: "UMUM",
        options: [
          { text: "", correct: false },
          { text: "", correct: false },
        ],
        correctAnswer: "",
      });
    } catch (err) {
      console.error("❌ Gagal menambahkan soal:", err);
      alert("Gagal menambahkan soal.");
      
      // alert("✅ Soal berhasil ditambahkan!");
      // setForm({
      //   content: "",
      //   type: "MULTIPLE_CHOICE",
      //   companyId: userCompany ? userCompany.id : null,
      //   questionCode: "UMUM",
      //   options: [
      //     { text: "", correct: false },
      //     { text: "", correct: false },
      //   ],
      //   correctAnswer: "",
      // });
      // setPreview("");
    }
  };


  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">➕ Tambah Soal</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
        {/* Perusahaan */}
        <label className="block text-gray-300">Company :</label>
        <select
          name="companyId"
          value={form.companyId || ""}
          onChange={(e) => {
            const selectedId = e.target.value;

            if (!selectedId) {
              // ✅ PAKAI UMUM (treat seperti company dengan code = "UMUM")
              setForm((prev) => ({
                ...prev,
                companyId: null,
                companyCode: "UMUM",
                questionCode: "UMUM",
              }));
              fetchQuestionCodes("UMUM"); // 🔑 ambil kode soal umum
            } else {
              // ✅ pilih perusahaan user
              setForm((prev) => ({
                ...prev,
                companyId: Number(selectedId),
                companyCode: userCompany.code,
                questionCode: "UMUM", // reset ke default
              }));
              fetchQuestionCodes(userCompany.code);
            }
          }}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="">Umum</option>
          {userCompany && <option value={userCompany.id}>{userCompany.name}</option>}
        </select>
        </div>


        {/* Question Code */}
        <div>
          <label className="block text-gray-300">Kode Soal:</label>
          <select
            name="questionCode"
            value={form.questionCode}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="UMUM">UMUM</option>
            {questionCodes.map((qc) => (
              <option key={qc.id} value={qc.code}>
                {qc.code} - {qc.title}
              </option>
            ))}
          </select>
        </div>

        {/* Isi Soal */}
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
        {/* image */}
        {/* <div>
          <label>Upload Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
          />

          {preview && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={preview}
                alt="preview"
                style={{ width: "200px", borderRadius: "8px" }}
              />
            </div>
          )}
        </div> */}
        {/* Tipe Soal */}
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

        {/* Pilihan Ganda */}
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

        {/* Essay */}
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
          Simpan Soal
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
