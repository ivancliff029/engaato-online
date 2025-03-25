"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile, // This updates the Firebase Auth profile
} from 'firebase/auth';
import { app } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AuthContextType {
  currentUser: User | null;
  userRole: string | undefined;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: {
    username: string;
    firstName: string;
    lastName: string;
    dob: string;
    phone: string;
  }) => Promise<void>;
  updateUserImage: (file: File) => Promise<void>;
  getUserImage: () => Promise<string | null>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = getAuth(app);
  const router = useRouter();
  const db = getFirestore(app);
  const storage = getStorage(app);

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

  const updateUserProfile = async (data: {
    username: string;
    firstName: string;
    lastName: string;
    dob: string;
    phone: string;
  }) => {
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), data, { merge: true });
      } catch (error) {
        console.error('Error updating user profile: ', error);
      }
    }
  };

  const updateUserImage = async (file: File) => {
    if (currentUser) {
      try {
        const storageRef = ref(storage, `userImages/${currentUser.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update Firestore
        await setDoc(
          doc(db, 'users', currentUser.uid),
          { photoURL: downloadURL },
          { merge: true }
        );

        // Update Firebase Auth User profile
        await updateProfile(currentUser, { photoURL: downloadURL });

        // Update the currentUser state to reflect the new image
        setCurrentUser((prev) =>
          prev ? { ...prev, photoURL: downloadURL } : null
        );
      } catch (error) {
        console.error('Error updating user image: ', error);
        throw error;
      }
    }
  };

  const getUserImage = async (): Promise<string | null> => {
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          return userDoc.data().photoURL || null;
        }
      } catch (error) {
        console.error('Error getting user image: ', error);
      }
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserRole(data.role);
          setCurrentUser({
            ...user,
            photoURL: data.photoURL || user.photoURL,
          });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
        setUserRole(undefined);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  const value = {
    currentUser,
    userRole,
    loading,
    login,
    logout,
    updateUserProfile,
    updateUserImage,
    getUserImage,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
