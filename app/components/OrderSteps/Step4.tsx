"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebaseConfig";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { OrderData } from "../../../lib/types/order";
import { PRICE_LIST } from "../../../lib/utils/priceCalculator";
import OrderSummary from "./OrderSummary";
import Swal from "sweetalert2";
import { Timestamp } from "firebase/firestore";

interface Step4Props {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  prevStep: () => void;
}

const Step4 = ({ orderData, updateOrderData}: Step4Props) => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasUsedDiscount, setHasUsedDiscount] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkDiscountUsage = async () => {
      if (!user || isInitialized) return;
  
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().hasUsedDiscount) {
          setHasUsedDiscount(true);
          if (orderData.discount !== 0) {
            updateOrderData({ discount: 0 });
          }
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error checking discount:", error);
      }
    };
  
    checkDiscountUsage();
  }, [user, isInitialized, orderData.discount, updateOrderData]);
  
  

  useEffect(() => {
    if (user && !isInitialized && !orderData.customerName) {
      updateOrderData({ 
        customerName: user.displayName || '',
        isNameLocked: true
      });
    }
  }, [user, isInitialized, orderData.customerName, updateOrderData]);
  
  

  const calculateTotal = () => {
    let total = 0;

    orderData.roles?.forEach(role => {
      total += PRICE_LIST.roles[role] || 0;
    });

    if (orderData.developmentMethod === "fullstack" && orderData.fullstackChoice) {
      total += PRICE_LIST.fullstackFrameworks[orderData.fullstackChoice.framework] || 0;
      total += PRICE_LIST.databases[orderData.fullstackChoice.database] || 0;
    } else if (orderData.mixmatchChoice) {
      total += PRICE_LIST.frontends[orderData.mixmatchChoice.frontend] || 0;
      total += PRICE_LIST.backends[orderData.mixmatchChoice.backend] || 0;
      total += PRICE_LIST.apis[orderData.mixmatchChoice.api] || 0;
      total += PRICE_LIST.databases[orderData.mixmatchChoice.database] || 0;
    }

    orderData.uiFramework?.forEach(framework => {
      total += PRICE_LIST.uiFrameworks[framework] || 0;
    });

    // Hitung harga Flutter UI Framework (jika ada)
if (orderData.uiFramework) {
  orderData.uiFramework.forEach(framework => {
    if (framework.startsWith("flutter-")) {
      total += PRICE_LIST.flutterUIFrameworks?.[framework] || 0;
    }
  });
}


    if (orderData.notificationType) {
      total += PRICE_LIST.notifications[orderData.notificationType] || 0;
    }

    if (orderData.deadline) {
      total += PRICE_LIST.deadlines[orderData.deadline] || 0;
    }

    return total;
  };

  const totalPriceBeforeDiscount = calculateTotal();
  const finalPrice = orderData.discount 
    ? totalPriceBeforeDiscount * (1 - orderData.discount/100) 
    : totalPriceBeforeDiscount;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!orderData.customerName || !orderData.whatsappNumber || !orderData.paymentMethod) {
        Swal.fire({
          title: "Data Tidak Lengkap!",
          text: "Mohon lengkapi semua data sebelum melanjutkan.",
          icon: "warning",
          confirmButtonColor: "#33BADE",
        });
        return;
      }
      console.log("Final Price:", finalPrice);

    setShowConfirmation(true);
  };

  const handleSaveOrder = async (sendToAdmin: boolean = false) => {
    setLoading(true);
    try {
      if (orderData.discount && hasUsedDiscount) {
        Swal.fire({
          title: "Diskon Tidak Bisa Digunakan",
          text: "Anda sudah menggunakan diskon sebelumnya.",
          icon: "error",
          confirmButtonColor: "#33BADE",
        });
        return;
      }
  
      if (!orderData.customerName || !orderData.whatsappNumber || !orderData.projectType) {
        Swal.fire({
          title: "Data Tidak Lengkap!",
          text: "Harap lengkapi data sebelum menyimpan.",
          icon: "warning",
          confirmButtonColor: "#33BADE",
        });
        return;
      }      

      const totalPriceBeforeDiscount = calculateTotal();
      const finalPrice = orderData.discount 
        ? totalPriceBeforeDiscount * (1 - orderData.discount/100) 
        : totalPriceBeforeDiscount;

      const orderDataToSave = {
        userId: user?.uid || 'guest',
        customerName: orderData.customerName || '',
        whatsappNumber: orderData.whatsappNumber || '',
        paymentMethod: orderData.paymentMethod as "DANA" | "OVO" | "GOPAY" || undefined,
        projectType: orderData.projectType || '',
        platform: orderData.platform || '',
        projectName: orderData.projectName || '',
        applicationType: orderData.applicationType || '',
        referenceLink: orderData.referenceLink || '',
        developmentMethod: orderData.developmentMethod || 'fullstack',
        fullstackChoice: orderData.fullstackChoice || {
          framework: '',
          database: ''
        },
        mixmatchChoice: orderData.mixmatchChoice || {
          frontend: '',
          backend: '',
          api: '',
          database: ''
        },
        roles: orderData.roles || [],
        uiFramework: orderData.uiFramework || [],
        flutterUIFrameworks: orderData.flutterUIFrameworks || [],
        themeChoice: orderData.themeChoice || { mode: 'default' },
        notificationType: orderData.notificationType || 'default',
        customColors: orderData.customColors || { colors: [] },
        deadline: orderData.deadline || 'standard',
        notes: orderData.notes || '',
        originalPrice: totalPriceBeforeDiscount,
        finalPrice: finalPrice,
        discount: orderData.discount || 0,
        status: "Pending",
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "orders"), orderDataToSave);
      console.log("Order ID:", docRef.id);
      
      if (user?.uid && orderData.discount) {
        await updateDoc(doc(db, "users", user.uid), {
          hasUsedDiscount: true,
        });
      }
      

      if (sendToAdmin) {
        const confirm = await Swal.fire({
          title: "Kirim Order ke Admin?",
          text: "Apakah Anda ingin mengirim pesanan ini ke admin via WhatsApp?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Kirim!",
          cancelButtonText: "Batal",
          confirmButtonColor: "#33BADE",
          cancelButtonColor: "#d33",
        });
  
        if (confirm.isConfirmed) {
          const waMessage = generateWhatsAppMessage({
            ...orderDataToSave,
            createdAt: Timestamp.fromDate(new Date()),
            lastUpdated: Timestamp.fromDate(new Date())
          });
          setTimeout(() => {
            window.open(
              `https://wa.me/6285693531495?text=${encodeURIComponent(waMessage)}`,
              "_blank"
            );
          }, 1000);          
        } else {
          return;
        }
      }
  
      // await saveOrderToFirestore(); // Simpan order ke database
  
      Swal.fire({
        title: "Order Berhasil Disimpan!",
        text: "Pesanan Anda telah berhasil disimpan.",
        icon: "success",
        confirmButtonColor: "#33BADE",
      }).then(() => {
        router.push("/my-orders");
      });
    } catch (error) {
      console.error("Error saving order:", error);
      Swal.fire({
        title: "Terjadi Kesalahan!",
        text: "Gagal menyimpan order, coba lagi nanti.",
        icon: "error",
        confirmButtonColor: "#33BADE",
      });
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };
  const generateWhatsAppMessage = (
    order: Omit<OrderData, "createdAt" | "lastUpdated"> & { createdAt: Timestamp; lastUpdated: Timestamp }
  ) => {
    const finalPrice = order.totalPrice || 0;
  
    return `
  * ORDER BARU*
   Nama: ${order.customerName}
   Nomor WhatsApp: ${order.whatsappNumber}
   Project: ${order.projectType}
   Platform: ${order.platform || "Belum dipilih"}
   Nama Aplikasi: ${order.projectName || "Belum diisi"}
  
   Metode Pengembangan: ${order.developmentMethod || "Belum dipilih"}
   Teknologi:
     ${order.fullstackChoice ? `- Fullstack: ${order.fullstackChoice.framework} + ${order.fullstackChoice.database}` : ""}
     ${order.mixmatchChoice ? `- Mixmatch: ${order.mixmatchChoice.frontend} + ${order.mixmatchChoice.backend} + ${order.mixmatchChoice.api} + ${order.mixmatchChoice.database}` : ""}
     ${order.uiFramework?.length ? `- UI Framework: ${order.uiFramework.join(", ")}` : ""}
     ${order.flutterUIFrameworks?.length ? `- Flutter UI: ${order.flutterUIFrameworks.join(", ")}` : ""}
  
   Tema UI: ${order.themeChoice?.mode || "Default"}
   Warna Custom: ${order.customColors?.colors?.join(", ") || "Tidak ada"}
  
   Tipe Notifikasi: ${order.notificationType || "Tidak ada"}
   Link Referensi: ${order.referenceLink || "Tidak ada"}
  
   Deadline: ${order.deadline || "Tidak ada"}
   Catatan: ${order.notes || "Tidak ada"}
  
   Metode Pembayaran: ${order.paymentMethod || "Belum dipilih"}
   Diskon: ${order.discount || 0}%
   Total: Rp ${finalPrice.toLocaleString("id-ID")}
  `.trim();
  };
  

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary text-center">
        Finalisasi Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-800 mb-2">Nama Lengkap</label>
          <input
            type="text"
            value={orderData.customerName}
            onChange={(e) => updateOrderData({ customerName: e.target.value })}
            className="w-full p-2 bg-gray-100 border border-gray-600 rounded-lg text-gray-800"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <div>
          <label className="block text-gray-800 mb-2">Nomor WhatsApp</label>
          <input
            type="tel"
            value={orderData.whatsappNumber}
            onChange={(e) => updateOrderData({ whatsappNumber: e.target.value })}
            className="w-full p-2 bg-gray-100 border border-gray-600 rounded-lg text-gray-800"
            placeholder="Contoh: 08123456789"
            required
          />
        </div>

        <div>
          <label className="block text-gray-800 mb-2">Metode Pembayaran</label>
          <select
            value={orderData.paymentMethod}
            onChange={(e) => updateOrderData({ paymentMethod: e.target.value as "DANA" | "OVO" | "GOPAY" })}
            className="w-full p-2 bg-gray-100 border border-gray-600 rounded-lg text-gray-800"
            required
          >
            <option value="">Pilih Metode Pembayaran</option>
            <option value="DANA">DANA</option>
            <option value="OVO">OVO</option>
            <option value="GOPAY">GOPAY</option>
          </select>
        </div>



        <div className="flex justify-between pt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-gray-800 rounded-lg disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Kirim Order"}
          </button>
        </div>
      </form>

{/* Popup Konfirmasi dengan Scroll */}
{showConfirmation && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4 overflow-y-auto">
    <div className="bg-white rounded-xl border border-primary shadow-2xl w-full max-w-3xl my-4 sm:my-8 relative z-[101]">
      {/* Modal Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Konfirmasi Order</h2>
          <button 
            onClick={() => setShowConfirmation(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <span className="text-gray-400 hover:text-gray-600 text-xl">✕</span>
          </button>
        </div>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Mohon periksa kembali detail pesanan Anda sebelum melanjutkan.
        </p>
      </div>

      {/* Modal Body with Scroll */}
      <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
        <OrderSummary orderData={orderData} isPreview={true} />
      </div>

      {/* Modal Footer */}
      <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            onClick={() => setShowConfirmation(false)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm sm:text-base"
          >
            Batalkan
          </button>
          <button
            onClick={() => handleSaveOrder(false)}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? "Menyimpan..." : "Konfirmasi Pesanan"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
export default Step4;
