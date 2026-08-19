import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";

const UserTakeTest = () => {
  const [testCode, setTestCode] = useState("");
  const [testInfo, setTestInfo] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {

      console.log("code: " + testCode);
      const response = await axios.get(`http://localhost:8080/api/schedules/${testCode}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setTestInfo(response.data);
      // console.log("ISinya coy:",response.data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat mengambil data tes.";
      setError(message);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded shadow-md">
      <div className="mb-6">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-white">
            🎯 Ikuti Tes
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Masukkan kode tes untuk memulai proses seleksi.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/80 border border-gray-700 rounded-2xl p-4 sm:p-5 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔑
              </span>

              <input
                type="text"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                placeholder="Contoh: JAVA-002"
                className="
            w-full
            bg-gray-900
            border border-gray-700
            text-white
            placeholder-gray-500
            rounded-xl
            pl-11 pr-4 py-3
            outline-none
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
            transition
          "
                required
              />
            </div>

            <button
              type="submit"
              className="
          bg-blue-600
          hover:bg-blue-500
          text-white
          font-semibold
          px-6
          py-3
          rounded-xl
          transition
          flex items-center justify-center gap-2
          shadow-lg shadow-blue-600/20
        "
            >
              🔍
              Cek Tes
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-2">
          ❌ {error}
        </div>
      )}

      {testInfo?.length > 0 ? (
        <div className="bg-gray-700 p-4 rounded mt-4">
          <h3 className="text-lg font-bold mb-2">📄 Detail Tes</h3>
          <p><strong>Nama Tes:</strong> {testInfo[0]?.title ?? "Tidak tersedia"}</p>
          <p><strong>Perusahaan:</strong> {testInfo[0]?.company ?? "Tidak tersedia"}</p>
          <p>
            <strong>Deadline:</strong>{" "}
            {testInfo[0]?.endTime
              ? new Date(testInfo[0].endTime).toLocaleString("id-ID")
              : "Tidak tersedia"}
          </p>

          {(() => {
            const now = new Date();
            const endTime = testInfo[0]?.endTime
              ? new Date(testInfo[0].endTime)
              : null;
            const isExpired = endTime && now > endTime;

            return (
              <button
                className={`mt-4 px-3 py-1 rounded text-sm ${isExpired
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                  }`}
                onClick={() => {
                  if (isExpired) {
                    alert("⏳ Waktu tes sudah berakhir. Kamu tidak bisa mengikuti tes ini.");
                    return;
                  }
                  navigate("/home/user/test", {
                    state: { code: testInfo[0]?.questionCode },
                  });
                }}
                disabled={!testInfo[0]?.questionCode || isExpired}
              >
                {isExpired ? "⏳ Tes Berakhir" : "🚀 Ikuti Tes"}
              </button>
            );
          })()}
        </div>
      ) : (
        <p className="text-gray-400 mt-4">Tidak ada jadwal tes tersedia.</p>
      )}

    </div>
  );
};

export default UserTakeTest;