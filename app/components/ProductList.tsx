// components/ProductList.tsx
import React from 'react';
import Link from 'next/link';
import { Product } from '../types/types';

interface Props {
  products: Product[];
}

const ProductsList: React.FC<Props> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {products.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id}>
          <div className="border rounded-lg p-4 shadow-md cursor-pointer bg-white dark:bg-gray-800">
            <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{product.title}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">{product.price} Ugx</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductsList;
