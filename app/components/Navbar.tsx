"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';  // Import useCart hook
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

const Navbar: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { getCartItemCount, cart, removeFromCart, getTotalPrice, clearCart } = useCart();  // Destructure clearCart from useCart
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
        <User className="h-6 w-6" />
      );
    }

    return (
      <Image
        src={profileImage || '/img/default-user-icon.svg'}
        alt="Profile"
        width={24}
        height={24}
        className="rounded-full object-cover"
        onError={(e) => {
          // Fallback to default icon if image fails to load
          const img = e.target as HTMLImageElement;
          img.src = '/img/default-user-icon.svg';
        }}
      />
    );
  };

  return (
    <nav className="bg-black text-white p-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Button and Logo */}
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="mr-2">
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex-shrink-0">
            <span className="sr-only">Engaato Online</span>
            <Image src="/img/sneakers.png" alt="logo" height={40} width={40} />
          </Link>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="hidden md:block flex-shrink-0">
          <span className="sr-only">Engaato Online</span>
          <Image src="/img/sneakers.png" alt="logo" height={40} width={40} />
        </Link>

        {/* Desktop Menu Items */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <Link href="/product" className="hover:text-gray-300 transition-colors">Shop</Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
        </div>

        {/* Cart and Profile Section */}
        <div className="flex items-center space-x-4">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
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
                        <span>{item.price} Ugx</span>
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
                    <Button className="w-full mt-4" onClick={clearCart}>Clear Cart</Button> {/* Add Clear Cart Button */}
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Profile Section */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {getProfileImageElement()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span>{currentUser.email}</span>
                </DropdownMenuItem>
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

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Link href="/" className="hover:text-gray-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/product" className="hover:text-gray-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* Checkout Modal */}
      {isCheckoutOpen && <Checkout total={getTotalPrice()} onClose={closeCheckout} clearCart={clearCart}/>}
    </nav>
  );
};

export default Navbar;
