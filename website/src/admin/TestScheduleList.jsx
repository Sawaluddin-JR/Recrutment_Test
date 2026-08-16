import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function TestScheduleList() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [viewMode, setViewMode] = useState(null); // "view" | "edit" | null

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get("http://localhost:8080/api/schedules", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // patch supaya selalu ada companyId & questionCode untuk update
        const patched = res.data.map((item) => ({
          ...item,
          companyId: item.companyId ?? 1, // default sementara (ganti sesuai ID yang benar)
          questionCode: item.questionCode ?? "UMUM",
        }));
        setSchedules(patched);
      })
      .catch((err) => {
        console.error("Gagal ambil data jadwal tes:", err);
        alert("Gagal memuat jadwal tes");
      })
      .finally(() => setLoading(false));
  };

  const handleView = (item) => {
    setSelectedSchedule(item);
    setViewMode("view");
  };

  const handleEdit = (item) => {
    setSelectedSchedule(item);
    setViewMode("edit");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/api/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Jadwal berhasil dihapus.");
      fetchSchedules();
    } catch (err) {
      console.error("Gagal hapus jadwal:", err);
      alert("Gagal menghapus jadwal.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // pastikan payload lengkap sesuai kebutuhan BE
    const payload = {
      id: selectedSchedule.id,
      codeTest: selectedSchedule.codeTest ?? "DEFAULT_TEST_CODE",
      title: selectedSchedule.title,
      startTime: selectedSchedule.startTime,
      endTime: selectedSchedule.endTime,
      companyId: selectedSchedule.companyId,
      questionCode: selectedSchedule.questionCode,
    };

    try {
      await axios.put(
        `http://localhost:8080/api/schedules/${selectedSchedule.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Jadwal berhasil diperbarui");
      setViewMode(null);
      setSelectedSchedule(null);
      fetchSchedules();
    } catch (err) {
      console.error("Gagal update jadwal:", err);
      alert("Terjadi kesalahan saat update jadwal");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-gray-900 text-gray-100 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Jadwal Tes Kandidat</h2>

      {loading ? (
        <p>Loading...</p>
      ) : schedules.length === 0 ? (
        <p>Tidak ada jadwal.</p>
      ) : (
        <table className="w-full table-auto border border-gray-700">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3 border-b border-gray-700">Judul</th>
              <th className="p-3 border-b border-gray-700">Kode Soal</th>
              <th className="p-3 border-b border-gray-700">Waktu Mulai</th>
              <th className="p-3 border-b border-gray-700">Waktu Selesai</th>
              <th className="p-3 border-b border-gray-700 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((item) => (
              <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                <td className="p-3 border-b border-gray-700">{item.title}</td>
                <td className="p-3 border-b border-gray-700">{item.questionCode}</td>
                <td className="p-3 border-b border-gray-700">
                  {dayjs(item.startTime).format("DD MMM YYYY HH:mm")}
                </td>
                <td className="p-3 border-b border-gray-700">
                  {dayjs(item.endTime).format("DD MMM YYYY HH:mm")}
                </td>
                <td className="p-3 border-b border-gray-700 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleView(item)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      View
                    </button>
                    {/* <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button> */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal View / Edit */}
      {viewMode && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              {viewMode === "view" ? "Detail Jadwal" : "Edit Jadwal"}
            </h3>

            {viewMode === "view" ? (
              <div className="space-y-2">
                <p><b>Judul:</b> {selectedSchedule.title}</p>
                <p><b>Kode Soal:</b> {selectedSchedule.questionCode}</p>
                <p><b>Waktu Mulai:</b> {dayjs(selectedSchedule.startTime).format("DD MMM YYYY HH:mm")}</p>
                <p><b>Waktu Selesai:</b> {dayjs(selectedSchedule.endTime).format("DD MMM YYYY HH:mm")}</p>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-3">
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={selectedSchedule.title}
                  onChange={(e) =>
                    setSelectedSchedule((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                {/* Tambahkan input Kode Soal */}
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={selectedSchedule.questionCode}
                  onChange={(e) =>
                    setSelectedSchedule((prev) => ({
                      ...prev,
                      questionCode: e.target.value,
                    }))
                  }
                />
                <input
                  type="datetime-local"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={dayjs(selectedSchedule.startTime).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) =>
                    setSelectedSchedule((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />
                <input
                  type="datetime-local"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={dayjs(selectedSchedule.endTime).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) =>
                    setSelectedSchedule((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                >
                  Simpan Perubahan
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setViewMode(null);
                setSelectedSchedule(null);
              }}
              className="mt-4 w-full py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
