"use client";
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Dashboard from '../components/Dashboard/Dashboard';

const DashboardPage = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [currentUser, loading, router]);

  // Show a loading state while checking auth
  if (loading) {
    return <p>Loading...</p>;
  }

  // If user is not logged in and loading is false, they will be redirected
  if (!currentUser) {
    return null; // Prevent rendering the Dashboard
  }

  return <Dashboard />;
};

export default DashboardPage;
