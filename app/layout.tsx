import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import LoaderWrapper from "./components/LoaderWrapper";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata: Metadata = {
  title: "ZanStein Solution",
  description: "Jasa Coding Profesional",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="id">
        <body>
          <LoaderWrapper>
            <Navbar />
            <main className="max-w-6xl mx-auto relative z-10">{children}</main>
          </LoaderWrapper>
        </body>
      </html>
    </AuthProvider>
  );
}
