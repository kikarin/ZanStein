"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";
import { FaLightbulb, FaRocket, FaUsers, FaCheckCircle } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const features = [
  {
    icon: <FaLightbulb className="text-primary text-4xl" />,
    title: "Kreatif",
    description: "Solusi inovatif dalam setiap proyek yang dikerjakan.",
  },
  {
    icon: <FaRocket className="text-primary text-4xl" />,
    title: "Cepat & Efisien",
    description: "Pengerjaan tepat waktu dengan hasil berkualitas tinggi.",
  },
  {
    icon: <FaUsers className="text-primary text-4xl" />,
    title: "Kolaboratif",
    description: "Komunikasi yang baik untuk memastikan kebutuhan terpenuhi.",
  },
  {
    icon: <FaCheckCircle className="text-primary text-4xl" />,
    title: "Terpercaya",
    description: "Memberikan hasil yang sesuai dengan ekspektasi klien.",
  },
];

const AboutUs = () => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <Parallax speed={2}>
                <h2 className="text-4xl font-bold">
                  <span className="text-primary">Tentang Zanstein</span>
                </h2>
              </Parallax>
              <Parallax speed={6}>
                <p className="mt-7 ml-2 text-lg text-gray-700 leading-relaxed">
                  Zanstein adalah sebuah brand yang bergerak di bidang jasa
                  pengembangan website dan aplikasi. Kami hadir untuk membantu
                  menyelesaikan proyek-proyek berbasis teknologi dengan solusi
                  yang inovatif, cepat, dan profesional.
                </p>
              </Parallax>
            </motion.div>

            {/* Visi & Misi */}
            <motion.div variants={fadeInUp}>
              <Parallax speed={4}>
                <div className="p-8 bg-gray-100 rounded-lg shadow-sm space-y-6">
                  {/* Visi */}
                  <div className="space-y-3">
                    <h4 className="text-2xl font-semibold text-primary">
                      Visi
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Membangun solusi digital yang mudah diakses, cepat, dan
                      bermanfaat bagi semua orang yang membutuhkan bantuan dalam
                      pengembangan website dan aplikasi.
        </p>
      </div>

                  {/* Garis pemisah */}
                  <div className="h-px bg-gray-300" />

                  {/* Misi */}
                  <div className="space-y-4">
                    <h4 className="text-2xl font-semibold text-primary">
                      Misi
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <FaCheckCircle className="text-primary text-xl mt-1 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">
                          Menyediakan jasa pembuatan website dan aplikasi yang
                          sesuai kebutuhan.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <FaCheckCircle className="text-primary text-xl mt-1 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">
                          Menyelesaikan proyek dengan kualitas terbaik & tepat
                          waktu.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <FaCheckCircle className="text-primary text-xl mt-1 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">
                          Berkomunikasi dengan baik agar hasil sesuai ekspektasi
                          klien.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Parallax>
            </motion.div>
          </motion.div>
          {/* Right Column - Image */}
          <div className="relative w-full max-w-md mx-auto ml-0 lg:ml-20">
            <Parallax speed={5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
          <Image 
            src="/undraw_programming_65t2.svg" 
                  alt="Tentang Zanstein"
                  width={400}
                  height={400}
                  className="rounded-xl shadow-lg"
                  priority
                />
              </motion.div>
            </Parallax>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="pt-16"
        >
          <motion.h3
            variants={fadeInUp}
            className="text-3xl font-bold text-center mb-12"
          >
            <Parallax speed={2}>
              <span className="text-primary">Keunggulan Kami</span>
            </Parallax>
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 lg:gap-8">
            {features.map((feature, index) => (
              <Parallax speed={9} key={index}>
                {" "}
                {/* Key dipindahkan ke sini */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-white rounded-lg p-8 shadow-md text-center overflow-hidden transition-all duration-300 group"
                >
                  {/* Ikon di tengah */}
                  <div className="flex justify-center items-center w-16 h-16 mx-auto mb-6 bg-white rounded-full shadow-lg transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>

                  {/* Judul & Deskripsi */}
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              </Parallax>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
