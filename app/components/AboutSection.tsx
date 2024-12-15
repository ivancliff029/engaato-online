"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

interface AboutSectionProps {
  title: string;
  subTitle: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title, subTitle }) => {
  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-4xl font-extrabold mb-6">
          <span className="text-yellow-300">{title}</span>
        </h1>

        {/* Subheading */}
        <h2 className="text-2xl font-semibold mb-8 text-pink-200">
          {subTitle}
        </h2>

        {/* Slider */}
        <Slider {...sliderSettings}>
          <div>
            <p className="text-xl leading-relaxed px-4">
              "Push boundaries with every step. Discover our classic and innovative collections."
            </p>
          </div>
          <div>
            <p className="text-xl leading-relaxed px-4">
              "Your perfect fit awaits. Take every stride with confidence and style."
            </p>
          </div>
          <div>
            <p className="text-xl leading-relaxed px-4">
              "Lead the way, don't follow. Experience the ultimate comfort and design."
            </p>
          </div>
        </Slider>

        {/* Static Content */}
        <p className="text-lg leading-relaxed mt-8 px-10">
          At <span className="text-yellow-300 font-bold">Engaato Online Kampala</span>, our mission is to blend innovation with style. Explore our wide range of sneakers tailored for leaders, athletes, and trendsetters alike. Join the movement today!
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
