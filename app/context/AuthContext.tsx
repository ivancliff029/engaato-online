// AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from '../lib/firebase'; 
import { useRouter } from 'next/navigation'; 
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  userRole: string | undefined; // Added userRole to the context type
  loading: boolean; // Added loading state
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
  const [userRole, setUserRole] = useState<string | undefined>(undefined); // State for user role
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading state
  const auth = getAuth(app);
  const router = useRouter();
  const db = getFirestore(app); 

  // Function to handle login
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

  // Function to handle logout
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

  // Function to update user profile
  const updateUserProfile = async (data: { username: string; firstName: string; lastName: string; dob: string; phone: string; }) => {
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), data, { merge: true });
      } catch (error) {
        console.error("Error updating user profile: ", error);
      }
    }
  };

  // Effect to track authentication state and fetch user role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserRole(data.role); // Assuming 'role' is stored in Firestore
        }
      } else {
        setUserRole(undefined); // Reset role on logout
      }
      setLoading(false); // Set loading to false after checking auth
    });
    return unsubscribe;
  }, [auth]);

  // Define the context value to be provided
  const value = {
    currentUser,
    userRole, // Include userRole in context
    loading,   // Include loading in context
    login,     // Assign the function to the value
    logout,    // Assign the function to the value
    updateUserProfile, // Assign the function to the value
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
