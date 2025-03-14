"use client";

import { OrderData } from "../../../lib/types/order";
import { motion } from "framer-motion";
import {
  FiAward, FiBriefcase, FiBook, FiSearch, FiEdit, FiTarget
  
} from "react-icons/fi";

interface Step1Props {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  nextStep: () => void;
}

const projectTypes = [
  {
    id: "A",
    title: "Skripsi / Tugas Akhir",
    icon: <FiBook className="text-2xl" />,
    description: "Proyek untuk skripsi atau tugas akhir di perguruan tinggi.",
  },
  {
    id: "B",
    title: "Ujikom (Ujian Kompetensi)",
    icon: <FiAward className="text-2xl" />,
    description: "Proyek untuk ujian kompetensi sekolah atau institusi pendidikan.",
  },
  {
    id: "C",
    title: "Sidang PKL",
    icon: <FiBriefcase className="text-2xl" />,
    description: "Proyek untuk presentasi sidang Praktik Kerja Lapangan.",
  },
  {
    id: "D",
    title: "Riset / Penelitian",
    icon: <FiSearch className="text-2xl" />,
    description: "Website atau sistem yang digunakan untuk mendukung penelitian akademik atau ilmiah.",
  },
  {
    id: "E",
    title: "Tugas Sekolah / Kuliah",
    icon: <FiEdit className="text-2xl" />,
    description: "Proyek untuk tugas mata kuliah atau tugas besar di sekolah/universitas.",
  },
  {
    id: "F",
    title: "Olimpiade / Kompetisi",
    icon: <FiTarget className="text-2xl" />,
    description: "Proyek khusus untuk perlombaan atau olimpiade IT & coding.",
  },
];

const Step1 = ({ orderData, updateOrderData, nextStep }: Step1Props) => {
  const handleSelect = (value: "B" | "C") => {
    updateOrderData({ projectType: value });
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary">Pilih Jenis Proyek</h2>
        <p className="text-secondary text-sm mt-1">
          Tentukan jenis proyek yang sesuai dengan kebutuhan Anda
        </p>
      </div>

      <div className="grid gap-4">
        {projectTypes.map((type) => (
          <motion.button
            key={type.id}
            onClick={() => handleSelect(type.id as "B" | "C")}
            className={`w-full p-5 rounded-lg glass-card transition-all ${
              orderData.projectType === type.id
                ? "border-2 border-accent bg-accent/10 shadow-md"
                : "hover:border-accent-color/50 hover:bg-gray-50/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  orderData.projectType === type.id
                    ? "bg-accent-color text-white"
                    : "bg-gray-100/80 text-secondary"
                }`}
              >
                {type.icon}
              </div>
              <div className="text-left">
                <h3
                  className={`text-lg font-semibold ${
                    orderData.projectType === type.id
                      ? "text-accent-color"
                      : "text-secondary"
                  }`}
                >
                  {type.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{type.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Pilih jenis proyek yang sesuai untuk melanjutkan ke langkah berikutnya</p>
      </div>
    </motion.div>
  );
};

export default Step1;
