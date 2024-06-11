import React from 'react';
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import LatestArrivals from "./components/LatestArrivals";
import ThirtyPercentOff from "./components/ThirtyPercentOff";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Welcome />
      <LatestArrivals />
      <ThirtyPercentOff />
      <Footer />
    </>
  );
}
