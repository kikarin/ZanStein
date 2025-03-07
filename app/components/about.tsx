"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaLightbulb, FaRocket, FaUsers, FaCheckCircle } from "react-icons/fa";

const AboutUs = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <FaLightbulb className="text-primary text-3xl" />,
      title: "Inovatif",
      description: "Solusi teknologi terkini untuk kebutuhan modern"
    },
    {
      icon: <FaRocket className="text-primary text-3xl" />,
      title: "Efisien",
      description: "Pengembangan cepat dengan kualitas terbaik"
    },
    {
      icon: <FaUsers className="text-primary text-3xl" />,
      title: "Kolaboratif",
      description: "Kerjasama erat dengan setiap klien"
    },
    {
      icon: <FaCheckCircle className="text-primary text-3xl" />,
      title: "Terpercaya",
      description: "Hasil kerja terukur dan terjamin"
    }
  ];

  return (
    <section className="py-8 sm:py-8 lg:py-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-xl blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-xl blur-3xl" />
        </motion.div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="flex flex-col gap-16">
          {/* Top Section: About & Image */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } }
              }}
              className="space-y-8"
            >
              {/* Header */}
              <motion.div variants={fadeInUp} className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  Tentang Kami
                  </span>
                </h2>
                <p className="ml-2 text-lg text-gray-600 leading-relaxed">
                        ZanStein Solution hadir sebagai partner teknologi terpercaya untuk tugas dan bisnis Anda. 
                        Dengan pengalaman dan keahlian kami, kami berkomitmen menghadirkan solusi digital 
                        yang inovatif dan efisien.
                </p>
              </motion.div>

              {/* Vision & Mission */}
              <motion.div variants={fadeInUp} className="space-y-1">
                <div className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-4 ">
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="text-xl font-semibold text-primary">Visi</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Menjadi perusahaan teknologi terdepan dengan menyediakan solusi yang inovatif 
                        dan efisien untuk membantu bisnis berkembang di era digital.
                      </p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    <div className="space-y-3">
                      <h4 className="text-xl font-semibold text-primary">Misi</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Kami berkomitmen untuk memberikan layanan berkualitas tinggi dengan fokus pada:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-gray-600">
                          <FaCheckCircle className="text-primary flex-shrink-0" />
                          <span>Solusi teknologi yang tepat guna</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-600">
                          <FaCheckCircle className="text-primary flex-shrink-0" />
                          <span>Kepuasan klien sebagai prioritas utama</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-600">
                          <FaCheckCircle className="text-primary flex-shrink-0" />
                          <span>Inovasi berkelanjutan dalam setiap layanan</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative lg:pl-8"
            >
              <div className="relative w-full aspect-square max-w-2xl mx-auto">
                {/* Decorative Frame */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, repeatType: "reverse" }
                  }}
                  className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-2xl"
                />
                
                {/* Image Container */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative w-[90%] mx-auto aspect-square"
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl transform rotate-3" />
                  
                  {/* Image */}
                  <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl">
                    <Image
                      src="/undraw_programming_65t2.svg"
                      alt="About ZanStein"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Decorative Elements */}
                  <motion.div
                    animate={{ y: [-10, 10] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute -top-8 right-10 w-20 h-20 bg-primary/10 rounded-xl blur-xl"
                  />
                  <motion.div
                    animate={{ y: [10, -10] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute -bottom-8 left-10 w-24 h-24 bg-primary/10 rounded-xl blur-xl"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section: Features */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="pt-8"
          >
            <motion.h3 
              variants={fadeInUp}
              className="text-3xl font-bold text-center mb-12"
            >
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Keunggulan Kami
              </span>
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl transform group-hover:scale-110 transition-transform duration-300" />
                    <div className="relative w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-md">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
