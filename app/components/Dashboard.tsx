// Dashboard.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Adjust the import based on your file structure

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
      className={`bg-gray-800 dark:bg-gray-900 text-white h-screen transition-transform transform ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}
    >
      <ul className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
        {links.map((link) => (
          <li key={link.id}>
            <button
              onClick={() => onLinkClick(link.id)}
              className={`w-full text-left py-4 px-6 hover:bg-gray-700 dark:hover:bg-gray-800 ${activeLinkId === link.id ? 'bg-gray-700 dark:bg-gray-800' : ''}`}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// MainContent Component
const MainContent: React.FC<MainContentProps> = ({ content, toggleSidebar, isSidebarOpen }) => {
  return (
    <div className={`p-8 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 transition-all duration-300 ${isSidebarOpen ? 'w-full md:ml-64' : 'w-full'}`}>
      <button
        onClick={toggleSidebar}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 focus:outline-none hover:bg-blue-600 flex items-center"
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      {content}
    </div>
  );
};

// HomeContent Component
const HomeContent: React.FC<{ userEmail: string | undefined; lastName: string | undefined }> = ({ userEmail, lastName }) => {
  const displayName = lastName || userEmail;

  return (
    <div>
      <h1 className="text-3xl font-bold">Home</h1>
      <p>Welcome, {displayName}</p>
      <h2 className="text-1xl font-bold mt-5 mb-5">Cool Feature Coming Up, Wait up</h2>
    </div>
  );
};

// ProfileContent Component
const ProfileContent: React.FC<{ onUpdateLastName: (lastName: string) => void }> = ({ onUpdateLastName }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Populate the form with existing user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.displayName || '',
        firstName: '',
        lastName: '',
        dob: '',
        phone: '',
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage('');
      onUpdateLastName(formData.lastName);
      clearFields();
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
      setSuccessMessage('');
    }
  };

  const clearFields = () => {
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      dob: '',
      phone: '',
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          required
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
          Update Profile
        </button>
      </form>
    </div>
  );
};

// SettingsContent Component (Placeholder)
const SettingsContent: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold">Settings</h1>
    <p>Settings content goes here.</p>
  </div>
);

// ReportsContent Component (Placeholder)
const ReportsContent: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold">Reports</h1>
    <p>Reports content goes here.</p>
  </div>
);

// Dashboard Component
const Dashboard: React.FC = () => {
  const [activeLinkId, setActiveLinkId] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { currentUser } = useAuth();
  const [lastName, setLastName] = useState<string | undefined>(undefined);

  const links: SidebarLink[] = [
    { 
      id: 'home', 
      label: 'Home', 
      content: <HomeContent userEmail={currentUser?.email ?? undefined} lastName={lastName} /> 
    },
    { id: 'profile', label: 'Profile', content: <ProfileContent onUpdateLastName={setLastName} /> },
    { id: 'settings', label: 'Settings', content: <SettingsContent /> },
    { id: 'reports', label: 'Reports', content: <ReportsContent /> },
  ];
  
  const activeLink = links.find((link) => link.id === activeLinkId);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        links={links}
        activeLinkId={activeLinkId}
        onLinkClick={(id: string) => setActiveLinkId(id)}
        isSidebarOpen={isSidebarOpen}
      />
      <MainContent content={activeLink?.content} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default Dashboard;
