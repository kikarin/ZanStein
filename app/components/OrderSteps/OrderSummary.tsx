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

    if (await checkVoucherUsage(orderData.voucherCode)) {
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
    router.push("/");
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
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-primary">
          Ringkasan Pesanan
        </h2>
        <p className="text-gray-500 mt-1">
          Pastikan data pesanan Anda sudah benar sebelum konfirmasi.
        </p>
      </div>

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-white/80 backdrop-blur-md shadow-xl rounded-lg border border-gray-200 space-y-4"
      >
        {Object.entries({
          "Jenis Proyek": orderData.projectType,
          Platform: orderData.platform || "Belum dipilih",
          "Nama Aplikasi": orderData.projectName || "Belum diisi",
          "Link Referensi": orderData.referenceLink || "Tidak ada",
          "Stack Teknologi": orderData.developmentMethod || "Belum dipilih",
          // "Fullstack Framework": orderData.fullstackChoice?.framework?.join(", ") || "Tidak ada",
          // "Frontend Framework": orderData.mixmatchChoice?.frontend?.join(", ") || "Tidak ada",
          // "Backend Framework": orderData.mixmatchChoice?.backend?.join(", ") || "Tidak ada",
          // "Database": orderData.databaseChoice?.join(", ") || "Tidak ada",
          // "API": orderData.apiChoice?.join(", ") || "Tidak ada",
          "UI Framework": orderData.uiFramework?.join(", ") || "Tidak ada",
          "Flutter UI Framework":
            orderData.uiFramework
              ?.filter((fw) => fw.startsWith("flutter"))
              .map((fw) => fw.replace("flutter-", "").toUpperCase())
              .join(", ") || "None",
          // "Notifikasi": orderData.notificationChoice?.join(", ") || "Tidak ada",
          "Tema UI": orderData.themeChoice?.mode || "Default",
          // "Style Tema": orderData.themeChoice?.style || "Default",
          "Batas Waktu": orderData.deadline || "Tidak ada",
          "Metode Pembayaran": orderData.paymentMethod || "Belum dipilih",
          Diskon: `${orderData.discount || 0}%`,
          "Total Harga": `Rp ${
            orderData.totalPrice?.toLocaleString("id-ID") || "0"
          }`,
        }).map(([label, value], index) => (
          <motion.p
            key={index}
            className="p-2 border-b last:border-none text-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <strong>{label}:</strong> {value}
          </motion.p>
        ))}
      </motion.div>

      {/* Navigation Buttons */}
      {!isPreview && prevStep && (
        <div className="flex justify-between pt-4">
          <motion.button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft />
            <span>Kembali</span>
          </motion.button>

          <motion.button
            onClick={() => saveOrderToFirestore()}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark shadow-lg"
            }`}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <FiCheck />
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
