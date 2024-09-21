// AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from '../lib/firebase'; 
import { useRouter } from 'next/navigation'; 
import { getFirestore, doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: { username: string; firstName: string; lastName: string; dob: string; phone: string; }) => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(app);
  const router = useRouter();
  const db = getFirestore(app); // Initialize Firestore

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, [auth]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Login error', err);
      setError('Login failed. Please check your credentials.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error('Logout error', err);
      setError('Logout failed. Please try again.');
    }
  };

  const updateUserProfile = async (data: { username: string; firstName: string; lastName: string; dob: string; phone: string; }) => {
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), data, { merge: true });
      } catch (error) {
        console.error("Error updating user profile: ", error);
      }
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUserProfile,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
