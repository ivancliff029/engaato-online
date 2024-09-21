// components/ProductList.tsx
import React from 'react';
import Link from 'next/link';
import { Product } from '../types/types'; // Adjust path if necessary

interface Props {
  products: Product[]; // Define the products prop
}

const ProductsList: React.FC<Props> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id}>
          <div className="border rounded-lg p-4 shadow-md cursor-pointer">
            <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-semibold">{product.title}</h3>
            <p className="text-lg">{product.price} Ugx</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductsList;
