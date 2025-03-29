// app/layout.js
import React from 'react';
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import FooterWrapper from "./components/FooterWrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Engaato Online",
  description: "Step into Style, Comfort, and Confidence.",
};

export default function RootLayout({ children }) {
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
            
            {/* FooterWrapper will conditionally render the Footer */}
            <FooterWrapper>
              <Footer />
            </FooterWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}