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
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

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
    paymentMethod: undefined,
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
            setOrderData((prev) => ({
              ...prev,
              discount: discountDoc.data().discountPercentage,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [user]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateOrderData = (newData: Partial<OrderData>) => {
    setOrderData((prev) => {
      const updated = { ...prev, ...newData };
      const totalPrice = calculateOrderPrice(updated);
      return { ...updated, totalPrice };
    });
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`relative flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full text-white font-semibold transition-all duration-300
              ${
                step >= stepNumber
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg scale-105"
                  : "bg-gray-300 text-gray-500"
              }
              `}
            >
              {stepNumber}
              {step >= stepNumber && (
                <motion.span
                  className="absolute w-12 sm:w-14 h-12 sm:h-14 bg-blue-500/30 rounded-full -z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
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
      <div className="glass-card p-4 sm:p-8 rounded-2xl border border-gray-200/50 shadow-soft">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <Step1
                orderData={orderData}
                updateOrderData={updateOrderData}
                nextStep={nextStep}
              />
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
              <Step2
                orderData={orderData}
                updateOrderData={updateOrderData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
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
              {["A", "B", "C", "D", "E", "F"].includes(
                orderData.projectType
              ) && (
                <Step3B
                  orderData={orderData}
                  updateOrderData={updateOrderData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
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
              className="relative z-[100]"
            >
              <Step4
                orderData={orderData}
                updateOrderData={updateOrderData}
                prevStep={prevStep}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-50">
        <div className="container mx-auto max-w-4xl flex justify-between">
          {step > 1 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={prevStep}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              <FiArrowLeft className="text-lg sm:text-xl" />
              <span className="hidden sm:inline">Kembali</span>
            </motion.button>
          )}
          {step < 4 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={nextStep}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all ml-auto"
            >
              <span className="hidden sm:inline">Lanjut</span>
              <FiArrowRight className="text-lg sm:text-xl" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Add bottom padding to account for fixed navigation */}
      <div className="h-20" />
    </div>
  );
};

export default OrderForm;
