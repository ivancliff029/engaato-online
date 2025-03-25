"use client";
import React from 'react';
import Welcome from "./components/Welcome";
import LatestArrivals from "./components/LatestArrivals";
import ThirtyPercentOff from "./components/ThirtyPercentOff";
import AboutSection from './components/AboutSection';
import { CartProvider } from './context/CartContext';
import './styles/styles.css';

export default function Home() {
  return (
    <CartProvider>
      <Welcome />
      <AboutSection 
        title="Freshest Kicks around town" 
        subTitle="Performance, Style, and Innovation" 
      />
      <ThirtyPercentOff />
      <LatestArrivals />
    </CartProvider>
  );
}
