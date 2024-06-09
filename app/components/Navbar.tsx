"use client";

import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
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
            <a href="#" className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-400">Home</a>
            <a href="#" className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-400">About</a>
            <a href="#" className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-400">Services</a>
            <a href="#" className="block mt-4 lg:inline-block lg:mt-0 hover:text-gray-400">Contact</a>
          </div>
        </div>

        <div className="ml-auto">
          <button className="flex items-center text-white focus:outline-none">
            <svg
              className="h-6 w-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v3h16V4M8 14h8l-2 5H10l-2-5zm0 0h0"
              ></path>
            </svg>
            Shopping
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
