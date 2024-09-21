"use client";
import React from 'react';
import Welcome from "./components/Welcome";
import LatestArrivals from "./components/LatestArrivals";
import ThirtyPercentOff from "./components/ThirtyPercentOff";
import { CartProvider } from './context/CartContext';
import './styles/styles.css';

export default function Home() {
  return (
    <CartProvider>
      <Welcome />
      <LatestArrivals />
      <ThirtyPercentOff />
    </CartProvider>
  );
}
