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
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">30% Off</h2>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 md:pr-4 mb-4 md:mb-0">
          <div className="fixed-height-container">
            <img src={images[currentImageIndex]} alt="Product Full" className="w-full h-full object-cover rounded-lg shadow-md" />
          </div>
        </div>
        <div className="md:w-1/2 md:pl-4">
          <div className="border rounded-lg overflow-hidden shadow-md p-4 h-full bg-white dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">Air Jordan 6 - Jack Cactus</h2>
            <p className="text-base text-gray-700 mb-4 dark:text-gray-400">
              The Jordan 6 Travis Scott is a highly coveted sneaker, celebrated for its unique design and premium materials. With a 30% discount, this is an exceptional chance to own a piece of sneaker history at a more affordable price. Perfect for fans of Travis Scott and Jordan Brand, as well as sneaker enthusiasts alike, this sale is not to be missed.
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              150,000 Ugx <del className="text-red-500"> 200,000 Ugx</del>
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800">
              Shop Now
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .fixed-height-container {
          height: 400px; /* Set a fixed height for the container */
        }
      `}</style>
    </div>
  );
};

export default ThirtyPercentOff;
