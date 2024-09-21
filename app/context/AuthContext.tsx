"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from '../lib/firebase'; 
import { useRouter } from 'next/navigation'; 

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null); // State to store error messages
  const auth = getAuth(app);
  const router = useRouter(); // Get the Next.js router

  // Handles user state on page reload or change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe; // Clean up subscription on unmount
  }, [auth]);

  // Login function using Firebase Authentication
  const login = async (email: string, password: string) => {
    try {
      setError(null); // Reset any previous error
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Login error', err);
      setError('Login failed. Please check your credentials.'); // Update error state
      throw err; // Optionally rethrow for further handling
    }
  };

  // Logout function with redirection to the homepage
  const logout = async () => {
    try {
      setError(null); // Reset any previous error
      await signOut(auth);
      router.push('/'); // Redirect to the homepage after logout
    } catch (err) {
      console.error('Logout error', err);
      setError('Logout failed. Please try again.'); // Update error state
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    error, // Provide the error state to the context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
