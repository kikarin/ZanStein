"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
          router.push("/adminzan/dashboard");
        } else {
          router.push("/");
        }
      } else {
        router.push("/");
      }
      setLoading(false);
    };
  
    checkAdmin();
  }, [router]); // ✅ Tambahkan router sebagai dependency
  

  if (loading) return <p className="text-center text-gray-400">Memeriksa akses admin...</p>;
  return null;
}
