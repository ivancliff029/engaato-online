import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const ThirtyPercentOff = () => {
  const images = [
    "/img/31.webp",
    "/img/32.jpg",
    "/img/33.webp",
    "/img/34.jpg",
    "/img/35.webp"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <section className="relative bg-neutral-50 py-16 px-4 overflow-hidden">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Headline */}
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-black text-center mb-12 text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-900 tracking-tight"
        >
          Limited Time Offer
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Carousel */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 relative w-full aspect-square"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={images[currentImageIndex]}
                    alt="Product Showcase"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-neutral-800 font-semibold">Air Jordan 6 - Jack Cactus</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 space-y-6"
          >
            <div>
              <h3 className="text-4xl font-bold text-neutral-900 mb-4 tracking-tight">
                Air Jordan 6 - Jack Cactus
              </h3>
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                Elevate your sneaker game with the iconic Jordan 6 Travis Scott. A masterpiece of design that blends street culture with premium craftsmanship. Limited edition, unlimited style.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-3xl font-bold text-neutral-900">
                  <span className="text-emerald-600">150,000 Ugx</span>
                </p>
                <p className="text-neutral-500 line-through">200,000 Ugx</p>
              </div>
              <div className="text-lg font-medium text-neutral-600 bg-emerald-50 px-3 py-1 rounded-full">
                30% OFF
              </div>
            </div>

            <button className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-full font-semibold tracking-wide shadow-xl hover:bg-neutral-800 transition-all duration-300">
              <ShoppingCart className="w-5 h-5" />
              Shop Now
              <ArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThirtyPercentOff;