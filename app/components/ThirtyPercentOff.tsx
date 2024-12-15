import React, { useState, useEffect } from 'react';

const ThirtyPercentOff: React.FC = () => {
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
    <div className="container mx-auto mt-8 p-4 dark:bg-gray-900">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-900 dark:text-white tracking-wide">
        🔥 30% Off Limited Time Only!
      </h2>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="lg:w-1/2">
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-xl">
            <img
              src={images[currentImageIndex]}
              alt="Product Full"
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md">
              Air Jordan 6 - Jack Cactus
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-200">
            Air Jordan 6 - Jack Cactus
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-400">
            The Jordan 6 Travis Scott is a highly coveted sneaker, celebrated for its unique design and premium materials. With a 30% discount, this is your chance to own a piece of sneaker history at an unbeatable price. Perfect for sneaker enthusiasts and Travis Scott fans alike.
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6">
            <span className="text-green-500">150,000 Ugx</span>
            <del className="text-red-500 ml-4">200,000 Ugx</del>
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold tracking-wide shadow-md hover:opacity-90 transition-opacity duration-300 focus:outline-none">
            🛒 Shop Now
          </button>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 1024px) {
          .lg\:w-1\/2 {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ThirtyPercentOff;
