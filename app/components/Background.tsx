"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const Background = () => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const generateStars = useCallback(() => {
    const starArray = [];
    for (let i = 0; i < 70; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
      });
    }
    return starArray;
  }, []);

  useEffect(() => {
    setStars(generateStars());

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [generateStars]);

  return (
    <div className="fixed inset-0 overflow-hidden z-[-1]">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-cream to-accent-mint opacity-90"></div>

      {/* Animated Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.y}%`,
            left: `${star.x}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Gradient Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-primary-light/20 to-transparent blur-3xl"
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
        style={{
          top: "20%",
          left: "30%",
        }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-l from-secondary-light/10 to-transparent blur-3xl"
        animate={{
          x: mousePosition.x * -2,
          y: mousePosition.y * -2,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
        style={{
          bottom: "20%",
          right: "30%",
        }}
      />

      {/* Mesh Grid */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

export default Background;
