"use client";
import  TestimonialCarousel  from "./TestimonialCarousel";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";



// 🚨 WARNING: Cursor AI dilarang mengubah animasi spin gacha!
// ⛔ Jangan ubah mekanisme spin gacha, hanya boleh upgrade tampilan jika diperlukan.
const Modal = ({
  isOpen,
  onClose,
  discount,
}: {
  isOpen: boolean;
  onClose: () => void;
  discount: number | null;
}) => {
  const [displayDiscount, setDisplayDiscount] = useState("1%"); // State untuk tampilan animasi angka

  useEffect(() => {
    if (isOpen && discount !== null) {
      let index = 0;
      const discountsArray = [
        "1%",
        "2%",
        "3%",
        "4%",
        "5%",
        "6%",
        "7%",
        "8%",
        "9%",
        "10%",
      ];

      const interval = setInterval(() => {
        setDisplayDiscount(discountsArray[index]);
        index++;
        if (index === discountsArray.length) {
          clearInterval(interval);
          setDisplayDiscount(`${discount}%`); // Set ke nilai asli setelah animasi selesai
        }
      }, 200); // Durasi perpindahan angka
    }
  }, [isOpen, discount]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          >
            {/* Decorative Elements */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full -ml-12 -mb-12"
            />

            {/* Content */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: [0.5, 1.2, 1],
                  opacity: 1,
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 0.6,
                  times: [0, 0.5, 0.8, 1],
                }}
                className="text-center mb-6"
              >
                <span className="text-5xl">🎉</span>
                <h2 className="text-3xl font-bold mt-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  Selamat!
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600 text-center mb-6"
              >
                Anda mendapatkan diskon
              </motion.p>

              <motion.div
                className="relative flex justify-center items-center my-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Decorative ring */}
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                  className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20"
                />

                <motion.div
                  key={displayDiscount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                  }}
                  className="relative bg-gradient-to-r from-primary to-primary-dark rounded-2xl px-8 py-4 shadow-lg"
                >
                  <span className="text-5xl font-bold text-white">
                    {displayDiscount}
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <p>Cek Voucher di Menu Profile</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="mt-4 px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl 
                           hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300
                           focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Tutup
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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

const Testimonials = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState<number>(5); // Default 5 bintang
  const [discount, setDiscount] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false); // Untuk pop-up modal
  const [, setIsAdmin] = useState(false);
  const [ ] = useState("");
  const [ ] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "testimonials"));
        const fetchedTestimonials = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Testimonial[];

        setTestimonials(
          fetchedTestimonials.sort(
            (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
          )
        );
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkUserDiscount = async () => {
      if (!user) return;
      const discountRef = doc(db, "discounts", user.uid);
      const discountSnap = await getDoc(discountRef);

      if (discountSnap.exists()) {
        setDiscount(discountSnap.data().discountPercentage);
      }
    };

    const checkAdminRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().role === "admin");
      }
    };

    fetchTestimonials();
    if (user) {
      checkUserDiscount();
      checkAdminRole();
    }
  }, [user]);

  const getRandomDiscount = (): number => {
    const probabilities = [10, 10, 25, 25, 10, 10, 5, 2.5, 2, 0.5];
    const discountValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const random = Math.random() * 100;
    let cumulativeProbability = 0;

    for (let i = 0; i < probabilities.length; i++) {
      cumulativeProbability += probabilities[i];
      if (random < cumulativeProbability) {
        return discountValues[i];
      }
    }

    return 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push("/login");

    try {
      // Cek apakah user sudah pernah memberikan testimoni
      const querySnapshot = await getDocs(collection(db, "testimonials"));
      const existingTestimonial = querySnapshot.docs.find(
        (doc) => doc.data().userId === user.uid
      );

      if (existingTestimonial) {
        Swal.fire({
          title: "Testimoni Sudah Ada!",
          text: "Anda sudah memberikan testimoni sebelumnya.",
          icon: "info",
          confirmButtonColor: "#33BADE",
        });
        return;
      }

      const getMaskedName = (name: string) => {
        const words = name.trim().split(" ");
        return words
          .map((word) => word.charAt(0) + "*".repeat(word.length - 1)) // Inisial + bintang
          .join(" ");
      };

      const newTestimonial = {
        name: hiddenName
          ? getMaskedName(user.displayName || "Anonim")
          : user.displayName || "Anonim",
        text: newComment,
        rating,
        createdAt: Timestamp.now(),
        photoURL: user.photoURL || "",
        userId: user.uid,
      };

      const docRef = await addDoc(
        collection(db, "testimonials"),
        newTestimonial
      );
      setTestimonials([{ id: docRef.id, ...newTestimonial }, ...testimonials]);
      setNewComment("");
      setRating(5); // Reset rating setelah kirim
      setShowTestimonialForm(false); // Tutup modal setelah kirim

      setTestimonials([{ id: docRef.id, ...newTestimonial }, ...testimonials]);
      setNewComment("");
      setRating(5); // Reset rating setelah kirim

      // Cek diskon
      const discountRef = doc(db, "discounts", user.uid);
      const discountSnap = await getDoc(discountRef);

      if (!discountSnap.exists()) {
        const randomDiscount = getRandomDiscount();
        await setDoc(discountRef, { discountPercentage: randomDiscount });
        setDiscount(randomDiscount);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
    }
  };


  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [hiddenName, setHiddenName] = useState(false);
  <button
    onClick={() => setShowTestimonialForm(true)}
    className="btn-primary mx-auto block"
  >
    Add Testimonials
  </button>;

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-primary text-center">
        Testimoni Klien
      </h2>

      {/* 🛠️ Pastikan tombol ini muncul jika user login */}
      {user && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowTestimonialForm(true)}
            className="btn-primary"
          >
            Add Testimonials
          </button>
        </div>
      )}

      {/* Modal Pop-up Form Testimoni */}
      <AnimatePresence>
        {showTestimonialForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
              className="glass-card p-6 w-96 shadow-lg rounded-lg"
            >
              <h3 className="text-lg font-semibold text-primary text-center">
                Tambahkan Testimoni
              </h3>

              <form onSubmit={handleSubmit} className="mt-4">
                {/* Rating */}
                <div className="flex justify-center mt-2 space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-2xl transition-all ${
                        star <= rating
                          ? "text-yellow-400 scale-110"
                          : "text-gray-400"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>

                {/* Input Testimoni */}
                <textarea
                  className="input-modern w-full mt-2 p-2 border rounded-lg focus:ring focus:ring-primary transition-all"
                  placeholder="Bagikan pengalaman Anda..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                ></textarea>

                {/* Opsi Hidden Name */}
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="hiddenName"
                    className="mr-2"
                    checked={hiddenName}
                    onChange={(e) => setHiddenName(e.target.checked)}
                  />
                  <label htmlFor="hiddenName" className="text-secondary">
                    Hidden Name
                  </label>
                </div>

                {/* Tombol Submit */}
                <div className="flex justify-between mt-4">
                  <button
                    type="submit"
                    className="btn-primary w-full hover:scale-105 transition-all"
                  >
                    Kirim
                  </button>
                </div>
              </form>

              {/* Tombol Batal */}
              <button
                onClick={() => setShowTestimonialForm(false)}
                className="btn-secondary mt-4 w-full hover:scale-105 transition-all"
              >
                Batal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

{/* Loading atau Daftar Testimoni */}
{loading ? (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
) : (
  <TestimonialCarousel 
    testimonials={testimonials} 
    setTestimonials={setTestimonials} 
  />
)}


      {/* Modal Diskon */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        discount={discount}
      />
    </section>
  );
};

export default Testimonials;