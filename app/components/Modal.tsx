"use client";
import React from 'react';
import { FaWhatsapp, FaShoppingCart } from 'react-icons/fa'; 

interface Product {
  imageUrl: string;
  title: string;
  description: string;
  price: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  const handleBuyClick = () => {
    if (product) {
      const message = `Hello, I'm interested in buying the product "${product.title}" priced at ${product.price} Ugx.\n\nDescription: ${product.description}\n\nImage: ${product.imageUrl}`;
      const phoneNumber = '+256778054598'; 
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full">
        <button className="text-gray-600 float-right" onClick={onClose}>×</button>
        {product && (
          <div>
            <img src={product.imageUrl} alt={product.title} className="w-full h-64 object-cover mb-4" />
            <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            <p className="text-lg font-semibold">{product.price} Ugx</p>
            <div className="mt-4 flex space-x-2">
              <button 
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded flex items-center justify-center" 
                onClick={handleBuyClick}
              >
                <FaWhatsapp className="mr-2" /> Buy
              </button>
            </div>
           
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
