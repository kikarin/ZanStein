"use client";

import { auth, googleProvider, db } from "../../lib/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Cek Role User (Admin atau Biasa)
  const checkUserRole = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const role = userDoc.data().role || "user";
        router.push(role === "admin" ? "/adminzan" : "/");
      } else {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Gagal mengecek role:", error);
    }
  };

  // 🔹 Login dengan Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await checkUserRole(result.user.uid);
    } catch (error) {
      console.error("Login gagal:", error);
      setError("Gagal login dengan Google. Silakan coba lagi.");
    }
  };

  // 🔹 Login dengan Email & Password
  const loginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await checkUserRole(result.user.uid);
    } catch (error: unknown) {
      console.error("Login gagal:", error);
      
      if (error instanceof Error && "code" in error) {
        const err = error as { code: string };
        if (err.code === "auth/invalid-credential") {
          setError("Email atau password salah. Silakan coba lagi.");
        } else if (err.code === "auth/user-not-found") {
          setError("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
        } else {
          setError("Terjadi kesalahan. Silakan coba lagi.");
        }
      } else {
        setError("Terjadi kesalahan yang tidak terduga.");
      }
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-md w-full p-8 border border-gray-300 backdrop-blur-md rounded-xl shadow-lg bg-white/80"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Masuk ke Akun
        </h2>

        {/* Form Login Email */}
        <form onSubmit={loginWithEmail} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-500 text-red-600 p-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Input Email */}
          <div className="flex items-center gap-3 border border-gray-300 bg-white rounded-lg px-4 py-3 focus-within:border-blue-500">
            <FiMail className="text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Tombol Login */}
          <button type="submit" className="btn-primary w-full hover:shadow-lg transition">
            Login
          </button>
        </form>

        {/* Garis Pemisah */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-400"></div>
          <p className="mx-4 text-gray-500">atau</p>
          <div className="flex-1 border-t border-gray-400"></div>
        </div>

        {/* Login dengan Google */}
        <button
          onClick={loginWithGoogle}
          className="btn-secondary w-full flex items-center justify-center gap-3 py-3 hover:shadow-lg transition"
        >
          <FcGoogle size={22} />
          <span>Masuk dengan Google</span>
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
