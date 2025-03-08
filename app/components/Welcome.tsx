"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Parallax } from "react-scroll-parallax";

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
    <section className="relative overflow-hidden">
      {/* Container with consistent padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16 pb-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <div className="mb-12 lg:mb-0 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12">
           {/* Teks dengan efek Parallax */}
           <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } }} className="w-full lg:w-1/2 text-center lg:text-left">
              <Parallax speed={4}>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-3">
                  Welcome to ZanStein Solution
                </h1>
              </Parallax>
              <Parallax speed={4}>
                <p className="text-xl text-secondary-light mb-8">
                Top-Tier Quality, Budget Price.
                </p>
              </Parallax>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button
                  onClick={() => router.push("/order")}
                  className="btn-primary flex items-center justify-center gap-2 group w-full sm:w-auto"
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
                <a
                  href="https://wa.me/6285693531495"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center justify-center gap-2 group w-full sm:w-auto hover:bg-green-600 hover:text-white transition-colors"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-5 h-5"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div variants={itemVariants} className="w-full lg:w-1/2">
              <div className="max-w-md mx-auto lg:max-w-none">
              <Parallax speed={4}>
                <Image
                  src="/zans-t.png"
                  alt="TypeScript Logo"
                  width={450}
                  height={450}
                  className="hover-scale w-full h-auto"
                  priority
                  />
              </Parallax>
              </div>
            </motion.div>
          </div>

          {/* Stats Section with consistent spacing */}
          <div className="mb-1">
          <Parallax speed={-12}>
              <StatsSection />
            </Parallax>
          </div>
        </motion.div>
      </div>
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
      number: 32,
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
      className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
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

