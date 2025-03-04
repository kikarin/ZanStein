"use client";
import { useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function Loader({ setIsLoading }: { setIsLoading: (value: boolean) => void }) {
  useEffect(() => {
    // Animate logo and text
    gsap.fromTo(
      ".loader-logo",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(
      ".loader-text",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "power3.out" }
    );

    // Hide loader after animation
    const timer = setTimeout(() => {
      gsap.to(".loader-container", {
        opacity: 0,
        duration: 0.8,
        onComplete: () => setIsLoading(false), // Inform RootLayout to hide Loader
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return (
    <div className="loader-container fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="loader-logo w-52 h-52 relative">
        <Image
          src="/logo-ts.png"
          alt="ZanStein Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Loading text */}
      <div className="loader-text text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">
          ZANSTEIN SOLUTION
        </h2>
        <p className="text-gray-400">
          Professional Coding Services for Your Digital Needs
        </p>
      </div>

      {/* Loading bar */}
      <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-loading-bar" />
      </div>
    </div>
  );
}
