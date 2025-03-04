"use client";

import OrderForm from "../components/Orderform";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function OrderPage() {
  const { user } = useAuth();
  const [hasDiscount, setHasDiscount] = useState(false);
  const [hasUsedDiscount, setHasUsedDiscount] = useState(false);

  useEffect(() => {
    const checkDiscountStatus = async () => {
      if (!user) return;

      try {
        const discountDoc = await getDoc(doc(db, "discounts", user.uid));
        const userDoc = await getDoc(doc(db, "users", user.uid));

        setHasDiscount(discountDoc.exists());
        setHasUsedDiscount(userDoc.exists() && userDoc.data().hasUsedDiscount);
      } catch (error) {
        console.error("Error checking discount status:", error);
      }
    };

    checkDiscountStatus();
  }, [user]);

  return (
    <div className="mt-9 min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 fade-in">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Buat Pesanan
        </h2>

        {/* Form Order */}
        <OrderForm />
      </div>
    </div>
  );
}
