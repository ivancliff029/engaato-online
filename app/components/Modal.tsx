"use client";
import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { Product } from '../types/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (product) {
      setTotalPrice(Number(product.price) || 0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select a color and size.');
      return;
    }

    addToCart({ ...product, selectedColor, selectedSize }, quantity);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 1000);
    console.log(`Added ${quantity} of ${product.title} (${selectedColor}, ${selectedSize}) to cart`);
  };

  const handleBuyWithWhatsApp = () => {
    const message = `Hello! I would like to buy ${quantity} of ${product.title} (${selectedColor}, ${selectedSize}). Image: ${product.imageUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/+256778054598?text=${encodedMessage}`;
    window.open(url, '_blank');
    console.log(`Buy ${quantity} of ${product.title} (${selectedColor}, ${selectedSize}) with WhatsApp`);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    setTotalPrice(Number(product.price) * newQuantity);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(e.target.value);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          &times;
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 flex flex-col items-center">
            <img src={product.imageUrl} alt={product.title} className="w-full h-auto mb-4" />
            <div className="mb-4 w-full">
              <label htmlFor="color" className="block mb-2">Color:</label>
              <select id="color" value={selectedColor} onChange={handleColorChange} className="border px-2 py-1 w-full">
                <option value="" disabled>Select a color</option>
                {product.colors && product.colors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="size" className="block mb-2">Size:</label>
              <select id="size" value={selectedSize} onChange={handleSizeChange} className="border px-2 py-1 w-full">
                <option value="" disabled>Select a size</option>
                {product.sizes && product.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
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
