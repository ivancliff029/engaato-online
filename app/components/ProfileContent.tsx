import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../lib/firebase"; // Make sure storage is imported from your Firebase config
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary functions from Firebase Storage
import Modal from "../components/Modal";

const ProfileContent: React.FC<{ onUpdateLastName: (lastName: string) => void }> = ({ onUpdateLastName }) => {
  const { currentUser } = useAuth(); // currentUser might be null
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    role: '',
    profileImage: '' // New field to hold the profile image URL
  });
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null); // State to hold the selected image file
  const [imageUrl, setImageUrl] = useState<string>(''); // State to hold the uploaded image URL

  // Fetch additional user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          setFormData({
            username: userData.username || currentUser.displayName || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            dob: userData.dob || '',
            phone: userData.phone || '',
            role: userData.role || '', // Preserve the role field
            profileImage: userData.profileImage || '' // Load existing profile image URL
          });
          setImageUrl(userData.profileImage || ''); // Set the image URL state

          const isProfileComplete = userData.firstName && userData.lastName && userData.dob && userData.phone;
          if (!isProfileComplete) {
            setProfileIncomplete(true);
            setShowModal(true);
          }
        } else {
          setProfileIncomplete(true);
          setShowModal(true);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string); // Display the selected image before upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMessage('User not authenticated');
      return;
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const { role } = userDocSnap.data();

        // Upload image if it exists
        let uploadedImageUrl = '';
        if (imageFile) {
          const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
          await uploadBytes(storageRef, imageFile);
          uploadedImageUrl = await getDownloadURL(storageRef);
        }

        await setDoc(userDocRef, {
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob,
          phone: formData.phone,
          role: role,
          profileImage: uploadedImageUrl || formData.profileImage // Preserve existing image if no new image
        });

      } else {
        // If no document exists, create a new one
        await setDoc(userDocRef, {
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob,
          phone: formData.phone,
          role: formData.role || 'user',
          profileImage: '' // Initialize profile image as empty
        });
      }

      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");
      onUpdateLastName(formData.lastName);
      setShowModal(false); // Close modal after update
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
      setSuccessMessage("");
    }
  };

  if (!currentUser) {
    return <div className="text-center">Please log in to update your profile.</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold mb-2">Account Profile Incomplete</h2>
          <p className="text-gray-600 mb-4">
            Your account profile is not complete. Please fill in the necessary information.
          </p>
          <button
            onClick={() => setShowModal(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Close
          </button>
        </Modal>
      )}

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
        
        {/* Image Upload Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
        />
        
        {/* Display selected image */}
        {imageUrl && (
          <img src={imageUrl} alt="Profile Preview" className="w-24 h-24 rounded-full mt-2" />
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileContent;
