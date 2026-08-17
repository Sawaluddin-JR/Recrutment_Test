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

      console.log("responsenih"+response.data)

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
    <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-white text-center mb-2">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Username</label>
          <input
            type="text" // ubah jadi text, agar tidak wajib format email
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {buttonText}
        </button>
      </form>
      <p className="text-center text-gray-400 mt-4">
        Don't have an account?{" "}
        <button
          onClick={onRegisterClick}
          className="text-blue-500 hover:underline font-semibold"
          type="button"
        >
          Register Here
        </button>
      </p>
    </div>
  )
}

export default LoginForm
