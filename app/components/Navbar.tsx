"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaTimes, FaShoppingCart, FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types/types';
import Checkout from './Checkout';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet"

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
 <nav className="bg-black text-white p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="sr-only">Your Logo</span>
          <img src="/img/sneakers.png" alt="logo" height={40} width={40} />
        </Link>

        {/* Menu Items */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <Link href="/product" className="hover:text-gray-300 transition-colors">Shop</Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
        </div>

        {/* Cart and Profile Section */}
        <div className="flex items-center space-x-4">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {getCartItemCount()}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
              </SheetHeader>
              {cart.length === 0 ? (
                <p className="py-4">Your cart is empty</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                      <span>{item.title}</span>
                      <div className="flex items-center space-x-2">
                        <span>{item.price.toFixed(2)} Ugx</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <p className="font-semibold">Total: {getTotalPrice().toFixed(2)} Ugx</p>
                    <Button className="w-full mt-4" onClick={openCheckout}>
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Logout (if user is logged in) */}
          {currentUser ? (
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span>{currentUser ? currentUser.email : 'Guest'}</span>
                </DropdownMenuItem>
                {currentUser ? (
                  <>
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            ) : (
              <Link href="/login" className="text-white">
                <Button variant="ghost" size="icon">
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && <Checkout total={getTotalPrice()} onClose={closeCheckout} />}
    </nav>
    </>
  );
};

export default Navbar;
