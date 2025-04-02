"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import SettingsContent from "../components/SettingsContent";
import ProductManagementContent from "../components/ProductManagementContent";
import ProfileContent from "../components/ProfileContent";
import ReportsContent from "../components/ReportsContent";
import HomeContent from "../components/HomeContent";
import OrdersPage from "../components/OrdersPage";
import { Home, User, Settings, BarChart, Package, ShoppingBag } from "lucide-react";

const Dashboard = () => {
  const [activeLinkId, setActiveLinkId] = useState("home");
  const { currentUser, userRole } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Check if mobile view
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Update current URL
    setCurrentUrl(`${window.location.protocol}//${window.location.host}/dashboard/${activeLinkId}`);

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [activeLinkId]);

  // Navigation links configuration
  const navLinks = [
    { id: "home", label: "Home", icon: Home, path: "home" },
    { id: "profile", label: "Profile", icon: User, path: "profile" },
    { id: "settings", label: "Settings", icon: Settings, path: "settings" },
    { id: "reports", label: "Reports", icon: BarChart, path: "reports" },
  ];

  // Add admin-only links
  if (userRole === "admin") {
    navLinks.push(
      { id: "product-management", label: "Products", icon: Package, path: "products" },
      { id: "orders", label: "Orders", icon: ShoppingBag, path: "orders" }
    );
  }

  // Render content based on active link
  const renderContent = () => {
    switch (activeLinkId) {
      case "home":
        return <HomeContent userEmail={currentUser?.email} />;
      case "profile":
        return <ProfileContent />;
      case "settings":
        return <SettingsContent />;
      case "reports":
        return <ReportsContent />;
      case "product-management":
        return <ProductManagementContent />;
      case "orders":
        return <OrdersPage />;
      default:
        return <HomeContent userEmail={currentUser?.email} />;
    }
  };

  // Format the URL for display
  const formatDisplayUrl = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const activeLink = navLinks.find(link => link.id === activeLinkId);
    return `${baseUrl}/dashboard/${activeLink?.path || ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        {/* Top Bar with Title and User */}
        <div className="flex justify-between items-center py-3 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 hidden md:block">
              {currentUser?.email}
            </span>
            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <User size={18} />
            </div>
          </div>
        </div>

        {/* Icon Navigation */}
        <div className="px-2 py-2 bg-white overflow-x-auto hide-scrollbar">
          <div className="flex justify-center items-center space-x-1 mx-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveLinkId(link.id)}
                  className={`flex flex-col items-center p-2 rounded-lg min-w-[70px] transition-all ${activeLinkId === link.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="text-xs mt-1 truncate">{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6">
        <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4 md:p-6">
          {renderContent()}
        </div>
      </main>

      {/* Mobile bottom spacer */}
      {isMobile && <div className="h-16"></div>}

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;