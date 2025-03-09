"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function VoucherPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [discount, setDiscount] = useState<number | null>(null);
  const [hasUsedDiscount, setHasUsedDiscount] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchDiscountInfo = async () => {
      try {
        // Ambil data diskon dari Firestore
        const discountRef = doc(db, "discounts", user.uid);
        const discountSnap = await getDoc(discountRef);

        // Cek apakah user sudah pakai diskon
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (discountSnap.exists()) {
          setDiscount(discountSnap.data().discountPercentage);
        }

        if (userSnap.exists()) {
          setHasUsedDiscount(userSnap.data().hasUsedDiscount || false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching discount info:", error);
        setLoading(false);
      }
    };

    fetchDiscountInfo();
  }, [user, router]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg text-center shadow-md mt-20">
      <h2 className="text-3xl font-semibold text-primary">Voucher Diskon</h2>

      {loading ? (
        <p className="text-gray-500 mt-4">Memuat voucher...</p>
      ) : discount !== null ? (
        <div className="mt-4 p-6 rounded-lg bg-gray-100 shadow-md transition-all hover:scale-105">
          <div className="flex items-center justify-center gap-2">
            {hasUsedDiscount ? (
              <FaTimesCircle className="text-red-400 text-2xl" />
            ) : (
              <FaCheckCircle className="text-green-400 text-2xl" />
            )}
            <p className="text-lg text-secondary">
              {hasUsedDiscount ? "Voucher Sudah Digunakan" : "Diskon Anda:"}
            </p>
          </div>

          {!hasUsedDiscount ? (
            <>
              <h3 className="text-5xl font-extrabold text-accent">{discount}%</h3>
              <p className="text-gray-500 mt-2">
                Voucher otomatis digunakan saat checkout.
              </p>
              {/* Teks tambahan expired voucher */}
              <p className="text-xs text-red-500 mt-2">
              15 April voucher expired
              </p>
            </>
          ) : (
            <p className="text-yellow-500 mt-2">
              Diskon hanya bisa digunakan satu kali untuk setiap user.
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">
          Anda belum memiliki voucher. Berikan testimoni untuk mendapatkan diskon!
        </p>
      )}
    </div>
  );
}
