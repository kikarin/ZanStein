"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
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
  WrenchScrewdriverIcon,
  CodeBracketSquareIcon,
  PaintBrushIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export default function MyOrders() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user]);

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
  

  const getStatusBadge = (status: string) => {
    const statusMap = {
      Pending: "bg-yellow-500 text-white",
      Diproses: "bg-blue-500 text-white",
      Selesai: "bg-green-500 text-white",
      Dibatalkan: "bg-red-500 text-white",
    };
    return statusMap[status] || "bg-gray-500 text-white";
  };

  if (loading) return <div className="text-center mt-8 text-lg font-medium">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary text-center mb-6">Pesanan Saya</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">Belum ada pesanan.</div>
      ) : (
        <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="glass-card p-4 md:p-5 space-y-4 rounded-lg border border-gray-300 transition-all hover:shadow-md hover:backdrop-blur-none"
              whileHover={{ scale: 1.01 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold text-primary">{order.projectName}</h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-md ${getStatusBadge(order.status)}`}>{order.status}</span>
              </div>

              {/* Info Grid */}
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm">
                <p className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  Nama: <span className="font-medium text-gray-800">{order.customerName}</span>
                </p>
                <p className="flex items-center gap-2">
                  <DevicePhoneMobileIcon className="w-4 h-4 text-gray-500" />
                  WhatsApp: <span className="font-medium text-gray-800">{order.whatsappNumber}</span>
                </p>
                <p className="flex items-center gap-2">
                  <CreditCardIcon className="w-4 h-4 text-gray-500" />
                  Pembayaran: <span className="font-medium text-gray-800">{order.paymentMethod}</span>
                </p>
                <p className="flex items-center gap-2">
                  <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                  Platform: <span className="font-medium text-gray-800">{order.platform}</span>
                </p>
                <p className="flex items-center gap-2">
                  <CodeBracketSquareIcon className="w-4 h-4 text-gray-500" />
                  Metode: <span className="font-medium text-gray-800">{order.developmentMethod}</span>
                </p>
                <p className="flex items-center gap-2">
                  <ServerStackIcon className="w-4 h-4 text-gray-500" />
                  Database: <span className="font-medium text-gray-800">{order.fullstackChoice?.database || order.mixmatchChoice?.database || "Tidak tersedia"}</span>
                </p>
              </div>

              {/* Price & Discount */}
              <div className="text-gray-700 font-medium flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-500" />
                Rp {order.finalPrice?.toLocaleString()}
                {order.discount > 0 && <span className="text-green-500 text-sm ml-2">(Diskon {order.discount}%)</span>}
              </div>

              {/* Order Date */}
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                Dibuat: {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : "Tidak tersedia"}
              </p>

              {/* Cancel Note */}
              {order.status === "Pending" && (
                <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md flex items-center gap-2">
                  <BellIcon className="w-4 h-4 text-gray-500" />
                  Pesanan tidak bisa dibatalkan jika sudah diproses.
                </p>
              )}

              {/* Action Buttons */}
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
