import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { db } from "../../lib/firebaseConfig";
import { doc, updateDoc,  getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { Timestamp } from 'firebase/firestore';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  createdAt: Timestamp;
  photoURL?: string;
  userId?: string;
  adminReply?: {
    text: string;
    timestamp: Timestamp;
  };
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
}

const TestimonialCarousel = ({ testimonials, setTestimonials }: TestimonialCarouselProps) => {
  const controls = useAnimation();
  const [,setAutoScroll] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemWidth = 320;
  const gap = 20;
  const itemsPerRow = 2; // 2 testimoni per baris
  const totalColumns = Math.ceil(testimonials.length / itemsPerRow); // Jumlah kolom berdasarkan total testimoni
  // const [offset, setOffset] = useState(0);

  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // 🔥 Cek apakah user adalah admin dari Firestore
  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        console.log("User data:", userDoc.data()); // 👉 Cek isi data Firestore
  
        setIsAdmin(userDoc.exists() && userDoc.data()?.role?.toLowerCase() === "admin");
        console.log("User data:", userDoc.data());
              }
    };
  
    if (user) {
      checkAdminRole();
    }
  }, [user]);
  
  const handleReply = async (testimonialId: string) => {
    if (!replyText.trim()) return;
  
    console.log("Mengirim reply:", replyText);
console.log("Reply berhasil disimpan!");

  
    try {
      const testimonialRef = doc(db, "testimonials", testimonialId);
      const replyContent = replyText;
  
      await updateDoc(testimonialRef, {
        adminReply: { text: replyContent },
      });
  
      console.log("Reply berhasil disimpan!"); // 👉 Debug berhasil
  
      setReplyText("");
      setSelectedTestimonial(null);
  
      setTestimonials(
        testimonials.map((t) =>
          t.id === testimonialId ? { ...t, adminReply: { text: replyContent, timestamp: Timestamp.now() } } : t
        )
      );
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };
    
//   // 🔥 Auto-scroll setiap 5 detik (dibatasi agar tidak keluar area)
//   useEffect(() => {
//     if (!autoScroll) return;

//     const interval = setInterval(() => {
//         setOffset((prev) => {
//             const maxOffset = totalColumns + itemsPerRow; // Batas terakhir sebelum reset
//             const newOffset = prev - 1;

//             return newOffset < -maxOffset ? 0 : newOffset; // Reset jika melewati batas
//         });

//         controls.start({
//             x: offset * (itemWidth * itemsPerRow + gap * itemsPerRow),
//             transition: { type: "spring", stiffness: 50, damping: 20 },
//         });
//     }, 3000);

//     return () => clearInterval(interval);
// }, [autoScroll, offset, controls, itemWidth, itemsPerRow, gap, totalColumns]);


return (
  <div className="relative w-full overflow-hidden py-4">
    {/* Container Carousel (Grid horizontal untuk 2 baris) */}
    <motion.div
      ref={carouselRef}
      className="flex flex-nowrap gap-6 cursor-grab"
      drag="x"
      dragConstraints={{
        left: -itemsPerRow * itemWidth + gap * (itemsPerRow - 1),
        right: 0,
      }}
      onDragStart={() => setAutoScroll(false)}
      onDragEnd={() => setAutoScroll(true)}
      animate={controls}
    >
      {Array.from({ length: totalColumns }).map((_, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-6">
          {testimonials
            .slice(colIndex * itemsPerRow, colIndex * itemsPerRow + itemsPerRow)
            .map((t) => (
              <motion.div
                key={t.id}
                className="glass-card hover:shadow-2xl transition-all duration-300 overflow-hidden min-w-[320px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="p-6 relative">
                  {/* Header dengan user info dan rating */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {t.photoURL ? (
                        <Image
                          src={t.photoURL}
                          alt={t.name}
                          width={56}
                          height={56}
                          className="rounded-full ring-4 ring-primary/10"
                          unoptimized
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-xl">{t.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`w-5 h-5 ${i < t.rating ? "text-yellow-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-600 text-lg leading-relaxed">{t.text}</p>

                  {/* Admin Reply */}
                  {t.adminReply && (
                    <div className="mt-6 flex items-start gap-4">
                      <Image
                        src="/logo-bs.png"
                        alt="Admin"
                        width={44}
                        height={44}
                        className="rounded-full ring-2 ring-primary"
                        unoptimized
                      />
                      <div className="p-5 bg-gray-100 rounded-xl border-l-4 border-primary">
                        <span className="font-semibold text-primary">Admin:</span>
                        <p className="text-gray-600">{t.adminReply.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Admin Reply Form */}
                  {isAdmin && !t.adminReply && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {selectedTestimonial === t.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Tulis balasan admin..."
                            rows={3}
                          />
                          <button onClick={() => handleReply(t.id)} className="btn-primary">
                            Kirim Balasan
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setSelectedTestimonial(t.id)} className="text-primary font-medium">
                          Balas Testimoni Ini
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      ))}
    </motion.div>
  </div>
);
};
export default TestimonialCarousel;
