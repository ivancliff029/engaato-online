"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaTimes, FaShoppingCart, FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import { Product } from '../types/types';
import Checkout from './Checkout';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown menu

  const { getCartItemCount, cart, removeFromCart, getTotalPrice } = useCart();
  const { currentUser, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const openCheckout = () => {
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <nav className="bg-gray-600 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex-shrink-0 mr-4">
            <Link href="/" passHref legacyBehavior>
              <img src="/img/logo.png" alt="Logo" className="h-8" />
            </Link>
          </div>
          <div className="block lg:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
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
              <Link href="/product" passHref legacyBehavior>
                <a className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-400">Store</a>
              </Link>
              <Link href="/contact" passHref legacyBehavior>
                <a className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-400">Contact</a>
              </Link>
            </div>
          </div>
          <div className="ml-auto relative flex items-center space-x-4">
            <button onClick={toggleCart} className="flex items-center text-white focus:outline-none">
              <FaShoppingCart className="h-6 w-6 mr-2" />
              {getCartItemCount() > 0 && (
                <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            {/* Profile Picture or Auth Links */}
            {currentUser ? (
              <div className="relative">
                <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                  <FaUserCircle className="h-8 w-8" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                    <Link href="/dashboard" passHref legacyBehavior>
                      <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <FaTachometerAlt className="mr-2" />
                        Dashboard
                      </a>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" passHref legacyBehavior>
                <a className="block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Login</a>
              </Link>
            )}
          </div>

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
                    <button onClick={openCheckout} className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full">
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
      </nav>
      {isCheckoutOpen && <Checkout total={getTotalPrice()} onClose={closeCheckout} />}
    </>
  );
};

export default Navbar;
