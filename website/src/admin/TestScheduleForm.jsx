import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const TestScheduleForm = () => {
  const [company, setCompany] = useState(null);
  const [questionCodes, setQuestionCodes] = useState([]); // simpan list question code
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    questionCode: "",
    codeTest: "",
    companyId: "",
    startTime: "",
    endTime: "",
  });

  const [message, setMessage] = useState("");

  // Ambil perusahaan user
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");
        if (!token || !userId) return;

        const res = await axios.get(`http://localhost:8080/api/company/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) setCompany(res.data);
      } catch (err) {
        console.error("Error cek perusahaan:", err);
      }
    };
    fetchCompany();
  }, []);

  // Ambil semua question code (UMUM + perusahaan)
  useEffect(() => {
    const fetchQuestionCodes = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = "http://localhost:8080/api/questionscode";

        // kalau user punya perusahaan => ambil umum + by company
        if (company?.code) {
          url += `?companyCode=${company.code}&includeGeneral=true`;
        } else {
          url += `?includeGeneral=true`;
        }

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestionCodes(res.data);
      } catch (err) {
        console.error("Gagal ambil question codes:", err);
      }
    };

    fetchQuestionCodes();
  }, [company]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("Form Cokkkkk : ", form);
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:8080/api/schedules", form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Jadwal berhasil ditambahkan.");
      setForm({
        title: "",
        questionCode: "",
        codeTest: "",
        companyId: "",
        startTime: "",
        endTime: "",
      });
      navigate("/home/admin/schedule"); // <-- arahkan kembali ke halaman profile
    } catch (err) {
      console.error(err);
      setMessage("❌ Gagal menambahkan jadwal.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Tambah Jadwal Tes
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
        <div>
          <label className="block mb-1 font-medium">Judul Tes</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
          />
        </div>

        {/* Dropdown QuestionCode */}
        <div>
          <label className="block mb-1 font-medium">Kode Soal</label>
          <select
            name="questionCode"
            value={form.questionCode}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
          >
            <option value="">-- Pilih Kode Soal --</option>
            {questionCodes.map((qc) => (
              <option key={qc.code} value={qc.code}>
                {qc.code} - {qc.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Kode Tes</label>
          <input
            type="text"
            name="codeTest"
            value={form.codeTest}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">ID Perusahaan</label>
          <select
            name="companyId"
            value={form.companyId}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
          >
            <option value="UMUM">UMUM</option>
            {company && <option value={company.id}>{company.code}</option>}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Waktu Mulai</label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Waktu Selesai</label>
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          Simpan Jadwal
        </button>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default TestScheduleForm;
