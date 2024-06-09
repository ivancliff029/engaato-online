import React from 'react';

const ThirtyPercentOff: React.FC = () => {
  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-4">30% Off</h2>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <img src="/img/shoe6.jpg" alt="Product Full" className="w-full rounded-lg shadow-md" />
        </div>
        <div className="w-1/2 pl-4">
          <div className="border rounded-lg overflow-hidden shadow-md p-4 h-full">
            <h3 className="text-lg font-semibold mb-2">Jordan 1 Chicago Red</h3>
            <p className="text-sm text-gray-600 mb-2">
                The Jordan 1 Chicago Red is an iconic sneaker known for its bold colors and timeless design. With a 30% discount, it's a rare opportunity to own a piece of sneaker history at a more affordable price. Perfect for fans of Jordan Brand and sneaker enthusiasts alike, this sale is not to be missed.
            </p>
            <p className="text-lg font-semibold">150,000 Ugx <del className="text-red-500"> 200,000 Ugx</del></p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 focus:outline-none">Shop Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirtyPercentOff;
