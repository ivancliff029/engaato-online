import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight } from 'lucide-react';

const Welcome = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('/img/bg-shoes.jpg')",
          filter: 'brightness(0.6) contrast(1.2)' 
        }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />

      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex flex-col justify-center h-full max-w-4xl mx-auto px-6 text-white"
      >
        {/* Animated Brand Title */}
        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-7xl font-black mb-6 tracking-tight"
        >
          Engaato
          <span className="text-sm block mt-2 text-blue-200 font-light tracking-widest">
            FOOTWEAR REVOLUTION
          </span>
        </motion.h1>

        {/* Dynamic Tagline with Creative Text */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mb-10"
        >
          <p className="text-xl md:text-2xl mb-4 font-medium">
            Unleash Your Potential, One Step at a Time
          </p>
          <p className="text-md md:text-lg text-gray-300 italic">
            Where innovation meets comfort, and style speaks louder than words
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/product" legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl transition-all duration-300 group"
            >
              <ShoppingBag className="mr-3 group-hover:animate-pulse" />
              Explore the Collection
              <ChevronRight 
                className={`ml-3 transition-transform duration-300 ${
                  isHovered ? 'translate-x-2' : ''
                }`} 
              />
            </motion.a>
          </Link>
        </motion.div>
        
      </motion.div>
    </div>
  );
};

export default Welcome;