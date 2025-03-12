import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import LoaderWrapper from "./components/LoaderWrapper";
import { AuthProvider } from "../contexts/AuthContext";
import ParallaxWrapper from "./components/ParallaxWrapper";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://zan-stein.vercel.app";

export const metadata: Metadata = {
  title: "ZanStein Solution | Jasa Coding Profesional",
  description: "Jasa coding profesional untuk website dan aplikasi, cepat, aman, dan berkualitas.",
  keywords: "jasa coding, jasa pembuatan website, jasa software, developer profesional, ZanStein Solution",
  authors: [{ name: "ZanStein Solution", url: siteUrl }],
  robots: "index, follow",
  openGraph: {
    title: "ZanStein Solution | Jasa Coding Profesional",
    description: "Jasa coding profesional untuk website dan aplikasi, cepat, aman, dan berkualitas.",
    url: siteUrl,
    siteName: "ZanStein Solution",
    images: [
      {
        url: `${siteUrl}/logo-ts.png`, // Pastikan URL gambar valid
        width: 1200,
        height: 630,
        alt: "ZanStein Solution",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZanStein Solution | Jasa Coding Profesional",
    description: "Jasa coding profesional untuk website dan aplikasi, cepat, aman, dan berkualitas.",
    images: [`${siteUrl}/logo-ts.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="id">
        <body>
          <ParallaxWrapper> {/* ✅ Bungkus dengan ParallaxWrapper */}
            <LoaderWrapper>
              <Navbar />
              <main className="max-w-6xl mx-auto relative z-10">{children}</main>
            </LoaderWrapper>
          </ParallaxWrapper>
        </body>
      </html>
    </AuthProvider>
  );
}
