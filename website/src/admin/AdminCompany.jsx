import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminCompany() {
  const [company, setCompany] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [formData, setFormData] = useState({ code: "", name: "", description: "", createdByUserId: "" });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const navigate = useNavigate();

  useEffect(() => {
  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      if (!token || !userId) {
        console.error("User belum login");
        return;
      }

      const res = await axios.get(`http://localhost:8080/api/company/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        setCompany(res.data); // user sudah punya perusahaan
        // console.log("company : ",res.data.name)
      } else {
        setCompany(null); // user belum punya perusahaan
      }
    } catch (err) {
      console.error("Error cek perusahaan:", err);
      setCompany(null);
    }
  };

  fetchCompany();
}, []);


  const handleCreateCompany = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("Token : " + token);
    formData.createdByUserId = localStorage.getItem("id");
    
    console.log("Id user : " + formData.createdByUserId);

    try {
      await axios.post("http://localhost:8080/api/company", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessageType("success");
      // setMessage("✅ Perusahaan berhasil dibuat.");
      alert("✅ Perusahaan berhasil dibuat.");
      navigate("/home/admin/profile"); // <-- arahkan kembali ke halaman profile
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("❌ Gagal membuat perusahaan.");
    }
  };

  const handleJoinCompany = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  try {
    // Cek apakah company dengan kode ini ada
    const checkRes = await axios.get(
      `http://localhost:8080/api/company/code/${formData.code}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!checkRes.data) {
      setMessageType("error");
      setMessage("❌ Perusahaan tidak ditemukan.");
      return;
    }

    // Kalau ada, kirim request join
    const joinRes = await axios.post(
      `http://localhost:8080/api/company/join`,
      {
        userId: userId,
        companyCode: formData.code,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setCompany(joinRes.data); // Update state
    setShowJoinForm(false);
    setMessageType("success");
    setMessage("✅ Berhasil bergabung ke perusahaan.");
  } catch (err) {
    console.error("Gagal join perusahaan:", err);
    setMessageType("error");
    setMessage("❌ Gagal bergabung ke perusahaan.");
  }
};


  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {!company ? (
        <div className="max-w-lg mx-auto bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Company Menu</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setShowCreateForm(true);
                setShowJoinForm(false);
                setMessage("");
              }}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold"
            >
              Create Company
            </button>
            <button
              onClick={() => {
                setShowJoinForm(true);
                setShowCreateForm(false);
                setMessage("");
              }}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold"
            >
              Join Company
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateCompany} className="mt-6 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Code"
                className="p-2 rounded bg-gray-700 border border-gray-600"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
              <input
                type="text"
                placeholder="Name"
                className="p-2 rounded bg-gray-700 border border-gray-600"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="p-2 rounded bg-gray-700 border border-gray-600"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg font-semibold"
              >
                Create
              </button>

              {message && (
                <div
                  className={`mt-4 p-2 rounded ${
                    messageType === "success" ? "bg-green-600" : "bg-red-600"
                  } text-white`}
                >
                  {message}
                </div>
              )}
            </form>
          )}

          {showJoinForm && (
            <form onSubmit={handleJoinCompany} className="mt-6 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Company Code"
                className="p-2 rounded bg-gray-700 border border-gray-600"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg font-semibold"
              >
                Join
              </button>

              {message && (
                <div
                  className={`mt-4 p-2 rounded ${
                    messageType === "success" ? "bg-green-600" : "bg-red-600"
                  } text-white`}
                >
                  {message}
                </div>
              )}
            </form>
          )}
        </div>
      ) : (
        // luu tambahan disini
        <div className="max-w-lg mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-xl">🏢</span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">My Company</h2>
            <p className="text-sm text-gray-400">Company Information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Company Code
            </p>
            <p className="text-white font-semibold">
              {company.code}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Company Name
            </p>
            <p className="text-white font-semibold">
              {company.name}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-gray-300 leading-relaxed">
              {company.description || "No description available"}
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
