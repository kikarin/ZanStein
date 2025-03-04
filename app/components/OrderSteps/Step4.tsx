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

  useEffect(() => {
    const checkDiscountUsage = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().hasUsedDiscount) {
          setHasUsedDiscount(true);
          updateOrderData({ discount: 0 });
        }
      } catch (error) {
        console.error("Error checking discount:", error);
      }
    };
  
    checkDiscountUsage();
  }, [user, updateOrderData]);
  

  useEffect(() => {
    if (user) {
      updateOrderData({ 
        customerName: user.displayName || '',
        isNameLocked: true
      });
    }
  }, [user, updateOrderData]);
  

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
  
      if (!orderData.projectType || !orderData.platform || !orderData.projectName) {
        Swal.fire({
          title: "Data Proyek Belum Lengkap!",
          text: "Mohon lengkapi data proyek sebelum melanjutkan.",
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
        paymentMethod: orderData.paymentMethod || '',
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
      
      if (user && orderData.discount) {
        await updateDoc(doc(db, "users", user.uid), {
          hasUsedDiscount: true
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
          const waMessage = generateWhatsAppMessage(orderDataToSave);
          window.open(
            `https://wa.me/6285693531495?text=${encodeURIComponent(waMessage)}`,
            "_blank"
          );
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
        router.push("/");
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
  const generateWhatsAppMessage = (order: OrderData) => {
    return `
*🛒 ORDER BARU*
Nama: ${order.customerName}
Project: ${order.projectType}
Platform: ${order.platform}
Aplikasi: ${order.projectName}

Deadline: ${order.deadline}
Total: Rp ${finalPrice.toLocaleString()}
${order.notes ? `\nCatatan: ${order.notes}` : ''}
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
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-y-auto">
          <div className="bg-gray-100 p-6 rounded-lg border border-primary w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">
                Konfirmasi Order
              </h2>
              <button 
                onClick={() => setShowConfirmation(false)}
                className="text-gray-400 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <OrderSummary orderData={orderData} isPreview={true} />
            </div>

            <div className="flex justify-between mt-6 gap-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-gray-800 rounded-lg hover:bg-gray-700"
              >
                Batalkan
              </button>
              <button
                onClick={() => handleSaveOrder(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary text-gray-800 rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Pesan"}
              </button>
              <button
                onClick={() => handleSaveOrder(true)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-gray-800 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Pesan & Teruskan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4;
