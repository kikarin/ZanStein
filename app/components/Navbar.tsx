"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiPackage,
  FiGift,
  FiChevronDown,
} from "react-icons/fi";

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#profile-menu") && !target.closest("#profile-button")) {
        setIsProfileOpen(false);
      }
      if (!target.closest("#mobile-menu") && !target.closest("#menu-button")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Order", path: "/order" },
  ];

  const profileItems = [
    { label: "My Orders", icon: <FiPackage />, path: "/my-orders" },
    { label: "Vouchers", icon: <FiGift />, path: "/voucher" },
    { label: "Profile", icon: <FiUser />, path: "/profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/logo-ts.png"
              alt="ZanStein Solution"
              width={40}
              height={40}
              className="hover:opacity-80 transition-opacity"
            />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-sky-600 to-primary-dark bg-clip-text text-transparent">
              ZanStein
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="text-secondary hover:text-accent transition-all duration-300 text-sm font-medium"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.label}
              </motion.button>
            ))}

            {/* User Profile Section */}
            {user ? (
              <div className="relative" id="profile-menu">
                <motion.button
                  id="profile-button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-secondary hover:text-accent transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.displayName || "User"}
                    width={32}
                    height={32}
                    className="rounded-full border border-gray-300"
                  />
                  <FiChevronDown />
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                    >
                      {profileItems.map((item) => (
                        <motion.button
                          key={item.path}
                          onClick={() => {
                            router.push(item.path);
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-secondary hover:bg-gray-100 hover:text-accent transition-all duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <span className="mr-2">{item.icon}</span>
                          {item.label}
                        </motion.button>
                      ))}
                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-100 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <FiLogOut className="mr-2" />
                        Logout
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={() => router.push("/login")}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-all duration-300 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            id="menu-button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-secondary hover:text-accent transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item) => (
                <motion.button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-secondary hover:bg-gray-100 hover:text-accent transition-all duration-300 rounded-lg"
                  whileHover={{ x: 5 }}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* User Profile Section in Mobile */}
              {user && (
                <div className="mt-4 border-t border-gray-200 pt-2">
                  {profileItems.map((item) => (
                    <motion.button
                      key={item.path}
                      onClick={() => {
                        router.push(item.path);
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-secondary hover:bg-gray-100 hover:text-accent transition-all duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
