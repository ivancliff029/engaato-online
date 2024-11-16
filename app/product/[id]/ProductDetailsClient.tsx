// app/product/[id]/ProductDetailsClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types/types';

interface ProductDetailsClientProps {
  product: Product;
}

interface SizeProps {
  size: number;
  country: string;
}

const shoeSizes: SizeProps[] = [
  { size: 39, country: "USA" },
  { size: 40, country: "USA" },
  { size: 41, country: "USA" },
  { size: 42, country: "USA" },
  { size: 43, country: "USA" },
  { size: 44, country: "USA" },
  { size: 45, country: "USA" },
];

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first');
      return;
    }
    addToCart(product, 1);
    setAddedToCart(true);
  };

  const calculatedOriginalPrice = product.price * 1.15;

  return (
    <div className="container mx-auto mt-8 p-4 dark:bg-gray-900">
      <button
        onClick={() => router.back()}
        className="flex items-center mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <div className="flex flex-col md:flex-row border rounded-lg shadow-md p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">
            {product.title}
          </h2>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-400">
            {product.description}
          </p>

          <p className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200">
            {product.price.toLocaleString()} Ugx{' '}
            <span className="text-red-500">15% OFF</span>
          </p>
          <p className="text-sm text-gray-500 mb-4 line-through dark:text-gray-400">
            Original Price: {calculatedOriginalPrice.toLocaleString()} Ugx
          </p>

          <label className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200">
            Shoe Size:
          </label>
          <div className="flex flex-wrap gap-2">
            {shoeSizes.map((sizeOption) => (
              <div
                key={sizeOption.size}
                onClick={() => setSelectedSize(sizeOption.size)}
                className={`border rounded px-4 py-2 cursor-pointer transition-colors ${
                  selectedSize === sizeOption.size
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {sizeOption.size}
              </div>
            ))}
          </div>

          {!addedToCart ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          ) : (
            <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded mt-4 dark:bg-green-700">
              <FaCheck className="mr-2" /> Added to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}