"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types/types';

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  getCartItemCount: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever the cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Update quantity if product already exists
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: 1 + quantity } : item
        );
      }
      // Add new product
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + 1, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * 1, 0);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, getCartItemCount, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};
