"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Target, Award } from "lucide-react";

const AboutSection = ({ title, subTitle }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      quote: "Where innovation meets personal expression.",
      subQuote: "Redefining footwear beyond mere functionality.",
      icon: <Target className="w-16 h-16 text-blue-500 mx-auto mb-4" />,
    },
    {
      quote: "Craft your narrative with every step.",
      subQuote: "Designed for those who dare to stand out.",
      icon: <Award className="w-16 h-16 text-purple-500 mx-auto mb-4" />,
    },
    {
      quote: "Performance. Precision. Personality.",
      subQuote: "Engineered for the extraordinary.",
      icon: <Quote className="w-16 h-16 text-emerald-500 mx-auto mb-4" />,
    }
  ];

  return (
    <section className="relative bg-neutral-50 py-20 px-4 overflow-hidden">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Innovative Title Design */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-900"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl font-medium text-neutral-600 tracking-wide uppercase"
          >
            {subTitle}
          </motion.p>
        </div>

        {/* Refined Slider */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-neutral-100 rounded-2xl shadow-2xl p-12 text-center"
            >
              {slides[currentSlide].icon}
              
              <h3 className="text-4xl font-bold text-neutral-800 mb-4 leading-tight">
                {slides[currentSlide].quote}
              </h3>
              
              <p className="text-lg text-neutral-600 italic">
                {slides[currentSlide].subQuote}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Minimal Slide Indicators */}
          <div className="flex justify-center space-x-3 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-neutral-900 w-8' 
                    : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-neutral-700 max-w-2xl mx-auto leading-relaxed">
            At <span className="font-bold text-neutral-900">Engaato Online Kampala</span>, we transcend traditional footwear. Our collections are more than products—they're a statement of individuality, crafted for those who understand that true style is an extension of self.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;