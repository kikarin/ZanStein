"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { OrderData } from "../../../lib/types/order";
import { motion } from "framer-motion";
import { FiCheck, FiArrowLeft, FiLoader } from "react-icons/fi";
import Swal from "sweetalert2";

interface OrderSummaryProps {
  orderData: OrderData;
  isPreview?: boolean;
  prevStep?: () => void;
}

const OrderSummary = ({
  orderData,
  isPreview,
  prevStep,
}: OrderSummaryProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const checkVoucherUsage = async (voucherCode: string) => {
    if (!voucherCode) return false;
    try {
      const voucherRef = doc(db, "vouchers", voucherCode);
      const voucherSnap = await getDoc(voucherRef);
      return voucherSnap.exists() && voucherSnap.data().used;
    } catch (error) {
      console.error("Gagal memeriksa voucher:", error);
      return false;
    }
  };

  const saveOrderToFirestore = async () => {
    if (loading) return;

    const confirm = await Swal.fire({
      title: "Konfirmasi Pesanan",
      text: "Apakah Anda yakin ingin menyimpan pesanan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#33BADE",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    if (!orderData.totalPrice || !orderData.paymentMethod) {
      Swal.fire(
        "Oops!",
        "Harap isi metode pembayaran dan pastikan harga valid.",
        "warning"
      );
      setLoading(false);
      return;
    }

    if (orderData.voucherCode && await checkVoucherUsage(orderData.voucherCode)) {
      Swal.fire(
        "Gagal!",
        "Voucher sudah digunakan dan tidak bisa digunakan lagi!",
        "error"
      );
      setLoading(false);
      return;
    }

    try {
      console.log("Data sebelum disimpan:", orderData);

      await addDoc(collection(db, "orders"), {
        orderId: `ORD-${Date.now()}`,
        ...orderData,
        totalPrice: orderData.totalPrice || 0, // Pastikan tidak null
        uiFramework: orderData.uiFramework || [], // Pastikan tidak undefined
        orderDate: serverTimestamp(),
        orderStatus: "Pending",
      });

      if (orderData.voucherCode) {
        const voucherRef = doc(db, "vouchers", orderData.voucherCode);
        await updateDoc(voucherRef, { used: true });
      }

      Swal.fire("Berhasil!", "Pesanan berhasil disimpan!", "success").then(() => {
        router.push("/my-orders");
      });
    } catch (error) {
      console.error("Gagal menyimpan order:", error);
      Swal.fire("Error!", "Terjadi kesalahan saat menyimpan pesanan.", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">
          Detail Pesanan
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Mohon periksa kembali detail pesanan Anda
        </p>
      </div>

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
      >
        {/* Left Column - Basic Info */}
        <div className="space-y-4 bg-gray-50/80 p-4 sm:p-6 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2">
            Informasi Dasar
          </h3>
          <div className="space-y-3">
            {[
              { label: "Jenis Proyek", value: orderData.projectType },
              { label: "Platform", value: orderData.platform },
              { label: "Tipe Aplikasi", value: orderData.applicationType },
              { label: "Nama Aplikasi", value: orderData.projectName },
              { label: "Nomor WhatsApp", value: orderData.whatsappNumber },
              { label: "Link Referensi", value: orderData.referenceLink },
            ]
              .filter(({ value }) => value && value !== "Tidak ada" && value !== "Belum dipilih")
              .map(({ label, value }, index) => (
                <motion.div
                  key={index}
                  className="p-2 sm:p-3 bg-white rounded-lg shadow-sm"
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-sm sm:text-base font-medium text-gray-800">{value}</p>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Right Column - Technical Details */}
        <div className="space-y-4 bg-gray-50/80 p-4 sm:p-6 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2">
            Detail Teknis
          </h3>
          <div className="space-y-3">
            {[
              { label: "Metode Pengembangan", value: orderData.developmentMethod },
              { label: "Framework", value: orderData.fullstackChoice?.framework || orderData.mixmatchChoice?.frontend },
              { label: "Database", value: orderData.fullstackChoice?.database || orderData.mixmatchChoice?.database },
              { label: "Backend", value: orderData.mixmatchChoice?.backend },
              { label: "API", value: orderData.mixmatchChoice?.api },
              { label: "Roles", value: orderData.roles?.join(", ") },
              { label: "UI Framework", value: orderData.uiFramework?.join(", ") },
              { label: "Flutter UI", value: orderData.flutterUIFrameworks?.join(", ") },
            ]
              .filter(({ value }) => value && value !== "Tidak ada" && value !== "Belum dipilih")
              .map(({ label, value }, index) => (
                <motion.div
                  key={index}
                  className="p-2 sm:p-3 bg-white rounded-lg shadow-sm"
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-sm sm:text-base font-medium text-gray-800">{value}</p>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Bottom Section - Additional Details */}
        <div className="col-span-1 sm:col-span-2 space-y-4 bg-gray-50/80 p-4 sm:p-6 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2">
            Detail Tambahan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Tipe Notifikasi", value: orderData.notificationType },
              { label: "Tema UI", value: orderData.themeChoice?.mode },
              { label: "Warna Custom", value: orderData.customColors?.colors?.join(", ") },
              { label: "Batas Waktu", value: orderData.deadline },
              { label: "Metode Pembayaran", value: orderData.paymentMethod },
              { label: "Diskon", value: orderData.discount ? `${orderData.discount}%` : null },
            ]
              .filter(({ value }) => value && value !== "Tidak ada" && value !== "Belum dipilih")
              .map(({ label, value }, index) => (
                <motion.div
                  key={index}
                  className="p-2 sm:p-3 bg-white rounded-lg shadow-sm"
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-sm sm:text-base font-medium text-gray-800">{value}</p>
                </motion.div>
              ))}
          </div>

          {/* Notes Section */}
          {orderData.notes && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Catatan:</h4>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-sm sm:text-base text-gray-800">{orderData.notes}</p>
              </div>
            </div>
          )}

          {/* Total Price Section */}
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">Total Harga:</h4>
              <div className="text-right">
                {orderData.discount ? (
                  <>
                    <p className="text-sm line-through text-gray-500">
                      Rp {orderData.totalPrice?.toLocaleString("id-ID")}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-primary">
                      Rp {(orderData.totalPrice! * (1 - orderData.discount/100)).toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs sm:text-sm text-green-500">
                      Hemat {orderData.discount}%
                    </p>
                  </>
                ) : (
                  <p className="text-lg sm:text-xl font-bold text-primary">
                    Rp {orderData.totalPrice?.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      {!isPreview && prevStep && (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <motion.button
            onClick={prevStep}
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiArrowLeft className="text-lg" />
            <span>Kembali</span>
          </motion.button>

          <motion.button
            onClick={() => saveOrderToFirestore()}
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white transition-all flex items-center justify-center gap-2
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"}
            `}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin text-lg" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <FiCheck className="text-lg" />
                <span>Konfirmasi & Simpan</span>
              </>
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default OrderSummary;

