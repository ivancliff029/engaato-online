"use client"
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useRouter } from 'next/navigation';
import Dashboard from '../components/Dashboard'; 

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [currentUser, router]);

  // Show a loading state or nothing until the user is verified
  if (!currentUser) {
    return <p>Loading...</p>; // You can customize this as needed
  }

  return <Dashboard />;
};

export default DashboardPage;
