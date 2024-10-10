import React from 'react';
import { Product } from '../types/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductsList({ products }: { products: Product[] }) {
  const router = useRouter();

  // Helper function to format price
  const formatPrice = (price: number | string | undefined) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    } else if (typeof price === 'string') {
      const numberPrice = parseFloat(price);
      return isNaN(numberPrice) ? 'N/A' : numberPrice.toFixed(2);
    }
    return 'N/A';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link 
          href={`/product/${product.id}`} 
          key={product.id}
        >
          <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full h-48 object-cover mb-4" 
            />
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-lg font-bold mt-2">{formatPrice(product.price)} Ugx</p>
          </div>
        </Link>
      ))}
    </div>
  );
}