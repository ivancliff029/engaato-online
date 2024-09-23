"use client";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; 
import SettingsContent from "./SettingsContent";
import ProductManagementContent from "./ProductManagementContent";
import ProfileContent from "./ProfileContent";
import ReportsContent from "./ReportsContent";
import HomeContent from "./HomeContent";

interface SidebarLink {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
  activeLinkId: string;
  onLinkClick: (id: string) => void;
  isSidebarOpen: boolean;
}

interface MainContentProps {
  content: React.ReactNode;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  links,
  activeLinkId,
  onLinkClick,
  isSidebarOpen,
}) => {
  return (
    <nav
      style={{ marginTop: "50px" }}
      className={`mt-15 bg-gray-800 dark:bg-gray-900 text-white h-screen fixed top-0 left-0 transition-transform transform ${
        isSidebarOpen ? "w-64" : "w-0"
      } overflow-hidden`}
    >
      <ul className={`${isSidebarOpen ? "block" : "hidden"}`}>
        {links.map((link) => (
          <li key={link.id}>
            <button
              onClick={() => onLinkClick(link.id)}
              className={`w-full text-left py-4 px-6 hover:bg-gray-700 dark:hover:bg-gray-800 ${
                activeLinkId === link.id
                  ? "bg-gray-700 dark:bg-gray-800"
                  : ""
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

const MainContent: React.FC<MainContentProps> = ({
  content,
  toggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <div
      className={`p-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 transition-all duration-300 ${
        isSidebarOpen ? "ml-64" : "ml-0"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 focus:outline-none hover:bg-blue-600 flex items-center"
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      <div className="overflow-auto h-[calc(100vh-64px)]"> {/* Adjust height as needed */}
        {content}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [activeLinkId, setActiveLinkId] = useState<string>("home"); // Default to "home"
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { currentUser, userRole } = useAuth(); 
  const [lastName, setLastName] = useState<string | undefined>(undefined);

  const links: SidebarLink[] = [
    { 
      id: "home", 
      label: "Home", 
      content: <HomeContent userEmail={currentUser?.email || undefined} lastName={lastName} /> 
    },
    { 
      id: "profile", 
      label: "Profile", 
      content: <ProfileContent onUpdateLastName={setLastName} /> 
    },
    { 
      id: "settings", 
      label: "Settings", 
      content: <SettingsContent /> 
    },
    { 
      id: "reports", 
      label: "Reports", 
      content: <ReportsContent /> 
    },
  ];

  if (userRole === "admin") {
    links.push({
      id: "product-management",
      label: "Manage",
      content: <ProductManagementContent />,
    });
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Set the content based on active link ID
  const currentContent = links.find((link) => link.id === activeLinkId)?.content || null;

  return (
    <div className="flex">
      <Sidebar
        links={links}
        activeLinkId={activeLinkId}
        onLinkClick={setActiveLinkId} // Update active link when clicked
        isSidebarOpen={isSidebarOpen}
      />
      <MainContent
        content={currentContent} // Use currentContent to display the right content
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
};

export default Dashboard;
