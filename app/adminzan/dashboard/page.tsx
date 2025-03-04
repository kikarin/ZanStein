"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebaseConfig";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Semua");

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
          fetchOrders();
        } else {
          router.push("/adminzan");
        }
      } else {
        router.push("/adminzan");
      }
    };

    checkAdmin();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const ordersRef = collection(db, "orders");
    const querySnapshot = await getDocs(ordersRef);
    const ordersList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(ordersList);
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/adminzan");
  };

  // 🔹 Update Status Order
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        lastUpdated: serverTimestamp(),
      });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal mengupdate status order");
    }
  };

  // 🔹 Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Anda yakin ingin menghapus order ini?")) return;

    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Gagal menghapus order");
    }
  };

  // 🔹 Filter Order Berdasarkan Status
  const filteredOrders =
    filterStatus === "Semua"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  if (!isAdmin)
    return <p className="text-center text-red-500">Akses Ditolak!</p>;

  return (
    <div className="mt-24 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8 bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">
                Dashboard Admin
              </h2>
              <p className="text-gray-400">Manage orders and monitor system status</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Logout</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats and Filter Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Status Filter Card */}
          <div className="bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Filter Orders</h3>
            </div>
            <select
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Semua">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Diproses">In Progress</option>
              <option value="Selesai">Completed</option>
              <option value="Dibatalkan">Cancelled</option>
            </select>
          </div>

          {/* Stats Card */}
          <div className="bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Total Orders</h3>
                <p className="text-3xl font-bold text-green-500 mt-2">{filteredOrders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List Section */}
        <div className="bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Order List</h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 text-lg">
                No orders found with status: {filterStatus}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 border border-gray-700 rounded-xl hover:border-primary/50 transition-all duration-300 bg-gray-800/30"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-4 border-b border-gray-700">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {order.projectName || "Unnamed Project"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {order.projectType}
                        </span>
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {order.platform}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Order ID</p>
                      <p className="font-mono text-gray-300">{order.id.slice(0, 8)}</p>
                    </div>
                  </div>

                  {/* Order Content - Keep existing content structure */}
                  {/* Customer Info */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-primary">
                      Informasi Pelanggan
                    </h4>
                    <p className="text-white">👤 Nama: {order.customerName || "N/A"}</p>
                    <p className="text-gray-400">
                      📱 WhatsApp: {order.whatsappNumber || "N/A"}
                    </p>
                    <p className="text-gray-400">
                      💳 Pembayaran: {order.paymentMethod || "N/A"}
                    </p>
                  </div>

                  {/* Project Details */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-primary">
                      Detail Proyek
                    </h4>
                    <p className="text-gray-400">📌 Tipe: {order.projectType || "N/A"}</p>
                    <p className="text-gray-400">📝 Nama: {order.projectName || "N/A"}</p>
                    <p className="text-gray-400">💻 Platform: {order.platform || "N/A"}</p>
                    <p className="text-gray-400">
                      🔧 Jenis: {order.applicationType || "N/A"}
                    </p>
                    <p className="text-gray-400">
                      🔗 Referensi: {order.referenceLink || "Tidak ada"}
                    </p>
                  </div>

                  {/* Development Details */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-primary">
                      Detail Pengembangan
                    </h4>
                    <p className="text-gray-400">
                      ⚙️ Metode: {order.developmentMethod}
                    </p>

                    {order.developmentMethod === "fullstack" &&
                      order.fullstackChoice && (
                        <>
                          <p className="text-gray-400">
                            🛠️ Framework: {order.fullstackChoice.framework}
                          </p>
                          <p className="text-gray-400">
                            📦 Database: {order.fullstackChoice.database}
                          </p>
                        </>
                      )}

                    {order.developmentMethod === "mixmatch" &&
                      order.mixmatchChoice && (
                        <>
                          <p className="text-gray-400">
                            🎨 Frontend: {order.mixmatchChoice.frontend}
                          </p>
                          <p className="text-gray-400">
                            ⚙️ Backend: {order.mixmatchChoice.backend}
                          </p>
                          <p className="text-gray-400">
                            🔌 API: {order.mixmatchChoice.api}
                          </p>
                          <p className="text-gray-400">
                            📦 Database: {order.mixmatchChoice.database}
                          </p>
                        </>
                      )}
                  </div>

                  {/* UI/UX Details */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-primary">Detail UI/UX</h4>
                    <p className="text-gray-400">
                      👥 Roles: {order.roles?.join(", ") || "Tidak ada"}
                    </p>
                    <p className="text-gray-400">
                      🎨 UI Framework: {order.uiFramework?.join(", ") || "Default"}
                    </p>
                    <p className="text-gray-400">
                      🎭 Theme: {order.themeChoice?.mode || "Default"}
                    </p>
                    <p className="text-gray-400">
                      🔔 Notifikasi: {order.notificationType || "Default"}
                    </p>
                    {order.customColors?.colors?.length > 0 && (
                      <p className="text-gray-400">
                        🎨 Custom Colors: {order.customColors.colors.join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-primary">Harga</h4>
                    <p className="text-gray-400">
                      💰 Harga Asli: Rp {order.originalPrice?.toLocaleString() || "0"}
                    </p>
                    {order.discount > 0 && (
                      <p className="text-green-500">🎉 Diskon: {order.discount}%</p>
                    )}
                    <p className="text-white font-bold">
                      💵 Total: Rp {order.finalPrice?.toLocaleString() || "0"}
                    </p>
                  </div>

                  {/* Additional Info */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-primary">
                      Info Tambahan
                    </h4>
                    <p className="text-gray-400">⏰ Deadline: {order.deadline}</p>
                    <p className="text-gray-400">
                      📝 Catatan: {order.notes || "Tidak ada"}
                    </p>
                    <p className="text-gray-400">
                      📅 Dibuat:{" "}
                      {new Date(order.createdAt?.seconds * 1000).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-700 flex gap-4">
                    <select
                      className="flex-1 px-4 py-2 rounded-xl bg-gray-800/50 text-white border border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      value={order.status || "Pending"}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="px-6 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
