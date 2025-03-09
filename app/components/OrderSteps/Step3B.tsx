"use client";

import { useState } from "react";
import { OrderData } from "../../../lib/types/order";
import { PRICE_LIST } from "../../../lib/utils/priceCalculator";
import { ChromePicker } from "react-color";
import { ColorResult } from "react-color";


interface Step3BProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Step3B = ({
  orderData,
  updateOrderData,
}: Step3BProps) => {
  const [developmentMethod, setDevelopmentMethod] = useState<
    "fullstack" | "mixmatch"
  >("fullstack");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#ffffff");

  const handleFullstackChange = (
    type: "framework" | "database",
    value: string
  ) => {
    updateOrderData({
      developmentMethod: "fullstack",
      fullstackChoice: {
        framework:
          type === "framework"
            ? value
            : orderData.fullstackChoice?.framework || "",
        database:
          type === "database"
            ? value
            : orderData.fullstackChoice?.database || "",
      },
    });
  };

  const handleMixMatchChange = (
    type: "frontend" | "backend" | "api" | "database",
    value: string
  ) => {
    updateOrderData({
      developmentMethod: "mixmatch",
      mixmatchChoice: {
        frontend:
          type === "frontend"
            ? value
            : orderData.mixmatchChoice?.frontend || "",
        backend:
          type === "backend" ? value : orderData.mixmatchChoice?.backend || "",
        api: type === "api" ? value : orderData.mixmatchChoice?.api || "",
        database:
          type === "database"
            ? value
            : orderData.mixmatchChoice?.database || "",
      },
    });
  };

  const handleColorChange = (color: ColorResult) => {
    setCurrentColor(color.hex);
    const currentColors = orderData.customColors?.colors || [];
    if (currentColors.length < (orderData.customColors?.count || 0)) {
      updateOrderData({
        customColors: {
          count: orderData.customColors?.count || 1,
          colors: [...currentColors, color.hex],
        },
      });
    }
  };

  // Menghitung total harga
  const calculateTotal = () => {
    let total = 0;

    // Hitung role
    orderData.roles?.forEach((role) => {
      total += PRICE_LIST.roles[role] || 0;
    });

    // Hitung stack teknologi
    if (developmentMethod === "fullstack" && orderData.fullstackChoice) {
      total +=
        PRICE_LIST.fullstackFrameworks[orderData.fullstackChoice.framework] ||
        0;
      total += PRICE_LIST.databases[orderData.fullstackChoice.database] || 0;
    } else if (orderData.mixmatchChoice) {
      total += PRICE_LIST.frontends[orderData.mixmatchChoice.frontend] || 0;
      total += PRICE_LIST.backends[orderData.mixmatchChoice.backend] || 0;
      total += PRICE_LIST.apis[orderData.mixmatchChoice.api] || 0;
      total += PRICE_LIST.databases[orderData.mixmatchChoice.database] || 0;
    }

// Hitung harga UI Framework
if (orderData.uiFramework) {
  orderData.uiFramework.forEach(framework => {
    total += PRICE_LIST.uiFrameworks[framework] || 0;
  });
}

// Hitung harga Flutter UI Framework (jika ada)
if (orderData.uiFramework) {
  orderData.uiFramework.forEach(framework => {
    if (framework.startsWith("flutter-")) {
      total += PRICE_LIST.flutterUIFrameworks?.[framework] || 0;
    }
  });
}


      // Hitung harga UI Themes (Mode)
  if (orderData.themeChoice?.mode) {
    total += PRICE_LIST.uiThemes[orderData.themeChoice.mode] || 0;
  }


    // Hitung notifikasi
    if (orderData.notificationType) {
      total += PRICE_LIST.notifications[orderData.notificationType] || 0;
    }

    // Hitung deadline
    if (orderData.deadline) {
      total += PRICE_LIST.deadlines[orderData.deadline] || 0;
    }

    return total;
  };

  const [customRole, setCustomRole] = useState("");
  const [editingRole, setEditingRole] = useState<string | null>(null);
  
  const handleRoleChange = (role: string, checked: boolean) => {
    const currentRoles = orderData.roles || [];
    const newRoles = checked
      ? [...currentRoles, role] // Tambah jika dicentang
      : currentRoles.filter((r) => r !== role); // Hapus jika tidak dicentang
  
    updateOrderData({ roles: newRoles });
  };
  
  const handleCustomRoleChange = () => {
    if (customRole.trim() === "") return;
  
    const currentRoles = orderData.roles || [];
  
    // Jika sedang mengedit, update role yang diedit
    if (editingRole) {
      const updatedRoles = currentRoles.map((role) =>
        role === editingRole ? customRole : role
      );
      updateOrderData({ roles: updatedRoles });
      setEditingRole(null);
    } else {
      // Tambahkan role baru jika belum ada
      if (!currentRoles.includes(customRole)) {
        updateOrderData({ roles: [...currentRoles, customRole] });
      }
    }
  
    setCustomRole(""); // Reset input setelah ditambahkan atau diedit
  };
  
  const handleEditRole = (role: string) => {
    setCustomRole(role);
    setEditingRole(role);
  };
  
  const handleDeleteRole = (role: string) => {
    const updatedRoles = orderData.roles?.filter((r) => r !== role) || [];
    updateOrderData({ roles: updatedRoles });
  };

  return (
    <div className="space-y-6 overflow-x-hidden pb-32">
      <h2 className="text-xl sm:text-2xl font-bold text-primary text-center">
        Teknologi & UI Framework
      </h2>

      {/* 1. Role Selection */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-medium text-gray-800">1️⃣ Role dalam Sistem</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(PRICE_LIST.roles).map(([role, price]) => (
            <label
              key={role}
              className="flex items-center space-x-2 p-2 sm:p-3 border border-gray-600 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            >
              <input
                type="checkbox"
                checked={orderData.roles?.includes(role)}
                onChange={(e) => handleRoleChange(role, e.target.checked)}
                className="form-checkbox h-4 w-4 text-primary"
              />
              <span className="text-sm sm:text-base text-gray-800">
                {role} - Rp {price.toLocaleString()}
              </span>
            </label>
          ))}
        </div>

        {/* Custom Role Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="Masukkan role kustom"
            className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-50 text-gray-800 text-sm sm:text-base"
          />
          <button
            onClick={handleCustomRoleChange}
            className={`px-4 py-2 rounded-lg ${
              editingRole ? "bg-yellow-500" : "bg-primary"
            } text-white text-sm sm:text-base whitespace-nowrap`}
          >
            {editingRole ? "Update" : "Tambah"}
          </button>
        </div>

        {/* Daftar Role Kustom */}
        <div className="mt-4 space-y-2">
          {orderData.roles?.map((role) =>
            !Object.keys(PRICE_LIST.roles).includes(role) ? (
              <div
                key={role}
                className="flex justify-between items-center p-2 border border-gray-500 rounded-md bg-gray-600 text-gray-100"
              >
                <span>{role} - (Harga bisa di sesuaikan nanti)</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="px-2 py-1 text-sm bg-yellow-500 text-gray-800 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="px-2 py-1 text-sm bg-red-500 text-gray-800 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* 2. Development Method */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-medium text-gray-800">
          2️⃣ Metode Pengembangan
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 p-2 sm:p-3 border border-gray-600 rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
            <input
              type="radio"
              checked={developmentMethod === "fullstack"}
              onChange={() => setDevelopmentMethod("fullstack")}
              className="form-radio h-4 w-4 text-primary"
            />
            <span className="text-sm sm:text-base text-gray-800">Fullstack dengan 1 Framework</span>
          </label>
          <label className="flex items-center space-x-2 p-2 sm:p-3 border border-gray-600 rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
            <input
              type="radio"
              checked={developmentMethod === "mixmatch"}
              onChange={() => setDevelopmentMethod("mixmatch")}
              className="form-radio h-4 w-4 text-primary"
            />
            <span className="text-sm sm:text-base text-gray-800">
              Frontend, Backend, & Database Terpisah
            </span>
          </label>
        </div>
      </div>

      {/* Development Method Options */}
      {developmentMethod === "fullstack" ? (
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-medium text-gray-800">Pilih Framework</h3>
            <select
              className="w-full p-2 sm:p-3 bg-white border border-gray-600 rounded-lg text-sm sm:text-base text-gray-800"
              value={orderData.fullstackChoice?.framework || ""}
              onChange={(e) => handleFullstackChange("framework", e.target.value)}
            >
              <option value="">Pilih Framework</option>
              {Object.entries(PRICE_LIST.fullstackFrameworks).map(
                ([framework, price]) => (
                  <option key={framework} value={framework}>
                    {framework} - Rp {price.toLocaleString()}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-medium text-gray-800">Pilih Database</h3>
            <select
              className="w-full p-2 sm:p-3 bg-white border border-gray-600 rounded-lg text-sm sm:text-base text-gray-800"
              value={orderData.fullstackChoice?.database || ""}
              onChange={(e) => handleFullstackChange("database", e.target.value)}
            >
              <option value="">Pilih Database</option>
              {Object.entries(PRICE_LIST.databases).map(([db, price]) => (
                <option key={db} value={db}>
                  {db} - Rp {price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Frontend Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">Frontend</h3>
            <select
              className="w-full p-2 bg-white border border-gray-600 rounded-lg text-gray-800"
              value={orderData.mixmatchChoice?.frontend || ""}
              onChange={(e) => handleMixMatchChange("frontend", e.target.value)}
            >
              <option value="">Pilih Frontend</option>
              {Object.entries(PRICE_LIST.frontends).map(([tech, price]) => (
                <option key={tech} value={tech}>
                  {tech} - Rp {price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Backend Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">Backend</h3>
            <select
              className="w-full p-2 bg-white border border-gray-600 rounded-lg text-gray-800"
              value={orderData.mixmatchChoice?.backend || ""}
              onChange={(e) => handleMixMatchChange("backend", e.target.value)}
            >
              <option value="">Pilih Backend</option>
              {Object.entries(PRICE_LIST.backends).map(([tech, price]) => (
                <option key={tech} value={tech}>
                  {tech} - Rp {price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* API Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">API</h3>
      <select
              className="w-full p-2 bg-white border border-gray-600 rounded-lg text-gray-800"
              value={orderData.mixmatchChoice?.api || ""}
              onChange={(e) => handleMixMatchChange("api", e.target.value)}
            >
              <option value="">Pilih API</option>
              {Object.entries(PRICE_LIST.apis).map(([tech, price]) => (
                <option key={tech} value={tech}>
                  {tech} - Rp {price.toLocaleString()}
                </option>
              ))}
      </select>
          </div>

          {/* Database Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">Database</h3>
      <select
              className="w-full p-2 bg-white border border-gray-600 rounded-lg text-gray-800"
              value={orderData.mixmatchChoice?.database || ""}
              onChange={(e) => handleMixMatchChange("database", e.target.value)}
      >
        <option value="">Pilih Database</option>
              {Object.entries(PRICE_LIST.databases).map(([tech, price]) => (
                <option key={tech} value={tech}>
                  {tech} - Rp {price.toLocaleString()}
                </option>
              ))}
      </select>
          </div>
        </div>
      )}

      {/* UI Framework Selection */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-medium text-gray-800">3️⃣ UI Framework</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(orderData.fullstackChoice?.framework?.includes("flutter") ||
           orderData.mixmatchChoice?.frontend?.includes("flutter")
            ? Object.entries(PRICE_LIST.flutterUIFrameworks)
            : Object.entries(PRICE_LIST.uiFrameworks)
          ).map(([framework, price]) => (
            <label
              key={framework}
              className="flex items-center space-x-2 p-2 sm:p-3 border border-gray-600 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            >
              <input
                type="checkbox"
                checked={orderData.uiFramework?.includes(framework)}
                onChange={(e) => {
                  const current = orderData.uiFramework || [];
                  updateOrderData({
                    uiFramework: e.target.checked
                      ? [...current, framework]
                      : current.filter((f) => f !== framework),
                  });
                }}
                className="form-checkbox h-4 w-4 text-primary"
              />
              <span className="text-sm sm:text-base text-gray-800">
                {framework.replace("flutter-", "").toUpperCase()} - Rp {price.toLocaleString()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-medium text-gray-800">4️⃣ Tema UI</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            className="w-full p-2 sm:p-3 bg-white border border-gray-600 rounded-lg text-sm sm:text-base text-gray-800"
            value={orderData.themeChoice?.mode || ""}
            onChange={(e) =>
              updateOrderData({
                themeChoice: {
                  ...orderData.themeChoice,
                  mode: e.target.value as "light" | "dark" | "auto" | "custom",
                },
              })
            }
          >
            <option value="">Pilih Mode Tema</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="auto">Auto (Switch Dark/Light)</option>
          </select>

          <select
            className="w-full p-2 sm:p-3 bg-white border border-gray-600 rounded-lg text-sm sm:text-base text-gray-800"
            value={orderData.themeChoice?.style || ""}
            onChange={(e) =>
              updateOrderData({
                themeChoice: {
                  ...orderData.themeChoice,
                  style: e.target.value,
                },
              })
            }
          >
            <option value="">Pilih Style Tema</option>
            <option value="fresh">Fresh</option>
            <option value="beautiful">Beautiful</option>
            <option value="elegant">Elegant</option>
            <option value="modern">Modern</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="minimalist">Minimalist</option>
          </select>
        </div>
      </div>

      {/* Notification Type */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-medium text-gray-800">5️⃣ Tipe Notifikasi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(PRICE_LIST.notifications).map(([type, price]) => (
            <label
              key={type}
              className="flex items-center space-x-2 p-2 sm:p-3 border border-gray-600 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            >
              <input
                type="radio"
                name="notification"
                value={type}
                checked={orderData.notificationType === type}
                onChange={(e) => updateOrderData({ notificationType: e.target.value })}
                className="form-radio h-4 w-4 text-primary"
              />
              <span className="text-sm sm:text-base text-gray-800">
                {type} {price > 0 ? `- Rp ${price.toLocaleString()}` : "- Gratis"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Deadline Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-800">6️⃣ Custom Warna UI (Opsional)</h3>
        <div className="space-y-4">
          <input
            type="number"
            min="1"
            max="5"
            value={orderData.customColors?.count || 1}
            onChange={(e) =>
              updateOrderData({
                customColors: {
                  count: parseInt(e.target.value),
                  colors: orderData.customColors?.colors || [],
                },
              })
            }
            className="w-full p-2 bg-white border border-gray-600 rounded-lg text-gray-800"
            placeholder="Jumlah warna utama (1-5)"
          />

          {showColorPicker && (
            <div className="relative z-50 bg-gray-200 p-4 rounded-lg">
              <ChromePicker color={currentColor} onChange={handleColorChange} />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="px-4 py-2 bg-gray-600 text-gray-800 rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const currentColors = orderData.customColors?.colors || [];
                    if (
                      currentColors.length <
                      (orderData.customColors?.count || 1)
                    ) {
                      updateOrderData({
                        customColors: {
                          count: orderData.customColors?.count || 1,
                          colors: [...currentColors, currentColor],
                        },
                      });
                    }
                    setShowColorPicker(false);
                  }}
                  className="px-4 py-2 bg-zinc-400 text-gray-800 rounded-lg"
                >
                  Tambah Warna
                </button>
              </div>
            </div>
          )}

          {/* Display & Edit Colors */}
          <div className="flex flex-wrap gap-2">
            {orderData.customColors?.colors.map((color, index) => (
              <div key={index} className="relative group">
                <div
                  style={{ backgroundColor: color }}
                  className="w-8 h-8 rounded-full border border-gray-600"
                />
                <button
                  onClick={() => {
                    const newColors = [
                      ...(orderData.customColors?.colors || []),
                    ];
                    newColors.splice(index, 1);
                    updateOrderData({
                      customColors: {
                        count: orderData.customColors?.count || 1,
                        colors: newColors,
                      },
                    });
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-gray-800 rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
            {(orderData.customColors?.colors.length || 0) <
              (orderData.customColors?.count || 1) && (
              <button
                onClick={() => setShowColorPicker(true)}
                className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-800"
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>


      {/* Deadline Section */}
      <div className="mt-6">
      <h3 className="text-base sm:text-lg font-medium text-gray-800">⏰ Pilih Deadline</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "standard", label: "30 Hari", price: "Free" },
            { id: "14days", label: "14 Hari", price: "+Rp 30.000" },
            { id: "7days", label: "7 Hari", price: "+Rp 55.000" },
            { id: "3days", label: "3 Hari", price: "+Rp 85.000" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => updateOrderData({ deadline: option.id })}
              className={`p-2 sm:p-3 rounded-lg border text-sm sm:text-base transition-all ${
                orderData.deadline === option.id
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-gray-50 border-gray-300 text-gray-700 hover:border-primary/50"
              }`}
            >
              <div>{option.label}</div>
              <div className="text-xs sm:text-sm opacity-75">{option.price}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-8 space-y-4">
        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3">📝 Catatan Tambahan (Opsional)</h3>
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <textarea
            value={orderData.notes || ""}
            onChange={(e) => updateOrderData({ notes: e.target.value })}
            placeholder="Tuliskan catatan atau permintaan khusus untuk project Anda..."
            className="w-full p-4 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-800 min-h-[120px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
          />
        </div>
      </div>

      {/* Total Price Display */}
      <div className="fixed bottom-24 left-0 right-0 z-50">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-white border border-primary rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-800 text-center mb-2">Total Harga</h3>
            {orderData.discount ? (
              <div className="space-y-1">
                <p className="text-base sm:text-lg text-gray-600 line-through text-center">
                  Rp {calculateTotal().toLocaleString()}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-primary text-center">
                  Rp {(calculateTotal() * (1 - orderData.discount / 100)).toLocaleString()}
                </p>
                <p className="text-sm text-green-500 text-center">
                  Hemat {orderData.discount}% (Rp {((calculateTotal() * orderData.discount) / 100).toLocaleString()})
                </p>
              </div>
            ) : (
              <p className="text-xl sm:text-2xl font-bold text-primary text-center">
                Rp {calculateTotal().toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add padding at the bottom to prevent content from being hidden behind fixed total price */}
      <div className="h-40" />
    </div>
  );
};

export default Step3B;
