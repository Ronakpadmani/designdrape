import "./globals.css";

import type { Metadata } from "next";

import { Poppins, Cormorant_Garamond } from "next/font/google";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/context/AuthContext";

import { CartProvider } from "@/context/CartContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "DesignDrape",
  description: "Premium Fashion Tailoring Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${cormorant.variable} ${poppins.className} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#0a0a0a",
                  color: "#fafafa",
                  border: "1px solid rgba(201, 168, 76, 0.25)",
                  borderRadius: "12px",
                  fontSize: "14px",
                },
                success: {
                  iconTheme: {
                    primary: "#C9A84C",
                    secondary: "#0a0a0a",
                  },
                },
              }}
            />

            <Navbar />

            {children}

            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
