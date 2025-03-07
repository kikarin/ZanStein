"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShieldCheckIcon, RocketLaunchIcon, LightBulbIcon } from "@heroicons/react/24/solid";

const Welcome = () => {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="min-h-screen pt-14 pb-8 px-6 lg:px-16 relative overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <div className="mb-12 lg:mb-0 flex flex-col-reverse lg:flex-row items-center gap-12 text-center lg:text-left">
          {/* Text Section */}
          <motion.div variants={itemVariants} className="lg:w-1/2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-6">
              Welcome to ZanStein
            </h1>
            <p className="text-xl md:text-2xl text-secondary-light mb-6 max-w-xl mx-auto lg:mx-0">
              Budget-Friendly, Pro-Level Coding.
            </p>

            <div className="flex justify-center lg:justify-start gap-4">
              <button
                onClick={() => router.push("/order")}
                className="btn-primary flex items-center gap-2 group"
              >
                <span>Mulai Order</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
              <button
                onClick={() => router.push("/testimonials")}
                className="btn-secondary"
              >
                Lihat Testimonial
              </button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div variants={itemVariants} className="lg:w-1/2">
            <Image
              src="/zans-t.png"
              alt="TypeScript Logo"
              width={450} // Perbesar gambar
              height={450}
              className="hover-scale mx-auto lg:mx-0"
              priority
            />
          </motion.div>
        </div>

        {/* Stats Section */}
        <StatsSection />

        {/* Features Grid */}
        <FeaturesGrid />
      </motion.div>
    </section>
  );
};

export default Welcome;

/* -------------------- */
/* 🔹 Stats Section - Dengan Animasi Count Up */
/* -------------------- */

const StatsSection = () => {
  const stats = [
    {
      number: 50,
      suffix: "+",
      label: "Proyek Selesai",
    },
    {
      number: 100,
      suffix: "%",
      label: "Kepuasan Klien",
    },
    {
      number: 24,
      suffix: "/7",
      label: "Dukungan Teknis",
    },
  ];
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.2 } },
          }}
          className="glass-card p-8 flex flex-col items-center justify-center hover:shadow-lg hover:scale-[1.05] transition-all duration-300 group"
        >
          {/* Counter */}
          <Counter value={stat.number} suffix={stat.suffix} />

          {/* Label */}
          <p className="text-secondary-light text-lg font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

/* 🔹 Komponen Counter menggunakan framer-motion untuk animasi lebih smooth */
const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(easedProgress * value);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <h3 className="text-5xl font-bold text-primary mb-2">
      {count}
      {suffix}
    </h3>
  );
};

/* -------------------- */
/* 🔹 Features Grid - Efek Hover Lebih Interaktif */
/* -------------------- */

const FeaturesGrid = () => {
  const features = [
    {
      icon: <RocketLaunchIcon className="w-12 h-12 text-primary group-hover:text-primary-dark transition-all duration-300" />,
      title: "Pengembangan Cepat",
      description: "Proses pengembangan yang efisien dengan hasil berkualitas tinggi.",
    },
    {
      icon: <LightBulbIcon className="w-12 h-12 text-primary group-hover:text-primary-dark transition-all duration-300" />,
      title: "Solusi Inovatif",
      description: "Menggunakan teknologi terkini untuk hasil yang optimal.",
    },
    {
      icon: <ShieldCheckIcon className="w-12 h-12 text-primary group-hover:text-primary-dark transition-all duration-300" />,
      title: "Keamanan Terjamin",
      description: "Sistem keamanan yang kuat untuk melindungi data Anda.",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="glass-card p-8 text-center relative overflow-hidden group hover:shadow-lg hover:scale-[1.05] transition-all duration-300"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1 } },
          }}
        >
          {/* Ikon SVG */}
          <div className="flex justify-center mb-4">{feature.icon}</div>
          
          {/* Judul */}
          <h3 className="text-xl font-semibold text-secondary mb-2">
            {feature.title}
          </h3>
          
          {/* Deskripsi */}
          <p className="text-secondary-light">{feature.description}</p>

          {/* Efek Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      ))}
    </motion.div>
  );
};
