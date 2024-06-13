"use client";
import React from 'react';
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import LatestArrivals from "./components/LatestArrivals";
import ThirtyPercentOff from "./components/ThirtyPercentOff";
import Footer from "./components/Footer";
import { CartProvider, useCart } from './context/CartContext';

export default function Home() {
  return (
    <>
    <CartProvider>
      <Navbar />
      <Welcome />
      <LatestArrivals />
      <ThirtyPercentOff />
      <Footer />
      </CartProvider>
    </>
  );
}
