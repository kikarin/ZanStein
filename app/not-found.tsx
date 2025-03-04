"use client";

import Link from "next/link";
import { useEffect } from "react";
import gsap from "gsap";

export default function NotFound() {
  useEffect(() => {
    // Animate elements
    gsap.fromTo(
      ".not-found-content",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    // Animate decorative elements
    gsap.fromTo(
      ".decorative-circle",
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 0.1, 
        duration: 1, 
        ease: "elastic.out(1, 0.3)",
        stagger: 0.2 
      }
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br  px-4">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="decorative-circle absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary opacity-10" />
        <div className="decorative-circle absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-primary opacity-5" />
        <div className="decorative-circle absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-primary opacity-5" />
      </div>

      {/* Content */}
      <div className="not-found-content relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="w-24 h-24 mx-auto mb-8">
          <img
            src="/zans-t.png"
            alt="ZanStein Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Back to Home Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-300 group"
        >
          <span>Back to Home</span>
          <svg 
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
} 