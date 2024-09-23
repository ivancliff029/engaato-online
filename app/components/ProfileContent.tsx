import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext"; 

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
  
  export default ProfileContent;