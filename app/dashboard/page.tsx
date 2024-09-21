"use client";
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importing icons

// Define the props type for the Sidebar and MainContent components
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

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ links, activeLinkId, onLinkClick, isSidebarOpen }) => {
  return (
    <nav
      className={`bg-gray-800 dark:bg-gray-900 text-white h-screen transition-transform transform ${
        isSidebarOpen ? 'w-64' : 'w-0'
      } overflow-hidden`} // Adjust width to 0 when closed
    >
      <ul className={`${isSidebarOpen ? 'block' : 'hidden'}`}> {/* Hide content when closed */}
        {links.map((link) => (
          <li key={link.id}>
            <button
              onClick={() => onLinkClick(link.id)}
              className={`w-full text-left py-4 px-6 hover:bg-gray-700 dark:hover:bg-gray-800 ${
                activeLinkId === link.id ? 'bg-gray-700 dark:bg-gray-800' : ''
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

// MainContent Component with Dark Mode support and sidebar toggle button
const MainContent: React.FC<MainContentProps> = ({ content, toggleSidebar, isSidebarOpen }) => {
  return (
    <div
      className={`p-8 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 transition-all duration-300 ${
        isSidebarOpen ? 'w-full md:ml-64' : 'w-full'
      }`} // Expand to full width when sidebar is closed
    >
      {/* Button to toggle the sidebar */}
      <button
        onClick={toggleSidebar}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 focus:outline-none hover:bg-blue-600 flex items-center"
      >
        {/* Conditionally render the icons for open/close */}
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Content */}
      {content}
    </div>
  );
};

// Dashboard Component
const Dashboard: React.FC = () => {
  // State to keep track of the currently active link
  const [activeLinkId, setActiveLinkId] = useState<string>('home');
  
  // State to handle sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Links for the sidebar
  const links: SidebarLink[] = [
    { id: 'home', label: 'Home', content: <HomeContent /> },
    { id: 'profile', label: 'Profile', content: <ProfileContent /> },
    { id: 'settings', label: 'Settings', content: <SettingsContent /> },
    { id: 'reports', label: 'Reports', content: <ReportsContent /> },
  ];

  // Find the active content based on the active link
  const activeLink = links.find((link) => link.id === activeLinkId);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        links={links}
        activeLinkId={activeLinkId}
        onLinkClick={(id: string) => setActiveLinkId(id)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Content */}
      <MainContent content={activeLink?.content} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

// Example Components for different sections of the dashboard
const HomeContent: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold">Home</h1>
    <p>Welcome to the home page of your dashboard!</p>
  </div>
);

const ProfileContent: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold">Profile</h1>
    <p>Here you can update your profile information.</p>
  </div>
);

const SettingsContent: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold">Settings</h1>
    <p>Adjust your preferences and settings here.</p>
  </div>
);

const ReportsContent: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold">Reports</h1>
    <p>View your reports and data analytics.</p>
  </div>
);

export default Dashboard;
