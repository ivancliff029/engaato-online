'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { auth, db, googleProvider } from "../../lib/firebase"; // Adjust import path as needed
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

export default function AffiliateApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    websiteUrl: "",
    socialMediaHandles: "",
    audienceSize: "",
    niche: "",
    promotionPlans: "",
    referralSource: "",
    previousAffiliateExperience: "",
    termsAgreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Update form data with Google profile information
      setFormData({
        ...formData,
        fullName: result.user.displayName || formData.fullName,
        email: result.user.email || formData.email
      });
    } catch (error) {
      setError("Google sign-in failed. Please try again or use email registration.");
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let userId = auth.currentUser?.uid;
      
      // If user is not signed in, create an account with email/password
      if (!userId && formData.email && formData.password) {
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        userId = userCredential.user.uid;
      }
      
      if (!userId) {
        throw new Error("User authentication is required to submit an application");
      }
      
      // Generate a unique application ID
      const applicationId = doc(collection(db, "applications")).id;
      
      // Format data for Firestore
      const applicationData = {
        applicationId,
        userId,
        fullName: formData.fullName,
        email: formData.email,
        websiteUrl: formData.websiteUrl,
        socialMediaHandles: formData.socialMediaHandles,
        audienceSize: formData.audienceSize,
        niche: formData.niche,
        promotionPlans: formData.promotionPlans,
        referralSource: formData.referralSource,
        previousAffiliateExperience: formData.previousAffiliateExperience,
        status: "pending", // Initial status
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Save to Firestore
      await setDoc(doc(db, "affiliateApplications", applicationId), applicationData);
      
      // Success - show confirmation and reset form
      setFormSubmitted(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      
    } catch (error) {
      setError(error.message);
      console.error("Application submission error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (formSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg border border-green-200 shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for applying to our affiliate program. Your application has been received and is being reviewed by our team. You'll receive an email notification once we've made a decision.
            </p>
            <p className="text-gray-600 mb-6">
              Redirecting you to the dashboard in a few seconds...
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            onClick={() => router.push("/earn")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Affiliate Information
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            Affiliate Program Application
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Join our network of successful affiliate marketers and start earning commissions by promoting our products.
          </p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-1 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 border-t-4 border-t-blue-500 overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-600">
                Fill out the form below to apply. Required fields are marked with an asterisk (*).
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google Sign-in Option */}
              <div className="w-full flex justify-center mb-4">
                <button 
                  type="button" 
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" className="mr-2">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                      <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                  )}
                  Continue with Google
                </button>
              </div>
              
              {/* Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or fill out the form</span>
                </div>
              </div>
              
              {/* Personal Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                {!auth.currentUser && (
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a secure password"
                      required={!auth.currentUser}
                    />
                  </div>
                )}
              </div>
              
              {/* Marketing Information Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Marketing Information</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">Website URL</label>
                    <input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="socialMediaHandles" className="block text-sm font-medium text-gray-700">Social Media Handles</label>
                    <input
                      id="socialMediaHandles"
                      name="socialMediaHandles"
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.socialMediaHandles}
                      onChange={handleChange}
                      placeholder="@instagram, @twitter, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="audienceSize" className="block text-sm font-medium text-gray-700">Audience Size *</label>
                      <select
                        id="audienceSize"
                        name="audienceSize"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.audienceSize}
                        onChange={handleSelectChange}
                        required
                      >
                        <option value="" disabled>Select audience size</option>
                        <option value="0-1000">0-1,000</option>
                        <option value="1001-5000">1,001-5,000</option>
                        <option value="5001-10000">5,001-10,000</option>
                        <option value="10001-50000">10,001-50,000</option>
                        <option value="50001-100000">50,001-100,000</option>
                        <option value="100000+">100,000+</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="niche" className="block text-sm font-medium text-gray-700">Primary Niche *</label>
                      <select
                        id="niche"
                        name="niche"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.niche}
                        onChange={handleSelectChange}
                        required
                      >
                        <option value="" disabled>Select your niche</option>
                        <option value="technology">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="health">Health & Wellness</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="business">Business</option>
                        <option value="education">Education</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="promotionPlans" className="block text-sm font-medium text-gray-700">How do you plan to promote our products? *</label>
                    <textarea
                      id="promotionPlans"
                      name="promotionPlans"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.promotionPlans}
                      onChange={handleChange}
                      placeholder="Describe your marketing strategies and channels"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="previousAffiliateExperience" className="block text-sm font-medium text-gray-700">Previous Affiliate Experience</label>
                    <textarea
                      id="previousAffiliateExperience"
                      name="previousAffiliateExperience"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.previousAffiliateExperience}
                      onChange={handleChange}
                      placeholder="Share your previous affiliate marketing experience and results"
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700">How did you hear about us? *</label>
                    <select
                      id="referralSource"
                      name="referralSource"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.referralSource}
                      onChange={handleSelectChange}
                      required
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="search">Search Engine</option>
                      <option value="social">Social Media</option>
                      <option value="friend">Friend or Colleague</option>
                      <option value="blog">Blog or Article</option>
                      <option value="email">Email Newsletter</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Terms Agreement */}
              <div className="flex items-start space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="termsAgreed"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                  className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="termsAgreed" className="text-sm text-gray-700">
                  I agree to the program terms and conditions, including the commission structure, payment terms, and promotional guidelines. *
                </label>
              </div>
              
              {/* Submit Button */}
              <div className="mt-8">
                <button 
                  type="submit" 
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Privacy Note */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>
            Your privacy is important to us. We'll never share your information with third parties without your consent.
          </p>
        </div>
      </div>
    </div>
  );
}