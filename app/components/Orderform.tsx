"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { OrderData } from "../../lib/types/order";
import { calculateOrderPrice } from "../../lib/utils/priceCalculator";
import Step1 from "./OrderSteps/Step1";
import Step2 from "./OrderSteps/Step2";
import Step3B from "./OrderSteps/Step3B";
import Step4 from "./OrderSteps/Step4";
import { motion, AnimatePresence } from "framer-motion";

const OrderForm = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [, setHasUsedDiscount] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    projectType: "",
    projectName: "",
    platform: "",
    applicationType: "",
    customerName: user?.displayName || "",
    whatsappNumber: "",
    paymentMethod: undefined
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;
      
      try {
        const discountDoc = await getDoc(doc(db, "discounts", user.uid));
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (discountDoc.exists() && userDoc.exists()) {
          const hasUsed = userDoc.data().hasUsedDiscount || false;
          setHasUsedDiscount(hasUsed);
          
          if (!hasUsed) {
            setOrderData(prev => ({
              ...prev,
              discount: discountDoc.data().discountPercentage
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [user]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const updateOrderData = (newData: Partial<OrderData>) => {
    setOrderData(prev => {
      const updated = { ...prev, ...newData };
      const totalPrice = calculateOrderPrice(updated);
      return { ...updated, totalPrice };
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold transition-all duration-300
              ${step >= stepNumber ? "bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg scale-105" : "bg-gray-300 text-gray-500"}
              `}
            >
              {stepNumber}
              {step >= stepNumber && (
                <motion.span
                  className="absolute w-14 h-14 bg-blue-500/30 rounded-full -z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-dark"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          />
        </div>
      </div>

      {/* Order Steps */}
      <div className="glass-card p-8 rounded-2xl border border-gray-200/50 shadow-soft">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <Step1 orderData={orderData} updateOrderData={updateOrderData} nextStep={nextStep} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <Step2 orderData={orderData} updateOrderData={updateOrderData} nextStep={nextStep} prevStep={prevStep} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {(orderData.projectType === "B" || orderData.projectType === "C") && (
                <Step3B orderData={orderData} updateOrderData={updateOrderData} nextStep={nextStep} prevStep={prevStep} />
              )}
            </motion.div>
          )}
{step === 4 && (
  <motion.div
    key="step4"
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    transition={{ duration: 0.3 }}
    className="relative z-[100]" // Menjadikan Step4 paling depan
  >
    <Step4 orderData={orderData} updateOrderData={updateOrderData} prevStep={prevStep} />
  </motion.div>
)}

        </AnimatePresence>
      </div>

{/* Navigation Buttons */}
<div className="mt-6 flex justify-between relative z-0">
  {step > 1 && (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="btn-secondary relative z-[1]" // Pastikan tombol Kembali tidak lebih tinggi dari Step4
      onClick={prevStep}
    >
      ⬅️ Kembali
    </motion.button>
  )}
  {step < 4 && (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      className="btn-primary relative z-[1]" // Pastikan tombol Lanjut tidak menutupi Step4
      onClick={nextStep}
    >
      Lanjut ➡️
    </motion.button>
  )}
</div>
    </div>
  );
};

export default OrderForm;
