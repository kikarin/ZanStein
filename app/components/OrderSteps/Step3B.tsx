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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary text-center">
        Teknologi & UI Framework
      </h2>

      {/* 1. Role Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-800">1️⃣ Role dalam Sistem</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(PRICE_LIST.roles).map(([role, price]) => (
            <label
              key={role}
              className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg"
            >
              <input
                type="checkbox"
                checked={orderData.roles?.includes(role)}
                onChange={(e) => handleRoleChange(role, e.target.checked)}
                className="form-checkbox"
              />
              <span className="text-gray-800">
                {role} - Rp {price.toLocaleString()}
              </span>
            </label>
          ))}
        </div>

        {/* Input Custom Role */}
        <div className="flex space-x-2 mt-4">
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="Masukkan role kustom"
            className="p-2 border border-gray-600 rounded-lg bg-gray-200 text-gray-800"
          />
          <button
            onClick={handleCustomRoleChange}
            className={`px-4 py-2 rounded-lg ${
              editingRole ? "bg-yellow-500" : "bg-blue-500"
            } text-gray-800`}
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
        <h3 className="text-lg font-medium text-gray-800">
          2️⃣ Metode Pengembangan
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
            <input
              type="radio"
              checked={developmentMethod === "fullstack"}
              onChange={() => setDevelopmentMethod("fullstack")}
              className="form-radio"
            />
            <span className="text-gray-800">Fullstack dengan 1 Framework</span>
          </label>
          <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
            <input
              type="radio"
              checked={developmentMethod === "mixmatch"}
              onChange={() => setDevelopmentMethod("mixmatch")}
              className="form-radio"
            />
            <span className="text-gray-800">
              Frontend, Backend, & Database Terpisah (Mix & Match)
            </span>
          </label>
        </div>
      </div>

      {/* Conditional rendering berdasarkan development method */}
      {developmentMethod === "fullstack" ? (
        <div className="space-y-4">
          {/* Fullstack Framework Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">Pilih Framework</h3>
            <select
              className="w-full p-2 bg-white border border-gray-600 rounded-lg text-gray-800"
              value={orderData.fullstackChoice?.framework || ""}
              onChange={(e) =>
                handleFullstackChange("framework", e.target.value)
              }
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

          {/* Database Selection for Fullstack */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">Pilih Database</h3>
            <select
              className="w-full p-2 bg-white border border-gray-600 rounded-lg text-gray-800"
              value={orderData.fullstackChoice?.database || ""}
              onChange={(e) =>
                handleFullstackChange("database", e.target.value)
              }
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
        // Mix & Match Options
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

{/* 3. UI Framework Selection */}
<div className="space-y-3">
  <h3 className="text-lg font-medium text-gray-800">3️⃣ UI Framework</h3>

  {orderData.fullstackChoice?.framework?.includes("flutter") ||
  orderData.mixmatchChoice?.frontend?.includes("flutter") ? (
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(PRICE_LIST.flutterUIFrameworks).map(([framework, price]) => (
        <label
          key={framework}
          className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg"
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
            className="form-checkbox"
          />
          <span className="text-gray-800">
            {framework.replace("flutter-", "").toUpperCase()} - Rp {price.toLocaleString("id-ID")}
          </span>
        </label>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(PRICE_LIST.uiFrameworks).map(([framework, price]) => (
        <label
          key={framework}
          className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg"
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
            className="form-checkbox"
          />
          <span className="text-gray-800">
            {framework} - Rp {price.toLocaleString()}
          </span>
        </label>
      ))}
    </div>
  )}
</div>


      {/* 4. Theme Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-800">4️⃣ Tema UI</h3>
        <select
          className="w-full p-2 bg-white border border-gray-600 rounded-lg text-gray-800"
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
          <option value="auto">
            Auto (Switch Dark/Light) - +Rp {PRICE_LIST.uiThemes.auto.toLocaleString("id-ID")}
          </option>
        </select>

        <select
          className="w-full p-2 bg-white border border-gray-600 rounded-lg text-gray-800"
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


      {/* 5. Notification Type */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-800">5️⃣ Tipe Notifikasi</h3>

        {orderData.fullstackChoice?.framework?.includes("flutter") ||
        orderData.mixmatchChoice?.frontend?.includes("flutter") ? (
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
              {/* <input
                type="radio"
                name="notification"
                value="flutter-default"
                checked={orderData.notificationType === "flutter-default"}
                onChange={(e) =>
                  updateOrderData({ notificationType: e.target.value })
                }
                className="form-radio"
              />
              <span className="text-gray-800">
                Default Flutter AlertDialog - Gratis
              </span>
            </label>
            <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
              <input
                type="radio"
                name="notification"
                value="flutter-custom"
                checked={orderData.notificationType === "flutter-custom"}
                onChange={(e) =>
                  updateOrderData({ notificationType: e.target.value })
                }
                className="form-radio"
              />
              <span className="text-gray-800">
                Custom Snackbar/Toast - Rp 20.000
              </span> */}
            </label>
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(PRICE_LIST.notifications).map(([type, price]) => (
              <label
                key={type}
                className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg"
              >
                <input
                  type="radio"
                  name="notification"
                  value={type}
                  checked={orderData.notificationType === type}
                  onChange={(e) =>
                    updateOrderData({ notificationType: e.target.value })
                  }
                  className="form-radio"
                />
                <span className="text-gray-800">
                  {type}{" "}
                  {price > 0 ? `- Rp ${price.toLocaleString()}` : "- Gratis"}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 6. Custom Colors dengan Submit dan Edit */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-800">6️⃣ Custom Warna UI</h3>
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
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          ⏰ Pilih Deadline
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateOrderData({ deadline: "standard" })}
            className={`p-3 rounded-lg border ${
              orderData.deadline === "standard"
                ? "bg-zinc-300 text-gray-800 border-primary"
                : "bg-gray-200 text-gray-800 border-gray-600 hover:border-primary"
            }`}
          >
            30 Hari (Standard)
            <span className="block text-sm text-gray-600">Free</span>
          </button>
          <button
            onClick={() => updateOrderData({ deadline: "14days" })}
            className={`p-3 rounded-lg border ${
              orderData.deadline === "14days"
                ? "bg-zinc-300 text-gray-800 border-primary"
                : "bg-gray-200 text-gray-800 border-gray-600 hover:border-primary"
            }`}
          >
            14 Hari
            <span className="block text-sm text-gray-600">+Rp 30.000</span>
          </button>
          <button
            onClick={() => updateOrderData({ deadline: "7days" })}
            className={`p-3 rounded-lg border ${
              orderData.deadline === "7days"
                ? "bg-zinc-300 text-gray-800 border-primary"
                : "bg-gray-200 text-gray-800 border-gray-600 hover:border-primary"
            }`}
          >
            7 Hari
            <span className="block text-sm text-gray-600">+Rp 55.000</span>
          </button>
          <button
            onClick={() => updateOrderData({ deadline: "3days" })}
            className={`p-3 rounded-lg border ${
              orderData.deadline === "3days"
                ? "bg-zinc-300 text-gray-800 border-primary"
                : "bg-gray-200 text-gray-800 border-gray-600 hover:border-primary"
            }`}
          >
            3 Hari
            <span className="block text-sm text-gray-600">+Rp 85.000</span>
          </button>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📝 Catatan Tambahan
        </h3>
        <textarea
          value={orderData.notes || ""}
          onChange={(e) => updateOrderData({ notes: e.target.value })}
          placeholder="Tuliskan catatan atau permintaan khusus untuk project Anda..."
          className="w-full p-3 bg-white border border-gray-600 rounded-lg text-gray-800 min-h-[100px]"
        />
      </div>

      {/* Total Price Display */}
      <div className="mt-6 p-4 bg-zinc-400 bg-opacity-10 border border-primary rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 text-center">
          Total Harga
        </h3>
        {orderData.discount ? (
          <>
            <p className="text-lg text-gray-600 line-through text-center">
              Rp {calculateTotal().toLocaleString()}
            </p>
            <p className="text-2xl font-bold text-primary text-center">
              Rp{" "}
              {(
                calculateTotal() *
                (1 - orderData.discount / 100)
              ).toLocaleString()}
            </p>
            <p className="text-sm text-green-500 text-center">
              Hemat {orderData.discount}% (Rp{" "}
              {((calculateTotal() * orderData.discount) / 100).toLocaleString()}
              )
            </p>
          </>
        ) : (
          <p className="text-2xl font-bold text-primary text-center">
            Rp {calculateTotal().toLocaleString()}
          </p>
        )}
      </div>


    </div>
  );
};

export default Step3B;
