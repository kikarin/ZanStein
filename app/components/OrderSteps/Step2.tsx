"use client";

import { useState } from "react";
import { OrderData } from "../../../lib/types/order";
import { motion } from "framer-motion";
import { FiMonitor, FiSmartphone, FiGlobe,  } from "react-icons/fi";

interface Step2Props {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const platforms = [
  { id: "Web", icon: <FiMonitor />, title: "Website", description: "Aplikasi berbasis web" },
  { id: "Mobile", icon: <FiSmartphone />, title: "Mobile App", description: "Aplikasi Android/iOS" },
  { id: "Multiplatform", icon: <FiGlobe />, title: "Multiplatform", description: "Web & Mobile" },
];

const applicationTypes = [
  { id: "Company Profile", label: "Company Profile" },
  { id: "E-Commerce", label: "E-Commerce" },
  { id: "Sistem Manajemen", label: "Sistem Manajemen" },
  { id: "Social Media", label: "Social Media App" },
  { id: "Reservasi", label: "Aplikasi Pemesanan / Reservasi" },
  { id: "Custom", label: "Custom" },
  { id: "Rekomendasi", label: "Minta Rekomendasi" },
];

const Step2 = ({ orderData, updateOrderData, }: Step2Props) => {
  const [customAppType, setCustomAppType] = useState(orderData.customApplicationType || "");



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
          Detail Proyek
        </h2>
        <p className="text-gray-600 mt-2">Tentukan platform dan jenis aplikasi</p>
      </div>

      {/* Platform Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-secondary">Platform:</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <motion.button
              key={platform.id}
              onClick={() => updateOrderData({ platform: platform.id as "Web" | "Mobile" | "Multiplatform" })}
              className={`p-4 rounded-xl glass-card transition-all flex flex-col items-center gap-2 ${
                orderData.platform === platform.id ? "border-2 border-primary bg-primary/5" : "hover:scale-105"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`p-3 rounded-lg ${orderData.platform === platform.id ? "bg-primary text-white" : "bg-gray-100 text-secondary"}`}>
                {platform.icon}
              </div>
              <h3 className={`font-medium ${orderData.platform === platform.id ? "text-primary" : "text-secondary"}`}>{platform.title}</h3>
              <p className="text-sm text-gray-500">{platform.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary">Nama Proyek:</label>
        <input
          type="text"
          value={orderData.projectName}
          onChange={(e) => updateOrderData({ projectName: e.target.value })}
          className="w-full px-4 py-3 rounded-lg glass-card focus:ring-2 focus:ring-primary transition-all"
          placeholder="Masukkan nama proyek..."
        />
      </div>

      {/* Application Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary">Jenis Aplikasi:</label>
        <select
          value={orderData.applicationType}
          onChange={(e) => {
            const value = e.target.value;
            updateOrderData({ applicationType: value });
            if (value !== "Custom") {
              updateOrderData({ customApplicationType: "" });
              setCustomAppType("");
            }
          }}
          className="w-full px-4 py-3 rounded-lg glass-card focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="">Pilih Jenis Aplikasi</option>
          {applicationTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Custom Type Input */}
        {orderData.applicationType === "Custom" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <label className="block text-sm font-medium text-secondary mb-2">Tulis Jenis Aplikasi:</label>
            <input
              type="text"
              value={customAppType}
              onChange={(e) => {
                setCustomAppType(e.target.value);
                updateOrderData({ customApplicationType: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-lg glass-card focus:ring-2 focus:ring-primary transition-all"
              placeholder="Masukkan jenis aplikasi..."
            />
          </motion.div>
        )}

        {/* "Mimin Ganteng" Note */}
        {orderData.applicationType === "Rekomendasi" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="mt-2 text-yellow-600 italic flex items-center gap-2"
          >
            <span className="animate-bounce">💡</span>
            Nanti konsultasi bareng <span className="font-bold text-primary">mimin ganteng</span> ya! 😆
          </motion.p>
        )}
      </div>
      {/* Reference Link */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary">
          Link Referensi (Opsional):
        </label>
        <input
          type="text"
          value={orderData.referenceLink}
          onChange={(e) => updateOrderData({ referenceLink: e.target.value })}
          className="w-full px-4 py-3 rounded-lg glass-card focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="Masukkan link referensi jika ada..."
        />
      </div>

    </motion.div>
  );
};

export default Step2;
