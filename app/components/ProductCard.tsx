import React, { useState } from 'react';
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
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleImageClick = () => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden flex flex-col">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={handleImageClick}
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
      {selectedProduct && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} product={selectedProduct} />
      )}
    </>
  );
};

export default ProductCard;
