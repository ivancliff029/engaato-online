"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { Product } from '../types/types';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getCartItemCount, cart, removeFromCart, getTotalPrice } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <nav className="bg-gray-600 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-shrink-0 mr-4">
          <img src="/img/logo.png" alt="Logo" className="h-8" />
        </div>
        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>
        </div>
        <div className={`lg:flex ${isOpen ? 'block' : 'hidden'} lg:items-center`}>
          <div className="text-white lg:flex lg:space-x-4">
            <Link href="/" passHref legacyBehavior>
              <a className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-400">Home</a>
            </Link>
            <Link href="/store" passHref legacyBehavior>
              <a className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-400">Store</a>
            </Link>
            <Link href="/contact" passHref legacyBehavior>
              <a className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-400">Contact</a>
            </Link>
          </div>
        </div>
        <div className="ml-auto relative">
          <button onClick={toggleCart} className="flex items-center text-white focus:outline-none">
            <FaShoppingCart className="h-6 w-6 mr-2" />
            {getCartItemCount() > 0 && (
              <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                {getCartItemCount()}
              </span>
            )}
          </button>
          {isCartOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
              <div className="p-4">
                {cart.length > 0 ? (
                  <>
                    {cart.map((item: Product, index: number) => (
                      <div key={index} className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <img src={item.imageUrl} alt={item.title} className="w-8 h-8 mr-2" />
                          <span className="text-gray-800">{item.title}</span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 focus:outline-none"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-gray-800 font-bold">Total:</span>
                      <span className="text-gray-800 font-bold">{getTotalPrice()} Ugx</span>
                    </div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full">
                      Checkout
                    </button>
                  </>
                ) : (
                  <p className="text-gray-800">Cart is empty</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;