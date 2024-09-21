"use client";
import React from 'react';

interface AboutSectionProps {
  title: string;
  subTitle: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title, subTitle }) => {
  return (
    <section className="bg-white dark:bg-gray-800 text-black dark:text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          {title}
        </h1>

        {/* Subheading */}
        <h2 className="text-1xl font-semibold mb-4 text-center">
          {subTitle}
        </h2>

        {/* Content */}
        <p className="text-lg leading-relaxed mt-4 text-center px-10">
          At Engaato Online Kampala, we believe in pushing the boundaries of what's possible. From the classic Air Max to the latest innovations in running shoes, our collections are designed for those who want to lead and not follow. Find your perfect fit and take every step with confidence.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
