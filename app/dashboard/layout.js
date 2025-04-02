"use client";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import SettingsContent from "../components/SettingsContent";
import ProductManagementContent from "../components/ProductManagementContent";
import ProfileContent from "../components/ProfileContent";
import ReportsContent from "../components/ReportsContent";
import HomeContent from "../components/HomeContent";
import OrdersPage from "../components/OrdersPage";
import { Menu, X, Home, User, Settings, BarChart, Package, ShoppingBag } from "lucide-react";

// Sidebar Component
const Sidebar = ({ links, activeLinkId, onLinkClick, isSidebarOpen }) => {
  // Map of icons for each link
  const linkIcons = {
    "home": Home,
    "profile": User,
    "settings": Settings,
    "reports": BarChart,
    "product-management": Package,
    "orders": ShoppingBag
  };

  return (
    <nav
      className={`bg-indigo-900 text-white fixed top-0 left-0 transition-all duration-300 ease-in-out z-30 ${
        isSidebarOpen ? "w-64" : "w-20"
      } h-screen overflow-y-auto`}
      style={{ position: 'fixed', height: '100%' }}
    >
      <div className="flex items-center justify-center h-16 border-b border-indigo-800">
        <h2 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>Dashboard</h2>
        {!isSidebarOpen && <div className="h-6 w-6 bg-indigo-700 rounded-md"></div>}
      </div>
      <ul className="mt-6 space-y-2 px-3 pb-20">
        {links.map((link) => {
          const IconComponent = linkIcons[link.id] || Home;
          return (
            <li key={link.id}>
              <button
                onClick={() => onLinkClick(link.id)}
                className={`w-full flex items-center py-3 px-4 rounded-md transition-colors duration-200 
                ${activeLinkId === link.id 
                  ? "bg-indigo-700 text-white" 
                  : "text-indigo-100 hover:bg-indigo-800"
                }`}
              >
                <IconComponent size={20} className="flex-shrink-0" />
                {isSidebarOpen && <span className="ml-3">{link.label}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// Main Content Component
const MainContent = ({ content, toggleSidebar, isSidebarOpen }) => {
  return (
    <div
      className={`flex flex-col min-h-screen transition-all duration-300 ${
        isSidebarOpen ? "ml-64" : "ml-20"
      } w-auto flex-1`}
    >
      <header className="bg-white py-4 px-6 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-indigo-600 focus:outline-none"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <User size={20} />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow bg-gray-50 p-6">
        <div className="w-full max-w-7xl mx-auto">
          {content}
        </div>
      </main>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [activeLinkId, setActiveLinkId] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser, userRole } = useAuth();
  const [lastName, setLastName] = useState(undefined);

  // Define Sidebar Links
  const links = [
    { id: "home", label: "Home" },
    { id: "profile", label: "Profile" },
    { id: "settings", label: "Settings" },
    { id: "reports", label: "Reports" },
  ];

  if (userRole === "admin") {
    links.push(
      { id: "product-management", label: "Products" },
      { id: "orders", label: "Orders" }
    );
  }

  // Toggle Sidebar Function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to return the right content based on active link ID
  const renderContent = () => {
    switch (activeLinkId) {
      case "home":
        // Updated to match HomeContent component's expected props
        return <HomeContent userEmail={currentUser?.email || undefined} />;
      case "profile":
        return <ProfileContent onUpdateLastName={setLastName} />;
      case "settings":
        return <SettingsContent />;
      case "reports":
        return <ReportsContent />;
      case "product-management":
        return <ProductManagementContent />;
      case "orders":
        return <OrdersPage />;
      default:
        // Also updated here
        return <HomeContent userEmail={currentUser?.email || undefined} />;
    }
  };

  // Get current content based on the active link
  const currentContent = renderContent();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar
        links={links}
        activeLinkId={activeLinkId}
        onLinkClick={setActiveLinkId}
        isSidebarOpen={isSidebarOpen}
      />
      {/* Main Content Component */}
      <MainContent
        content={currentContent}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
};

export default Dashboard;