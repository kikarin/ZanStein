"use client";

import { auth, db } from "../../lib/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { username, email, password, confirmPassword } = formData;

    if (username.length < 3) {
      setError("Username harus minimal 3 karakter.");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format email tidak valid.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: username,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        createdAt: new Date(),
        photoURL: null,
      });

      router.push("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar.");
      } else {
        setError("Terjadi kesalahan saat registrasi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 mt-7">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-md w-full p-8 border border-gray-300 backdrop-blur-md rounded-xl shadow-lg bg-white/80"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Daftar Akun Baru
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-500 text-red-600 p-3 rounded-lg text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Username */}
          <div className="flex items-center gap-3 border border-gray-300 bg-white rounded-lg px-4 py-3 focus-within:border-blue-500">
            <FiUser className="text-gray-400" size={20} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none"
              placeholder="Masukkan username"
            />
          </div>

          {/* Input Email */}
          <div className="flex items-center gap-3 border border-gray-300 bg-white rounded-lg px-4 py-3 focus-within:border-blue-500">
            <FiMail className="text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none"
              placeholder="Masukkan email"
            />
          </div>

          {/* Input Password */}
          <div className="flex items-center gap-3 border border-gray-300 bg-white rounded-lg px-4 py-3 focus-within:border-blue-500">
            <FiLock className="text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none"
              placeholder="Masukkan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Input Konfirmasi Password */}
          <div className="flex items-center gap-3 border border-gray-300 bg-white rounded-lg px-4 py-3 focus-within:border-blue-500">
            <FiLock className="text-gray-400" size={20} />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none"
              placeholder="Konfirmasi password"
            />
          </div>

          {/* Tombol Register */}
          <button
            type="submit"
            className="btn-primary w-full hover:shadow-lg transition"
            disabled={loading}
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        {/* Garis Pemisah */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-400"></div>
          <p className="mx-4 text-gray-500">atau</p>
          <div className="flex-1 border-t border-gray-400"></div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
