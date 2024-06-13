"use client";
import React, { useState } from 'react';
import { FaWhatsapp, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [totalPrice, setTotalPrice] = useState(Number(product?.price) || 0); 

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 1000);
    console.log(`Added ${quantity} of ${product.title} to cart`);
  };

  const handleBuyWithWhatsApp = () => {
    const message = `Hello! I would like to buy ${quantity} of ${product.title}. Image: ${product.imageUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/+256778054598?text=${encodedMessage}`;
    window.open(url, '_blank');
    console.log(`Buy ${quantity} of ${product.title} with WhatsApp`);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    setTotalPrice(Number(product.price) * newQuantity); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          &times;
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img src={product.imageUrl} alt={product.title} className="w-full h-auto" />
          </div>
          <div className="md:w-1/2 p-4">
            <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
            <p className="mb-4">{product.description}</p>
            <p className="text-xl font-semibold mb-4">{product.price} Ugx</p>
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-2">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="border px-2 py-1 w-16"
                min="1"
              />
            </div>
            <p className="text-sm font-semibold mb-4">Total Price: {totalPrice} Ugx</p>
            <button
              onClick={handleAddToCart}
              className={`bg-green-500 text-white px-4 py-2 rounded flex items-center mb-2 transition-all duration-200 ${isAddedToCart ? 'bg-green-600' : ''}`}
            >
              <FaShoppingCart className="mr-2" /> Add to Cart
            </button>
            <button
              onClick={handleBuyWithWhatsApp}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center transition-all duration-200 hover:bg-green-600"
            >
              <FaWhatsapp className="mr-2" /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;