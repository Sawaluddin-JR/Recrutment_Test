import React, { useState } from "react";

const HalamanTesPelamar = () => {
  const [jawaban, setJawaban] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Jawaban dikirim: ${jawaban}`);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">🖊️ Tes untuk Pelamar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="mb-2 font-semibold">
          Soal: Apa ibukota Indonesia?
        </p>
        <input
          type="text"
          value={jawaban}
          onChange={(e) => setJawaban(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          placeholder="Tulis jawaban Anda"
          required
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Kirim Jawaban
        </button>
      </form>
    </div>
  );
};

export default HalamanTesPelamar;
