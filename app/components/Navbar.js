"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Checkout from './Checkout';
import { ShoppingCart, User, LogOut, LayoutDashboard, X, Menu } from 'lucide-react';
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const { getCartItemCount, cart, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { currentUser, logout } = useAuth();

  // Fetch user's profile image from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // Only set the profile image if it exists and is not empty
            if (userData.profileImage && userData.profileImage.trim() !== '') {
              setProfileImage(userData.profileImage);
            } else {
              setProfileImage(null);
            }
          } else {
            setProfileImage(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfileImage(null);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Profile image handling
  const getProfileImageElement = () => {
    if (!currentUser) {
      return (
        <User className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
      );
    }

    return (
      <Image
        src={profileImage || '/img/default-user-icon.svg'}
        alt="Profile"
        width={32}
        height={32}
        className="rounded-full object-cover border-2 border-transparent hover:border-white transition-all"
        onError={(e) => {
          // Fallback to default icon if image fails to load
          const img = e.target;
          img.src = '/img/default-user-icon.svg';
        }}
      />
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-black shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Mobile Menu Toggle and Logo */}
        <div className="flex items-center md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu} 
            className="mr-3 text-gray-300 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <Link href="/" className="flex-shrink-0">
            <Image 
              src="/img/sneakers.png" 
              alt="Engaato Logo" 
              width={48} 
              height={48} 
              className="hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="hidden md:block flex-shrink-0">
          <Image 
            src="/img/sneakers.png" 
            alt="Engaato Logo" 
            width={48} 
            height={48} 
            className="hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/product">Shop</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          {/* Shopping Cart */}
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-300 hover:text-white transition-colors"
                onClick={toggleCart}
              >
                <ShoppingCart className="w-6 h-6" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                    {getCartItemCount()}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white shadow-xl">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-gray-800">Your Cart</SheetTitle>
              </SheetHeader>
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-6">Your cart is empty</p>
              ) : (
                <div className="space-y-4 mt-4">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-gray-800">{item.title}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">{item.price} Ugx</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:bg-red-100"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xl font-bold text-gray-900">
                      Total: {getTotalPrice().toFixed(2)} Ugx
                    </p>
                    <div className="space-y-2 mt-4">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors" 
                        onClick={openCheckout}
                      >
                        Proceed to Checkout
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 border-red-300 hover:bg-red-50" 
                        onClick={clearCart}
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* User Profile */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {getProfileImageElement()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-white shadow-lg rounded-xl border border-gray-100"
              >
                <DropdownMenuItem className="text-gray-700 cursor-default">
                  {currentUser.email}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center w-full text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    <LayoutDashboard className="mr-2 w-4 h-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={logout} 
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <User className="w-6 h-6" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="bg-white">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-gray-800">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-4 mt-6">
            <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/product" onClick={() => setIsMobileMenuOpen(false)}>
              Shop
            </MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </MobileNavLink>
          </div>
        </SheetContent>
      </Sheet>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <Checkout 
          total={getTotalPrice()} 
          onClose={closeCheckout} 
          clearCart={clearCart}
        />
      )}
    </nav>
  );
};

// Custom Navigation Link Component
const NavLink = ({ href, children }) => (
  <Link 
    href={href} 
    className="text-gray-300 font-medium hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full"
  >
    {children}
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ href, children, onClick }) => (
  <Link 
    href={href} 
    onClick={onClick}
    className="text-gray-800 text-lg font-semibold py-3 border-b border-gray-200 hover:text-blue-600 transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;