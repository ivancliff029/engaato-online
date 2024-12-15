
"use client";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; 
import SettingsContent from "../components/SettingsContent";
import ProductManagementContent from "../components/ProductManagementContent";
import ProfileContent from "../components/ProfileContent";
import ReportsContent from "../components/ReportsContent";
import HomeContent from "../components/HomeContent";
import OrdersPage from "../components/OrdersPage";

// Sidebar Link Interface
interface SidebarLink {
  id: string;
  label: string;
}

// Sidebar Component Props
interface SidebarProps {
  links: SidebarLink[];
  activeLinkId: string;
  onLinkClick: (id: string) => void;
  isSidebarOpen: boolean;
}

// Main Content Component Props
interface MainContentProps {
  content: React.ReactNode;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({
  links,
  activeLinkId,
  onLinkClick,
  isSidebarOpen,
}) => {
  return (
    <nav
      className={`bg-gray-800 dark:bg-gray-900 text-white fixed top-0 mt-5 left-0 transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      } h-auto max-h-[calc(100vh)] overflow-y-auto`} // Sidebar now grows dynamically with content
    >
      <ul className="mt-10">
        {links.map((link) => (
          <li key={link.id} className="flex items-center">
            <button
              onClick={() => onLinkClick(link.id)} // Set the clicked link as active
              className={`w-full text-left py-4 px-4 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-300 ${
                activeLinkId === link.id ? "bg-gray-700 dark:bg-gray-800" : ""
              }`}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Main Content Component
const MainContent: React.FC<MainContentProps> = ({
  content,
  toggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <div
      className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} w-full`}
    >
      <div className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 py-4 px-6 flex justify-between items-center shadow-md">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none"
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="p-8 overflow-auto h-[calc(100vh-64px)]">{content}</div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [activeLinkId, setActiveLinkId] = useState<string>("home"); // Default to "home"
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { currentUser, userRole } = useAuth();
  const [lastName, setLastName] = useState<string | undefined>(undefined);

  // Define Sidebar Links
  const links: SidebarLink[] = [
    { id: "home", label: "Home" },
    { id: "profile", label: "Profile" },
    { id: "settings", label: "Settings" },
    { id: "reports", label: "Reports" },
  ];

  if (userRole === "admin") {
    links.push({
      id: "product-management",
      label: "Manage",
    },{
      id : "orders",
      label : "Orders"
    },
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
        return <HomeContent userEmail={currentUser?.email || undefined} lastName={lastName} />;
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
        return <HomeContent userEmail={currentUser?.email || undefined} lastName={lastName} />;
    }
  };

  // Get current content based on the active link
  const currentContent = renderContent();

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar
        links={links}
        activeLinkId={activeLinkId}
        onLinkClick={setActiveLinkId} // Update active link when clicked
        isSidebarOpen={isSidebarOpen}
      />
      {/* Main Content Component */}
      <MainContent
        content={currentContent} // Use currentContent to display the right content
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
};

export default Dashboard;
