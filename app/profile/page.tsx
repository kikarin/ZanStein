"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { updateProfile } from "firebase/auth";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  // Update state saat user data berubah
  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await updateProfile(user, {
        displayName: username,
        photoURL: photoURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        displayName: username,
        photoURL: photoURL,
        email: user.email,
        updatedAt: new Date(),
      });

      router.push("/");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200 mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center">Edit Profile</h2>
      
      <div className="flex flex-col items-center mt-6">
        {photoURL ? (
          <motion.div whileHover={{ scale: 1.1 }}>
            <Image
              src={photoURL}
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full border-4 border-accent"
              unoptimized
            />
          </motion.div>
        ) : (
          <motion.div 
            className="w-24 h-24 rounded-full border-4 border-gray-300 bg-gray-100 flex items-center justify-center text-gray-600 text-2xl font-bold"
            whileHover={{ scale: 1.1 }}
          >
            {username.charAt(0)}
          </motion.div>
        )}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      <motion.button
  onClick={handleSaveProfile}
  className="mt-6 w-full p-3 text-lg font-medium text-gray-900 rounded-lg bg-gradient-to-r from-sky-50 to-sky-100 hover shadow-lg hover:shadow-accent/50 transition-all duration-300 relative overflow-hidden"
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.95 }}
>
  <span className="relative z-10">Simpan</span>
  {/* Efek glow */}
  <span className="absolute inset-0 bg-accent opacity-20 blur-lg"></span>
</motion.button>

    </motion.div>
  );
}
