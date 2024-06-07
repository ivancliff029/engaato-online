import React from 'react';

const LatestArrivals: React.FC = () => {
  return (
  <>
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-4">Latest Arrivals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shoe 1 */}
        <div className="border rounded-lg overflow-hidden">
          <img src="/img/shoe1.webp" alt="Shoe 1" className="w-full" />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Jordan 5</h3>
            <p className="text-sm text-gray-600 mb-2">Shoe 1 Description</p>
            <p className="text-lg font-semibold">150,000 Ugx</p>
          </div>
        </div>
        
        {/* Shoe 2 */}
        <div className="border rounded-lg overflow-hidden">
          <img src="/img/shoe2.webp" alt="Shoe 2" className="w-full" />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Jordan 4 Purple SE</h3>
            <p className="text-sm text-gray-600 mb-2">Shoe 2 Description</p>
            <p className="text-lg font-semibold">150,000 Ugx</p>
          </div>
        </div>
        
        {/* Shoe 3 */}
        <div className="border rounded-lg overflow-hidden">
          <img src="/img/shoe3.jpg" alt="Shoe 3" className="w-full" />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Jordan 8</h3>
            <p className="text-sm text-gray-600 mb-2">Shoe 3 Description</p>
            <p className="text-lg font-semibold">150,000 Ugx</p>
          </div>
        </div>
        
        
      </div>
    </div>
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="border rounded-lg overflow-hidden">
          <img src="/img/shoe4.webp" alt="Shoe 1" className="w-full" />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Jordan 14</h3>
            <p className="text-sm text-gray-600 mb-2">Shoe 4 Description</p>
            <p className="text-lg font-semibold">150,000 Ugx</p>
          </div>
        </div>
        
        
        <div className="border rounded-lg overflow-hidden">
          <img src="/img/shoe5.jfif" alt="Shoe 2" className="w-full" />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Jordan 1 Low Dunks</h3>
            <p className="text-sm text-gray-600 mb-2">Shoe 5 Description</p>
            <p className="text-lg font-semibold">150,000 Ugx</p>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <img src="/img/shoe6.jpg" alt="Shoe 3" className="w-full" />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Jordan 1 Chicago Red</h3>
            <p className="text-sm text-gray-600 mb-2">Shoe 6 Description</p>
            <p className="text-lg font-semibold">150,000 Ugx</p>
          </div>
        </div>
        
        
      </div>
    </div>
    </>
  );
};

export default LatestArrivals;
