"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ServerStackIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DevicePhoneMobileIcon,
  UserIcon,
  CreditCardIcon,
  GlobeAltIcon,
  CodeBracketSquareIcon,
  BellIcon,
  ClipboardIcon,
  CubeIcon,
  AdjustmentsVerticalIcon,
  LinkIcon,
  CogIcon,
  PaintBrushIcon,
  DeviceTabletIcon,
  SunIcon,
  SwatchIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

interface Order {
  id: string;
  userId?: string;
  customerName: string;
  whatsappNumber: string;
  paymentMethod?: "DANA" | "OVO" | "GOPAY";
  isNameLocked?: boolean;
  projectType: string;
  platform: string;
  projectName: string;
  applicationType: string;
  customApplicationType?: string;
  referenceLink?: string;
  developmentMethod?: "fullstack" | "mixmatch";
  fullstackChoice?: { framework: string; database: string };
  mixmatchChoice?: {
    frontend: string;
    backend: string;
    api: string;
    database: string;
  };
  roles?: string[];
  uiFramework?: string[];
  flutterUIFrameworks?: string[];
  themeChoice?: { mode?: string; style?: string };
  notificationType?: string;
  customColors?: { colors: string[]; count?: number };
  deadline?: string;
  notes?: string;
  originalPrice?: number;
  finalPrice?: number;
  discount?: number;
  totalPrice?: number;
  voucherCode?: string;
  status?: string;
  createdAt?: { seconds: number };
  lastUpdated?: { seconds: number };
}
export default function MyOrders() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, router]); // ✅ Tambahkan router

  const copyOrderToClipboard = (order: Order) => {
    const orderText = `
  📌 *Detail Pesanan* 📌
  -----------------------------------
  👤 *Nama:* ${order.customerName}
  📱 *WhatsApp:* ${order.whatsappNumber}
  💰 *Pembayaran:* ${order.paymentMethod || "Belum dipilih"}
  
  📌 *Informasi Proyek*
  🔹 *Nama Proyek:* ${order.projectName}
  🔹 *Platform:* ${order.platform}
  🔹 *Tipe Aplikasi:* ${order.applicationType}
  ${
    order.customApplicationType
      ? `🔹 *Tipe Kustom:* ${order.customApplicationType}`
      : ""
  }
  ${order.referenceLink ? `🔗 *Referensi:* ${order.referenceLink}` : ""}
  
  📌 *Pengembangan*
  🔧 *Metode:* ${order.developmentMethod || "Belum dipilih"}
  ${
    order.fullstackChoice
      ? `⚙️ *Fullstack:* ${order.fullstackChoice.framework} | ${order.fullstackChoice.database}`
      : ""
  }
  ${
    order.mixmatchChoice
      ? `🖥️ *Mixmatch:* Frontend - ${order.mixmatchChoice.frontend} | Backend - ${order.mixmatchChoice.backend} | API - ${order.mixmatchChoice.api} | DB - ${order.mixmatchChoice.database}`
      : ""
  }
  
  🎨 *Desain & UI*
  ${
    order.uiFramework
      ? `🖌️ *UI Framework:* ${order.uiFramework.join(", ")}`
      : ""
  }
  ${
    order.flutterUIFrameworks
      ? `📱 *Flutter UI:* ${order.flutterUIFrameworks.join(", ")}`
      : ""
  }
  ${
    order.themeChoice
      ? `🌙 *Tema:* ${order.themeChoice.mode || "Default"} - ${
          order.themeChoice.style || "Default"
        }`
      : ""
  }
  
  🔔 *Notifikasi:* ${order.notificationType || "Tidak ada"}
  🕒 *Batas Waktu:* ${order.deadline || "Tidak ada"}
  
  💵 *Total Harga:* Rp ${order.finalPrice?.toLocaleString("id-ID")}
  ${
    order.discount && order.discount > 0
      ? `🎉 *Diskon:* ${order.discount}%`
      : ""
  }
  -----------------------------------
  
  📅 *Dibuat:* ${
    order.createdAt?.seconds
      ? new Date(order.createdAt.seconds * 1000).toLocaleString("id-ID")
      : "Tidak tersedia"
  }
  
  ✅ *Status:* ${order.status}
    `;

    navigator.clipboard
      .writeText(orderText)
      .then(() => {
        alert("Pesanan telah disalin ke clipboard!");
      })
      .catch((err) => console.error("Gagal menyalin:", err));
  };

  const sendOrderToWhatsApp = ( ) => {
    const phoneNumber = "6285693531495"; // Nomor WhatsApp admin (tanpa +)


    window.open(`https://wa.me/${phoneNumber}?text=`, "_blank");
  };

  const handleCancelOrder = async (orderId: string) => {
    const confirm = await Swal.fire({
      title: "Konfirmasi Pembatalan",
      text: "Apakah Anda yakin ingin membatalkan pesanan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Batalkan!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#33BADE",
    });

    if (!confirm.isConfirmed) return;

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "Dibatalkan",
        lastUpdated: new Date(),
      });

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "Dibatalkan" } : order
        )
      );

      Swal.fire({
        title: "Pesanan Dibatalkan!",
        text: "Pesanan berhasil dibatalkan.",
        icon: "success",
        confirmButtonColor: "#33BADE",
      });
    } catch (error) {
      console.error("Error canceling order:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat membatalkan pesanan.",
        icon: "error",
        confirmButtonColor: "#33BADE",
      });
    }
  };

  const statusMap = {
    Pending: "bg-yellow-500 text-white",
    Diproses: "bg-blue-500 text-white",
    Selesai: "bg-green-500 text-white",
    Dibatalkan: "bg-red-500 text-white",
  };

  const getStatusBadge = (status: keyof typeof statusMap) => {
    return statusMap[status] || "bg-gray-500 text-white";
  };

  if (loading)
    return (
      <div className="text-center mt-8 text-lg font-medium">Loading...</div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary text-center mb-6">
        Pesanan Saya
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">Belum ada pesanan.</div>
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="glass-card p-4 md:p-5 space-y-4 rounded-lg border border-gray-300 transition-all hover:shadow-md hover:backdrop-blur-none"
              whileHover={{ scale: 1.01 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold text-primary">
                  {order.projectName}
                </h3>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-md ${getStatusBadge(
                    order.status as
                      | "Dibatalkan"
                      | "Pending"
                      | "Diproses"
                      | "Selesai"
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600 text-sm">
                {/* Add the corresponding closing tag */}
              </div>
              {/* Informasi Pengguna */}
              <p className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                Nama:{" "}
                <span className="font-medium text-gray-800">
                  {order.customerName}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <DevicePhoneMobileIcon className="w-4 h-4 text-gray-500" />
                WhatsApp:{" "}
                <span className="font-medium text-gray-800">
                  {order.whatsappNumber}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <CreditCardIcon className="w-4 h-4 text-gray-500" />
                Pembayaran:{" "}
                <span className="font-medium text-gray-800">
                  {order.paymentMethod || "Belum dipilih"}
                </span>
              </p>

              {/* Informasi Proyek */}
              <p className="flex items-center gap-2">
                <ClipboardIcon className="w-4 h-4 text-gray-500" />
                Nama Proyek:{" "}
                <span className="font-medium text-gray-800">
                  {order.projectName}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                Platform:{" "}
                <span className="font-medium text-gray-800">
                  {order.platform}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <CubeIcon className="w-4 h-4 text-gray-500" />
                Tipe Aplikasi:{" "}
                <span className="font-medium text-gray-800">
                  {order.applicationType}
                </span>
              </p>
              {order.customApplicationType && (
                <p className="flex items-center gap-2">
                  <AdjustmentsVerticalIcon className="w-4 h-4 text-gray-500" />
                  Tipe Kustom:{" "}
                  <span className="font-medium text-gray-800">
                    {order.customApplicationType}
                  </span>
                </p>
              )}
              {order.referenceLink && (
                <p className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-500" />
                  Referensi:{" "}
                  <a
                    href={order.referenceLink}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    Lihat
                  </a>
                </p>
              )}

              {/* Informasi Pengembangan */}
              <p className="flex items-center gap-2">
                <CodeBracketSquareIcon className="w-4 h-4 text-gray-500" />
                Metode Pengembangan:{" "}
                <span className="font-medium text-gray-800">
                  {order.developmentMethod || "Belum dipilih"}
                </span>
              </p>
              {order.developmentMethod === "fullstack" &&
                order.fullstackChoice && (
                  <>
                    <p className="flex items-center gap-2">
                      <CodeBracketSquareIcon className="w-4 h-4 text-gray-500" />
                      Framework:{" "}
                      <span className="font-medium text-gray-800">
                        {order.fullstackChoice.framework}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <ServerStackIcon className="w-4 h-4 text-gray-500" />
                      Database:{" "}
                      <span className="font-medium text-gray-800">
                        {order.fullstackChoice.database}
                      </span>
                    </p>
                  </>
                )}
              {order.developmentMethod === "mixmatch" &&
                order.mixmatchChoice && (
                  <>
                    <p className="flex items-center gap-2">
                      <CodeBracketSquareIcon className="w-4 h-4 text-gray-500" />
                      Frontend:{" "}
                      <span className="font-medium text-gray-800">
                        {order.mixmatchChoice.frontend}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CogIcon className="w-4 h-4 text-gray-500" />
                      Backend:{" "}
                      <span className="font-medium text-gray-800">
                        {order.mixmatchChoice.backend}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <PuzzlePieceIcon className="w-4 h-4 text-gray-500" />
                      API:{" "}
                      <span className="font-medium text-gray-800">
                        {order.mixmatchChoice.api}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <ServerStackIcon className="w-4 h-4 text-gray-500" />
                      Database:{" "}
                      <span className="font-medium text-gray-800">
                        {order.mixmatchChoice.database}
                      </span>
                    </p>
                  </>
                )}

              {/* Informasi Desain */}
              {order.uiFramework && (
                <p className="flex items-center gap-2">
                  <PaintBrushIcon className="w-4 h-4 text-gray-500" />
                  UI Framework:{" "}
                  <span className="font-medium text-gray-800">
                    {order.uiFramework.join(", ")}
                  </span>
                </p>
              )}
              {order.flutterUIFrameworks && (
                <p className="flex items-center gap-2">
                  <DeviceTabletIcon className="w-4 h-4 text-gray-500" />
                  Flutter UI:{" "}
                  <span className="font-medium text-gray-800">
                    {order.flutterUIFrameworks.join(", ")}
                  </span>
                </p>
              )}
              {order.themeChoice && (
                <>
                  <p className="flex items-center gap-2">
                    <SunIcon className="w-4 h-4 text-gray-500" />
                    Mode:{" "}
                    <span className="font-medium text-gray-800">
                      {order.themeChoice.mode || "Default"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <SwatchIcon className="w-4 h-4 text-gray-500" />
                    Style:{" "}
                    <span className="font-medium text-gray-800">
                      {order.themeChoice.style || "Default"}
                    </span>
                  </p>
                </>
              )}

              {/* Price & Discount */}
              <div className="text-gray-700 font-medium flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-500" />
                Rp {order.finalPrice?.toLocaleString()}
                {order.discount && order.discount > 0 && (
                  <span className="text-green-500 text-sm ml-2">
                    (Diskon {order.discount}%)
                  </span>
                )}
              </div>

              {/* Order Date */}
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                Dibuat:{" "}
                {order.createdAt?.seconds
                  ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                  : "Tidak tersedia"}
              </p>

              {/* Cancel Note */}
              {order.status === "Pending" && (
                <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md flex items-center gap-2">
                  <BellIcon className="w-4 h-4 text-gray-500" />
                  Pesanan tidak bisa dibatalkan jika sudah diproses.
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-start gap-3">
                {/* Tombol Salin */}
                <motion.button
                  onClick={() => copyOrderToClipboard(order)}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  📋 Salin Pesanan
                </motion.button>

                {/* Tombol Kirim ke WhatsApp */}
                <motion.button
                  onClick={sendOrderToWhatsApp}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-green-500 text-white hover:bg-green-600 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  📲 Kirim ke WhatsApp
                </motion.button>
              </div>
              {order.status === "Pending" && (
                <motion.button
                  onClick={() => handleCancelOrder(order.id)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Batalkan Pesanan
                </motion.button>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
