import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Engaato Online",
  description: "Step into Style, Comfort, and Confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white dark:bg-gray-900`}>
        <AuthProvider>
          <CartProvider>
            {/* Navbar at the top of every page */}
            <Navbar />
            
            {/* Main content of the page */}
            <main className="flex-grow flex-shrink-0 bg-white dark:bg-gray-900">
              {children}
            </main>
            
            {/* Footer at the bottom of every page */}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
