import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminProfilePassword() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/resend?email=${email}`);
      if (!res.ok) throw new Error("Gagal mengirim kode");
      alert("Kode OTP dikirim ke email.");
      setCountdown(30);
    } catch (err) {
      alert("Gagal kirim OTP: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Password baru tidak sama.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/api/users/${userId}/update-password`,
        { email, otp, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Password berhasil diubah");
      setTimeout(() => {
        navigate("/home/admin/profile");
      }, 1500);

    } catch (err) {
      if (err.response && err.response.status === 400) {
        setMessage("Kode OTP salah.");
      } else {
        setMessage("Gagal memperbarui password.");
      }
    }

  };
  return (
    <div className="max-w-lg mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ganti Password</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block font-medium">Password Baru</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded w-full p-2 pr-20 text-black"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            >
              {showNewPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>
        </div>
        <div>
          <label className="block font-medium">Konfirmasi Password Baru</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded w-full p-2 pr-20 text-black"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            >
              {showConfirmPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>
        </div>
        <div>
          <label className="block font-medium">Kode OTP</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border rounded w-full p-2 text-black"
              required
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={countdown > 0}
              className={`px-3 py-2 rounded text-white font-semibold ${countdown > 0 ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
                }`}
            >
              {countdown > 0 ? `Tunggu ${countdown}s` : "Generate OTP"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Password
        </button>
      </form>
    </div>
  );
}

