"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";

const InfoSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const parallax = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  const discountUpdates = [
    {
      startDate: "06 Mar 2025",
      endDate: "18 Mar 2025",
      info: "Persentase diskon pada fitur Gacha Voucher berkisar antara 1% hingga 10%.",
      voucherExpire: "24 Mar 2025",
    },
    {
      startDate: "06 Mar 2025",
      endDate: "31 Mar 2025",
      info: "Voucher diskon hanya dapat digunakan satu kali untuk setiap pengguna.",
      voucherExpire: "24 Mar 2025",
    },
  ];

  const generalUpdates = [
    {
      date: "05 Mar 2025",
      info: "Dalam rangka menyambut bulan Ramadhan dan peluncuran website ZanStein, kami membagikan Voucher Diskon spesial kepada pengguna.",
    },
    {
      date: "05 Mar 2025",
      info: "Voucher diskon dapat diperoleh dengan memberikan testimoni mengenai layanan kami.",
    },
  ];

  const serviceUpdates = [
    {
      date: "05 Mar 2025",
      info: "Saat ini, halaman FAQ masih dalam tahap pengembangan. Jika ada pertanyaan, silakan langsung menghubungi Mimin ganteng😘 melalui WhatsApp.",
    },
    {
      date: "04 Mar 2025",
      info: "Zanstein kini resmi meluncurkan website baru untuk pemesanan layanan, memberikan pengalaman yang lebih mudah dan efisien bagi pelanggan.",
    },
  ];

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Animasi Parallax Background */}
      <motion.div
        style={{ y: parallax }}
        className="absolute inset-0 bg-[url('/background.svg')] bg-cover bg-center opacity-10"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary text-center mb-12"
        >
          Informasi Terbaru
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <InfoCategory title="Update Umum" updates={generalUpdates} />
          <InfoCategory title="Diskon & Voucher" updates={discountUpdates} />
          <InfoCategory title="Info Layanan" updates={serviceUpdates} />
        </div>
      </div>
    </section>
  );
};

export default InfoSection;

/* -------------------- */
/* 🔹 COMPONENT REFACTOR UNTUK MENGURANGI SCROLL */
/* -------------------- */

type InfoCardProps = {
  date?: string;
  info: string;
  startDate?: string;
  endDate?: string;
  voucherExpire?: string;
};

const InfoCard = ({
  date,
  info,
  startDate,
  endDate,
  voucherExpire,
}: InfoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="glass-card p-6 hover-scale shadow-lg transition-all duration-300"
    >
      <p className="text-sm text-primary font-medium mb-2">
        {date || `Berlaku: ${startDate} - ${endDate}`}
      </p>
      <p className="text-secondary-light">{info}</p>
      {voucherExpire && (
        <p className="text-xs text-red-500 mt-2">Voucher Expired: {voucherExpire}</p>
      )}
    </motion.div>
  );
};

type InfoCategoryProps = {
  title: string;
  updates: InfoCardProps[];
};

const InfoCategory = ({ title, updates }: InfoCategoryProps) => {
  const [showAll, setShowAll] = useState(false);
  const visibleUpdates = showAll ? updates : updates.slice(0, 2);

  return (
    <div className="mb-12 sm:mb-16 last:mb-0">
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-xl sm:text-2xl font-semibold text-primary text-center mb-6 sm:mb-8"
      >
        {title}
      </motion.h3>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary bg-opacity-20 hidden md:block" />

        {/* Timeline Cards */}
        <div className="space-y-8 sm:space-y-12">
          {visibleUpdates.map((update, index) => (
            <motion.div
              key={index}
              className={`relative flex flex-col md:flex-row items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full hidden md:block"
              />

              {/* Card */}
              <div className={`w-full md:w-1/2 ${
                index % 2 === 0 ? "md:pr-8 lg:pr-12" : "md:pl-8 lg:pl-12"
              }`}>
                <InfoCard {...update} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Show More Button */}
      {updates.length > 2 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
          >
            {showAll ? "Lihat Lebih Sedikit" : "Lihat Semua"}
          </button>
        </div>
      )}
    </div>
  );
};
