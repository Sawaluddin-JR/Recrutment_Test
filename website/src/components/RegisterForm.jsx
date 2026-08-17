import React, { useState, useEffect } from "react";

const RegisterForm = ({ title, subtitle, buttonText, darkMode, onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email) {
      alert("Masukkan email terlebih dahulu.");
      return;
    }
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
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, role, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Failed to register: " + (errorData.message || "Unknown error"));
        return;
      }

      alert("Register successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert("Network error");
    }
  };

  const bgCard = darkMode ? "bg-gray-900" : "bg-white";
  const textMain = darkMode ? "text-white" : "text-gray-900";
  const textSub = darkMode ? "text-gray-400" : "text-gray-600";
  const inputBg = darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-black border-gray-300";
  const label = darkMode ? "text-gray-400" : "text-gray-700";

  return (
    <div className={`${bgCard} p-8 rounded-2xl shadow-2xl w-full max-w-md`}>
      <h2 className={`text-3xl font-bold ${textMain} text-center mb-2`}>{title}</h2>
      <p className={`${textSub} text-center mb-6`}>{subtitle}</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={`block ${label} text-sm mb-1`}>Username</label>
          <input
            type="text"
            className={`w-full px-4 py-2 rounded-lg ${inputBg} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={`block ${label} text-sm mb-1`}>Email</label>
          <input
            type="email"
            className={`w-full px-4 py-2 rounded-lg ${inputBg} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={`block ${label} text-sm mb-1`}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full px-4 py-2 rounded-lg ${inputBg} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>
        </div>
        <div>
          <label className={`block ${label} text-sm mb-1`}>Confirm Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full px-4 py-2 rounded-lg ${inputBg} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>
        </div>
        <div>
          <label className={`block ${label} text-sm mb-1`}>Role</label>
          <select
            className={`w-full px-4 py-2 rounded-lg ${inputBg} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            {/* <option value="MODERATOR">Moderator</option> */}
          </select>
        </div>
        <div>
          <label className={`block ${label} text-sm mb-1`}>Kode OTP</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan kode OTP"
              className={`flex-1 px-4 py-2 rounded-lg ${inputBg} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={countdown > 0}
              className={`px-3 py-2 rounded-lg text-white font-semibold ${
                countdown > 0 ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {countdown > 0 ? `Tunggu ${countdown}s` : "Generate OTP"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {buttonText}
        </button>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onBackToLogin || (() => window.location.href = "/login")}
            className="text-sm text-blue-500 hover:underline"
          >
            Already have an account? Log in here.
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
