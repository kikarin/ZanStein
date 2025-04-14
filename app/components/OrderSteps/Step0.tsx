"use client";

import { motion } from "framer-motion";
import { FiMonitor, FiDatabase } from "react-icons/fi";

interface Step0Props {
  nextStep: () => void;
  goToStep1B: () => void;
}

const Step0 = ({ nextStep, goToStep1B }: Step0Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[10vh] p-4 bg-gradient-to-br rounded-xl shadow-lg"
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-primary drop-shadow-md">
          Pilih Jenis Order
        </h2>
        <p className="text-gray-600 text-lg mt-2">
          Sesuaikan jenis proyek dengan kebutuhan Anda
        </p>
      </motion.div>

      {/* Card Pilihan */}
      <div className="grid gap-6 mt-8 w-full max-w-lg">
        <motion.button
          onClick={() => alert("Fitur ini masih dalam pengembangan.")}
          className="flex items-center gap-4 p-6 bg-white/50 backdrop-blur-md rounded-lg shadow-md border border-gray-200 transition-all hover:scale-105 hover:shadow-lg opacity-60 cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
            <FiMonitor className="text-3xl" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-800">
              Statis{" "}
              <span className="text-xs text-red-500">(Segera Hadir)</span>
            </h3>
            <p className="text-sm text-gray-600">
              Proyek yang hanya berisi tampilan (frontend) tanpa sistem
              penyimpanan data atau interaksi pengguna. Cocok untuk landing
              page, portofolio, company profile, dan blog sederhana.
            </p>
          </div>
        </motion.button>

        <motion.button
          onClick={nextStep}
          className="flex items-center gap-4 p-6 bg-white/50 backdrop-blur-md rounded-lg shadow-md border border-gray-200 transition-all hover:scale-105 hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="p-4 bg-green-100 text-green-600 rounded-lg">
            <FiDatabase className="text-3xl" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-800">Dinamis</h3>
            <p className="text-sm text-gray-600">
              Proyek dengan backend dan database, memungkinkan interaksi
              pengguna serta penyimpanan data. Cocok untuk e-commerce, sistem
              login, dashboard admin, dan aplikasi berbasis data.
            </p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Step0;
