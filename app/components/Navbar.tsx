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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img src="/img/logo.png" alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Centered Menu Items */}
          <div className="hidden lg:flex flex-1 justify-center space-x-6 items-center">
            <Link href="/" className="text-white">Home</Link>
            <Link href="/product" className="text-white">Shop</Link>
            <Link href="/contact" className="text-white">Contact</Link>
          </div>

          {/* Profile Dropdown with Cart Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleCart}
              className="relative text-white focus:outline-none flex items-center"
            >
              <FaShoppingCart className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-white focus:outline-none"
              >
                <FaUserCircle className="h-6 w-6" />
                <span className="ml-2">{currentUser ? currentUser.email : 'Guest'}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  {currentUser ? (
                    <>
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaTachometerAlt className="mr-2 inline-block" /> Dashboard
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-2 inline-block" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="block lg:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 space-y-4 flex flex-col items-center">
            <Link href="/" className="block px-4 py-2 text-white">Home</Link>
            <Link href="/shop" className="block px-4 py-2 text-white">Shop</Link>
            <Link href="/about" className="block px-4 py-2 text-white">About</Link>
          </div>
        )}
      </nav>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-w-full">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Shopping Cart</h2>
              <button onClick={toggleCart}>
                <FaTimes className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="dark:text-gray-300">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item: Product) => (
                  <div key={item.id} className="flex justify-between items-center mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded">
                    <span className="dark:text-gray-100">{item.title}</span>
                    <span className="dark:text-gray-400 ">{item.price.toFixed(2)} Ugx</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-600 dark:text-red-400">
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <div className="mt-4">
                  <span className="text-gray-900 dark:text-gray-100 px-1">
                    Total: {getTotalPrice().toFixed(2)} Ugx
                  </span>
                  <button
                    onClick={openCheckout}
                    className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded mt-4 transition-colors duration-300"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}


      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <Checkout total={getTotalPrice()} onClose={closeCheckout} />
      )}
    </>
  );
};

export default Navbar;
