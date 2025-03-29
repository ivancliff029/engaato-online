import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Trophy, Star, CheckCircle, XCircle, UploadCloud, User, Shield } from "lucide-react";

const ProfileContent = ({ onUpdateLastName }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    role: '',
    profileImage: ''
  });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const newFormData = {
            username: userData.username || currentUser.displayName || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            dob: userData.dob || '',
            phone: userData.phone || '',
            role: userData.role || '',
            profileImage: userData.profileImage || ''
          };
          
          setFormData(newFormData);
          setImageUrl(userData.profileImage || '');
          setXp(userData.xp || 0);
          setLevel(userData.level || 1);
          setBadges(userData.badges || []);

          // Calculate profile completion
          const fields = ['firstName', 'lastName', 'dob', 'phone', 'profileImage'];
          const completedFields = fields.filter(field => newFormData[field]).length;
          const completionPercentage = Math.floor((completedFields / fields.length) * 100);
          setProfileCompletion(completionPercentage);

          if (completionPercentage < 100) {
            setShowModal(true);
          }
        } else {
          setShowModal(true);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMessage('Please log in to update your profile');
      return;
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      // Upload image if selected
      let uploadedImageUrl = formData.profileImage;
      if (imageFile) {
        const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
        await uploadBytes(storageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(storageRef);
      }

      // Calculate XP gain (10 XP per field updated)
      const fields = ['firstName', 'lastName', 'dob', 'phone', 'profileImage'];
      const currentFields = userDocSnap.exists() ? userDocSnap.data() : {};
      const updatedFields = fields.filter(field => 
        formData[field] && formData[field] !== currentFields[field]
      );
      const xpGain = updatedFields.length * 10;
      const newXp = (userDocSnap.exists() ? currentFields.xp || 0 : 0) + xpGain;
      const newLevel = Math.floor(newXp / 100) + 1;

      // Check for new badges
      const newBadges = [];
      if (!userDocSnap.exists() || !currentFields.profileImage) {
        newBadges.push('First Profile Picture');
      }
      if (updatedFields.length >= 3) {
        newBadges.push('Profile Pro');
      }

      // Update user data
      await setDoc(userDocRef, {
        ...formData,
        profileImage: uploadedImageUrl,
        xp: newXp,
        level: newLevel,
        badges: [...(userDocSnap.exists() ? currentFields.badges || [] : []), ...newBadges]
      }, { merge: true });

      setXp(newXp);
      setLevel(newLevel);
      setBadges(prev => [...new Set([...prev, ...newBadges])]);
      setSuccessMessage("Profile updated successfully! +" + xpGain + " XP");
      setErrorMessage("");
      onUpdateLastName(formData.lastName);
      setShowModal(false);
      
      // Recalculate completion
      const completionPercentage = Math.floor(
        (fields.filter(field => field === 'profileImage' ? uploadedImageUrl : formData[field]).length / 
        fields.length * 100
      ))
      setProfileCompletion(completionPercentage);

    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
      setSuccessMessage("");
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm">
        <Shield className="mx-auto h-12 w-12 text-indigo-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Required</h2>
        <p className="text-gray-600">Please log in to access your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg">
      {/* Profile Header with Stats */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
              {imageUrl ? (
                <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full text-gray-400 p-4" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white rounded-full p-1 shadow-md">
              <span className="text-xs font-bold px-2">Lvl {level}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Profile</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-500">@{formData.username || 'username'}</span>
            {badges.length > 0 && (
              <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                <Trophy className="h-3 w-3" />
                {badges.length} {badges.length === 1 ? 'Badge' : 'Badges'}
              </span>
            )}
          </div>
          
          {/* XP Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>XP: {xp % 100}/100</span>
              <span>Level {level}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full" 
                style={{ width: `${xp % 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Profile Completion */}
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{profileCompletion}%</span>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-lg mb-6">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg mb-6">
          <XCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Completion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Complete Your Profile</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Your profile is {profileCompletion}% complete. Complete your profile to unlock rewards!
              </p>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Star className="h-5 w-5" />
                  <span className="font-medium">Complete your profile to earn 50 XP!</span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Continue to Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition">
                  <UploadCloud className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </label>
              {imageUrl && (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Save Profile</span>
          </button>
        </div>
      </form>

      {/* Badges Section */}
      {badges.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Your Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((badge, index) => (
              <div key={index} className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg border border-amber-200 flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Star className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-amber-800">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;