import { db, storage } from "../lib/firebase";
import React, { useState, useEffect } from 'react';
import TabsRender from './Dashboard/OrderTab';
import { Clock, Calendar, TrendingUp, DollarSign, Package } from 'lucide-react';
import { collection, getDocs, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const HomeContent = ({ userEmail }) => {
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    pendingOrders: 0,
    todayRevenue: 0,
    monthlyGrowth: 0,
    totalOrders: 0,
    inventoryValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  
  // Fetch user data and set display name
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // Use firstName if available, otherwise fall back to lastName or email
            const name = userData.firstName || userData.lastName || currentUser.displayName || userEmail || 'there';
            setDisplayName(name);
          } else {
            setDisplayName(currentUser.displayName || userEmail || 'there');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setDisplayName(userEmail || 'there');
        }
      } else {
        setDisplayName(userEmail || 'there');
      }
    };

    fetchUserData();
  }, [currentUser, userEmail]);

  // Update time every minute and fetch other data
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    const fetchData = async () => {
      try {
        // Get products inventory value
        const productsQuery = collection(db, "products");
        const productsSnapshot = await getDocs(productsQuery);
        const inventoryValue = productsSnapshot.docs.reduce((sum, doc) => {
          return sum + (Number(doc.data().price) || 0);
        }, 0);

        // Get today's transactions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const transactionsQuery = query(
          collection(db, "transactions"),
          where("createdAt", ">=", today)
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const todayRevenue = transactionsSnapshot.docs.reduce((sum, doc) => {
          return sum + (Number(doc.data().total) || 0);
        }, 0);

        // Get all transactions count
        const allTransactionsQuery = collection(db, "transactions");
        const allTransactionsSnapshot = await getDocs(allTransactionsQuery);
        const totalOrders = allTransactionsSnapshot.size;

        // Get pending orders
        const pendingQuery = query(
          collection(db, "transactions"),
          where("status", "==", "pending")
        );
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingOrders = pendingSnapshot.size;

        setStats({
          pendingOrders,
          todayRevenue,
          monthlyGrowth: 24.8,
          totalOrders,
          inventoryValue
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time listeners
    const productsUnsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const inventoryValue = snapshot.docs.reduce((sum, doc) => {
        return sum + (Number(doc.data().price) || 0);
      }, 0);
      setStats(prev => ({ ...prev, inventoryValue }));
    });

    const transactionsUnsubscribe = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let todayRevenue = 0;
      let pendingOrders = 0;
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.createdAt && data.createdAt.toDate() >= today) {
          todayRevenue += (Number(data.total) || 0);
        }
        if (data.status === "pending") {
          pendingOrders++;
        }
      });

      setStats(prev => ({
        ...prev,
        todayRevenue,
        pendingOrders,
        totalOrders: snapshot.size
      }));
    });

    return () => {
      clearInterval(timer);
      productsUnsubscribe();
      transactionsUnsubscribe();
    };
  }, []);

  const currentHour = currentTime.getHours();

  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">
              {getGreeting()}, {displayName}
            </h1>
            <div className="flex items-center mt-2 text-gray-500">
              <Clock size={16} className="mr-2" />
              <span>{formatDate()}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium">Pending Orders</p>
              <h3 className="text-2xl font-bold mt-1">{stats.pendingOrders}</h3>
            </div>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Package size={24} className="text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center">
            <TrendingUp size={16} className="mr-1" /> 3 new since yesterday
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium">Today's Revenue</p>
              <h3 className="text-2xl font-bold mt-1">{stats.todayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}Ugx</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center">
            <TrendingUp size={16} className="mr-1" /> 12% increase from yesterday
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium">Monthly Growth</p>
              <h3 className="text-2xl font-bold mt-1">{stats.monthlyGrowth}%</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center">
            <TrendingUp size={16} className="mr-1" /> 7.2% higher than last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Package size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center">
            <TrendingUp size={16} className="mr-1" /> 18 new this week
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium">Inventory Value</p>
              <h3 className="text-2xl font-bold mt-1">{stats.inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} Ugx</h3>
            </div>
            <div className="bg-amber-100 p-2 rounded-lg">
              <Package size={24} className="text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center">
            <TrendingUp size={16} className="mr-1" /> {Math.floor(stats.inventoryValue / 1000)}k in stock
          </p>
        </div>
      </div>
      
      {/* Orders section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Recent Orders</h2>
        <TabsRender />
      </div>
    </div>
  );
};

export default HomeContent;