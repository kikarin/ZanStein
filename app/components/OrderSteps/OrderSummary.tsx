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
    transition={{ duration: 0.3, ease: "easeOut" }} // Animasi lebih smooth
    className="space-y-6 p-4 sm:p-6 bg-white shadow-lg rounded-lg"
  >
    {/* Header */}
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-semibold text-primary">
        Data Pesanan
      </h2>
      <p className="text-gray-500 mt-2 text-sm sm:text-base">
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
      <h2 className="text-lg font-semibold text-gray-800">Detail Order</h2>

      <div className="space-y-3">
  {[
    { label: "Jenis Proyek", value: orderData.projectType },
    { label: "Platform", value: orderData.platform },
    { label: "Tipe Aplikasi", value: orderData.applicationType },
    { label: "Nama Aplikasi", value: orderData.projectName },
    { label: "Nomor WhatsApp", value: orderData.whatsappNumber },
    { label: "Link Referensi", value: orderData.referenceLink },
    { label: "Metode Pengembangan", value: orderData.developmentMethod },
    { label: "Pilihan Fullstack", value: orderData.fullstackChoice?.framework },
    { label: "Pilihan Database", value: orderData.fullstackChoice?.database },
    { label: "Pilihan Mixmatch (Frontend)", value: orderData.mixmatchChoice?.frontend },
    { label: "Pilihan Mixmatch (Backend)", value: orderData.mixmatchChoice?.backend },
    { label: "Pilihan Mixmatch (Database)", value: orderData.mixmatchChoice?.database },
    { label: "Roles", value: orderData.roles?.join(", ") },
    { label: "Framework UI", value: orderData.uiFramework?.join(", ") },
    { label: "Framework UI (Flutter)", value: orderData.flutterUIFrameworks?.join(", ") },
    { label: "Tipe Notifikasi", value: orderData.notificationType },
    { label: "Warna Custom", value: orderData.customColors?.colors?.join(", ") },
    { label: "Tema UI", value: orderData.themeChoice?.mode },
    { label: "Batas Waktu", value: orderData.deadline },
    { label: "Catatan", value: orderData.notes },
    { label: "Metode Pembayaran", value: orderData.paymentMethod },
    { label: "Diskon", value: orderData.discount ? `${orderData.discount}%` : null },
    { 
      label: "Total Harga", 
      value: orderData.totalPrice ? `Rp ${orderData.totalPrice.toLocaleString("id-ID")}` : null
    },
  ]
  // 🔥 Filter hanya data yang memiliki nilai
  .filter(({ value }) => value && value !== "Tidak ada" && value !== "Belum dipilih")
  .map(({ label, value }, index) => (
    <motion.p
      key={index}
      className="p-2 border-b last:border-none text-gray-700"
      whileHover={{ scale: 1.02 }}
    >
      <strong>{label}:</strong> {value}
    </motion.p>
  ))}
</div>

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

