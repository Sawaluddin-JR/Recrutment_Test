import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ title, buttonText, onRegisterClick }) => {
  const [identifier, setIdentifier] = useState("") // email atau username
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        identifier, // kirim sebagai "identifier"
        password,
      })

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("identifier", identifier);

      console.log("responsenih" + response.data)

      // Arahkan langsung berdasarkan role
      if (response.data.role === "ADMIN") {
        window.location.href = "/home/admin";
      } else if (response.data.role === "MODERATOR") {
        window.location.href = "/home/moderator";
      } else if (response.data.role === "USER") {
        window.location.href = "/home/user";
      } else {
        alert("Role tidak dikenali. Silakan  hubungi admin.");
      }
    } catch (error) {
      alert("Login gagal. Cek email atau password.")
      console.error(error)
    }
  }

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
          <span className="text-2xl">🔐</span>
        </div>

        <h2 className="text-3xl font-bold text-white">
          {title}
        </h2>

        <p className="text-gray-400 text-sm mt-2">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Username
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              👤
            </span>

            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 text-white
                       border border-gray-700
                       placeholder-gray-500
                       focus:outline-none focus:border-blue-500
                       focus:ring-2 focus:ring-blue-500/20
                       transition"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Masukkan username"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Password
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              🔒
            </span>

            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-20 py-3 rounded-xl bg-gray-800 text-white
                       border border-gray-700
                       placeholder-gray-500
                       focus:outline-none focus:border-blue-500
                       focus:ring-2 focus:ring-blue-500/20
                       transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2
                       text-sm text-blue-400 hover:text-blue-300
                       transition"
            >
              {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl
                   bg-blue-600 hover:bg-blue-700
                   active:scale-[0.98]
                   text-white font-semibold
                   shadow-lg shadow-blue-600/20
                   transition-all duration-200"
        >
          {buttonText}
        </button>
      </form>

      {/* Register */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-700"></div>
        <span className="text-xs text-gray-500">ATAU</span>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>

      <p className="text-center text-gray-400 text-sm">
        Belum punya akun?{" "}
        <button
          onClick={onRegisterClick}
          className="text-blue-400 hover:text-blue-300
                   hover:underline font-semibold transition"
          type="button"
        >
          Register di sini
        </button>
      </p>
    </div>
  );
}

export default LoginForm
