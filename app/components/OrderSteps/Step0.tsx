"use client";

import { motion } from "framer-motion";

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
      className="space-y-6 text-center"
    >
      <h2 className="text-3xl font-bold text-primary">Pilih Jenis Order</h2>
      <p className="text-secondary text-sm mt-1">
        Apakah proyek Anda bersifat statis atau dinamis?
      </p>

      <div className="grid gap-4">
        <motion.button
          onClick={goToStep1B}
          className="w-full p-5 rounded-lg glass-card transition-all hover:border-accent-color/50 hover:bg-gray-50/50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="text-lg font-semibold text-secondary">Statis</h3>
          <p className="text-sm text-gray-500 mt-1">
            Proyek tanpa interaksi backend, hanya tampilan frontend.
          </p>
        </motion.button>

        <motion.button
          onClick={nextStep}
          className="w-full p-5 rounded-lg glass-card transition-all hover:border-accent-color/50 hover:bg-gray-50/50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="text-lg font-semibold text-secondary">Dinamis</h3>
          <p className="text-sm text-gray-500 mt-1">
            Proyek interaktif dengan fitur backend atau database.
          </p>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Step0;
