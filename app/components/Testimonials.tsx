"use client";

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
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import Swal from "sweetalert2";

// Komponen Modal Pop-up
const Modal = ({
  isOpen,
  onClose,
  discount,
}: {
  isOpen: boolean;
  onClose: () => void;
  discount: number | null;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold text-primary">🎉 Selamat!</h2>
        <p className="mt-2 text-lg text-black">
  Anda mendapatkan diskon{" "}
  <span className="text-accent animate-spin-gacha" data-discount={`${discount}%`}>
    {/* Default: biar awalnya kosong, diubah setelah animasi selesai */}
  </span>
  !
</p>
        <button
          onClick={onClose}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
        >
          Tutup
        </button>
      </div>
    </div>
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(
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
  
      const newTestimonial = {
        name: hiddenName ? "P*****" : user.displayName || "Anonim",
        text: newComment,
        rating,
        createdAt: Timestamp.now(),
        photoURL: user.photoURL || "",
        userId: user.uid,
      };
  
      const docRef = await addDoc(collection(db, "testimonials"), newTestimonial);
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

  // Handle reply submission
  const handleReply = async (testimonialId: string) => {
    if (!replyText.trim()) return;

    try {
      const testimonialRef = doc(db, "testimonials", testimonialId);
      await updateDoc(testimonialRef, {
        adminReply: {
          text: replyText,
          timestamp: serverTimestamp(),
        },
      });

      setReplyText("");
      setSelectedTestimonial(null);

      // **Update state testimonials tanpa refetch dari Firestore**
      setTestimonials((prevTestimonials) =>
        prevTestimonials.map((t) =>
          t.id === testimonialId
            ? {
                ...t,
                adminReply: { text: replyText, timestamp: Timestamp.now() },
              }
            : t
        )
      );
    } catch (error) {
      console.error("Error adding reply:", error);
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
    {showTestimonialForm && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="glass-card p-6 w-96">
          <h3 className="text-lg font-semibold text-primary">Tambahkan Testimoni</h3>
          <form onSubmit={handleSubmit} className="mt-4">
            {/* Rating */}
            <div className="flex justify-center mt-2 space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-400"}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            {/* Input Testimoni */}
            <textarea
              className="input-modern mt-2"
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
                onChange={(e) => setHiddenName(e.target.checked)}
              />
              <label htmlFor="hiddenName" className="text-secondary">
                Hidden Name
              </label>
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-between mt-4">
              <button type="submit" className="btn-primary w-full">
                Kirim
              </button>
            </div>
          </form>

          {/* Tombol Batal */}
          <button
            onClick={() => setShowTestimonialForm(false)}
            className="btn-secondary mt-4 w-full"
          >
            Batal
          </button>
        </div>
      </div>
    )}

  {/* Loading atau Daftar Testimoni */}
  {loading ? (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  ) : (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
      {testimonials.length > 0 ? (
        testimonials.map((t) => (
          <div 
            key={t.id} 
            className="glass-card hover-scale transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6 relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12"></div>
              
              {/* Header with user info and rating */}
              <div className="flex items-center justify-between mb-6 relative">
                <div className="flex items-center gap-4">
                  {t.photoURL ? (
                    <div className="relative">
                      <Image
                        src={t.photoURL}
                        alt={t.name}
                        width={56}
                        height={56}
                        className="rounded-full ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300"
                        unoptimized
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                        {t.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-xl text-gray-800 group-hover:text-primary transition-colors duration-300">
                      {t.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-5 h-5 ${
                            i < t.rating ? "text-yellow-400" : "text-gray-200"
                          } transition-all duration-300 group-hover:scale-110`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial text */}
              <div className="mb-6 relative">
                <svg className="absolute -top-4 -left-2 w-8 h-8 text-primary/20" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm12 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"/>
                </svg>
                <p className="text-gray-600 text-lg leading-relaxed pl-6">{t.text}</p>
              </div>

              {/* Admin Reply Section with improved styling */}
              {t.adminReply && (
                <div className="mt-6 relative">
                  <div className="absolute left-8 -top-3 w-0.5 h-3 bg-primary/30"></div>
                  <div className="p-5 bg-gradient-to-br from-primary/5 to-transparent rounded-xl border-l-4 border-primary/30">
                    <div className="flex items-center gap-3 mb-3">
                      {user?.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="Admin"
                          width={32}
                          height={32}
                          className="rounded-full ring-2 ring-primary/30"
                          unoptimized
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">A</span>
                        </div>
                      )}
                      <span className="font-semibold text-primary/90">Admin Response</span>
                    </div>
                    <p className="text-gray-600 pl-11">{t.adminReply.text}</p>
                  </div>
                </div>
              )}

              {/* Admin Reply Button & Form with improved styling */}
              {isAdmin && !t.adminReply && (
                <div className="mt-4 pt-4 border-t border-gray-100/50">
                  {selectedTestimonial === t.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="input-modern w-full min-h-[100px] focus:ring-primary/30"
                        placeholder="Write your response..."
                        rows={3}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReply(t.id)}
                          className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                          <span>Send Response</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTestimonial(null);
                            setReplyText("");
                          }}
                          className="btn-secondary flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedTestimonial(t.id)}
                      className="group/btn flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-all duration-300"
                    >
                      <span>Respond to this testimonial</span>
                      <svg 
                        className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-2 text-center py-16">
          <div className="glass-card p-10 max-w-lg mx-auto">
            <div className="text-primary/30 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-xl font-medium">Belum ada testimoni.</p>
            <p className="text-gray-400 mt-2">Jadilah yang pertama memberikan testimoni!</p>
          </div>
        </div>
      )}
    </div>
  )}

   {/* Modal Diskon */}
   <Modal isOpen={showModal} onClose={() => setShowModal(false)} discount={discount} />
  </section>
  );
};

export default Testimonials;
