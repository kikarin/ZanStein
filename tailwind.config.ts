import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4E95E5",
          light: "#6BA5E9",
          dark: "#3B82D6",
        },
        secondary: {
          DEFAULT: "#2D3748",
          light: "#4A5568",
          dark: "#1A202C",
        },
        accent: {
          cream: "rgba(255,244,228,1)",
          mint: "rgba(240,246,238,1)",
        },
      },
      fontFamily: {
        sans: ["Inter", "Space Grotesk", "system-ui"],
        display: ["Space Grotesk", "system-ui"],
      },
      boxShadow: {
        'soft': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'hover': '0 10px 40px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'fadeIn': 'fadeIn 0.6s ease-in-out forwards',
        'slideIn': 'slideIn 0.5s ease-in-out',
        'slideOut': 'slideOut 0.5s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'slide-up-fade': 'slide-up-fade 0.8s ease-out forwards',
        'loading-bar': 'loadingBar 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'slide-up-fade': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};

// Add custom utilities for scrollbar hiding
const scrollbarHide = {
  '.scrollbar-hide': {
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  '.snap-x': {
    'scroll-snap-type': 'x mandatory',
  },
  '.snap-center': {
    'scroll-snap-align': 'center',
  },
};

config.theme!.extend = {
  ...config.theme!.extend,
  ...scrollbarHide,
};

export default config;
