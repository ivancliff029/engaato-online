import React from 'react';
import Modal from './Modal';
import { FaWhatsapp, FaShoppingCart } from 'react-icons/fa';

interface Product {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
}

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col shadow-md hover:shadow-lg">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => onClick(product)}
        />
      )}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        </div>
        <p className="text-lg font-semibold mt-2">{product.price} Ugx</p>
      </div>
    </div>
  );
};

export default ProductCard;
