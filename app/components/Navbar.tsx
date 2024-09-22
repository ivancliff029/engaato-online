"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaTimes,
  FaShoppingCart,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types/types';

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
      {/* Navbar */}
      <nav className="bg-gray-600 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex-shrink-0 mr-4">
            <Link href="/" passHref legacyBehavior>
              <img src="/img/logo.png" alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Menu items aligned to the left */}
          <div className="flex space-x-6 items-center">
            <Link href="/" passHref legacyBehavior>
              <a className="text-white">Home</a>
            </Link>
            <Link href="/product" passHref legacyBehavior>
              <a className="text-white">Shop</a>
            </Link>
            <Link href="/contact" passHref legacyBehavior>
              <a className="text-white">Contact</a>
            </Link>
          </div>

          {/* Cart and Profile */}
          <div className="flex space-x-6 items-center">
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

            {/* Profile Dropdown */}
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
                      <Link href="/dashboard" passHref legacyBehavior>
                        <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaTachometerAlt className="mr-2 inline-block" /> Dashboard
                        </a>
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-2 inline-block" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link href="/login" passHref legacyBehavior>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</a>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <Link href="/" passHref legacyBehavior>
              <a className="block px-4 py-2 text-white">Home</a>
            </Link>
            <Link href="/shop" passHref legacyBehavior>
              <a className="block px-4 py-2 text-white">Shop</a>
            </Link>
            <Link href="/about" passHref legacyBehavior>
              <a className="block px-4 py-2 text-white">About</a>
            </Link>
          </div>
        )}
      </nav>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-w-full">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shopping Cart</h2>
              <button onClick={toggleCart} className="text-gray-900 dark:text-white">
                <FaTimes />
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-900 dark:text-gray-300">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item: Product) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span className="text-gray-900 dark:text-gray-300">{item.title}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-900 dark:text-white">
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <div className="mt-4">
                  <span className="text-gray-900 dark:text-gray-300">
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
    </>
  );
};

export default Navbar;
