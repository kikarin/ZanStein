'use client';

import Link from "next/link";
import { FaInstagram, FaWhatsapp, FaArrowUp} from "react-icons/fa";
import { MdWeb } from "react-icons/md";
import Image from "next/image";
import { useEffect, useState } from "react";


const Footer = () => {
  const [showButton, setShowButton] = useState(false);

  // Cek scroll position buat munculin tombol "Back to Top"
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <footer className="relative text-[var(--text-secondary)] mt-20">
      {/* Garis Dekoratif Simpel */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500"></div>
      <div className="absolute top-2 left-0 w-full h-[2px] bg-gray-400"></div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Logo & Deskripsi */}
            <div className="flex flex-col items-center md:items-start">
              <Image src="/logo-ts.png" alt="Logo" width={60} height={60} />
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-3">
                ZanStein Solution
              </h2>
              <p className="mt-4 text-[var(--text-secondary)] text-center md:text-left">
                Solusi terbaik untuk kebutuhan pengembangan web & aplikasi digital Anda.
              </p>
            </div>

            {/* Informasi & Navigasi */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Layanan Kami</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/web-development" className="hover:text-[var(--accent-hover)] transition duration-300">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-apps" className="hover:text-[var(--accent-hover)] transition duration-300">
                    Mobile App Development
                  </Link>
                </li>
                <li>
                  <Link href="/ui-ux-design" className="hover:text-[var(--accent-hover)] transition duration-300">
                    UI/UX Design
                  </Link>
                </li>
                <li>
                  <Link href="/consulting" className="hover:text-[var(--accent-hover)] transition duration-300">
                    IT Consulting
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sosial Media & Kontak */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Hubungi Kami</h3>
              <p className="mt-4 text-[var(--text-secondary)]">Tetap terhubung dengan kami melalui media sosial:</p>
              <div className="flex space-x-4 mt-3">
                <a
                  href="https://instagram.com/#"
                  className="hover:text-[var(--accent-hover)] transition duration-300 transform hover:scale-110"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://wa.me/6285693531495"
                  className="hover:text-[var(--accent-hover)] transition duration-300 transform hover:scale-110"
                >
                  <FaWhatsapp size={24} />
                </a>
                <a
                  href="https://porto-zan.vercel.app/"
                  className="hover:text-[var(--accent-hover)] transition duration-300 transform hover:scale-110"
                >
                  <MdWeb size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[var(--text-secondary)]">
              © {new Date().getFullYear()} ZanStein Solution. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-[var(--accent-hover)] transition duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[var(--accent-hover)] transition duration-300">
                Terms of Service
              </Link>
            </div>
          </div>

                  {/* Tombol Back to Top */}
        {showButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 p-3 bg-primary dark:bg-gray-700 text-white rounded-full shadow-lg 
            hover:bg-gray-600 dark:hover:bg-gray-500 hover:scale-110 transition-all duration-300 ease-in-out opacity-80 
            hover:opacity-100 flex items-center justify-center"
          >
            <FaArrowUp size={20} />
          </button>
        )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
