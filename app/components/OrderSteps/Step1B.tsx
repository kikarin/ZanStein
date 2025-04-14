"use client";

import { motion } from "framer-motion";
import { FiLayers, FiCode } from "react-icons/fi";
import { OrderData } from "../../../lib/types/order";

interface Step1BProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Step1B = ({ orderData, updateOrderData, nextStep, prevStep }: Step1BProps) => {
  const handleSelect = (value: string) => {
    updateOrderData({ projectType: "Statis", frameworkType: value });
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[80vh] p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-4xl font-extrabold text-primary drop-shadow-md">
          Pilih Teknologi untuk Statis
        </h2>
        <p className="text-gray-600 text-lg mt-2">
          Apakah proyek statis Anda menggunakan framework atau tidak?
        </p>
      </motion.div>

      {/* Pilihan */}
      <div className="grid gap-6 mt-8 w-full max-w-lg">
        <motion.button
          onClick={() => handleSelect("Framework")}
          className={`flex items-center gap-4 p-6 bg-white/50 backdrop-blur-md rounded-lg shadow-md border border-gray-200 transition-all hover:scale-105 hover:shadow-lg ${
            orderData.frameworkType === "Framework" ? "border-blue-500 shadow-md" : ""
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
            <FiLayers className="text-3xl" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-800">Framework</h3>
            <p className="text-sm text-gray-600">
              Menggunakan teknologi modern seperti Next.js, React, Vue, atau lainnya.
            </p>
          </div>
        </motion.button>

        <motion.button
          onClick={() => handleSelect("Non-Framework")}
          className={`flex items-center gap-4 p-6 bg-white/50 backdrop-blur-md rounded-lg shadow-md border border-gray-200 transition-all hover:scale-105 hover:shadow-lg ${
            orderData.frameworkType === "Non-Framework" ? "border-green-500 shadow-md" : ""
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="p-4 bg-green-100 text-green-600 rounded-lg">
            <FiCode className="text-3xl" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-800">Non-Framework</h3>
            <p className="text-sm text-gray-600">
              Menggunakan HTML, CSS, dan JavaScript murni tanpa framework.
            </p>
          </div>
        </motion.button>
      </div>

      {/* Tombol Kembali */}
      <div className="flex justify-center mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
        >
          <span>🔙 Kembali</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Step1B;
