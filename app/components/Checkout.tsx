import React, { useState, useEffect } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useAuth } from '../context/AuthContext'; // Adjust the import path as needed
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Type for environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_FLUTTER_WAVE_PUBLIC_KEY: string;
    }
  }
}

interface CheckoutProps {
  total: number;
  onClose: () => void;
  clearCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  total,
  onClose,
  clearCart,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user from AuthContext
  const { currentUser } = useAuth();

  // Get customer details from the current user
  const customerEmail = currentUser?.email || "guest@example.com";
  const [customerPhone, setCustomerPhone] = useState<string>("256778054598");
  const customerName = currentUser?.displayName || "Guest User";

  // Effect to fetch user's phone number from Firestore
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(getFirestore(), 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.phone) {
              setCustomerPhone(userData.phone);
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [currentUser]);

  // Ensure the public key is available
  const publicKey = process.env.NEXT_PUBLIC_FLUTTER_WAVE_PUBLIC_KEY;

  if (!publicKey) {
    console.error("Flutterwave public key is not defined in environment variables");
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-red-500">
            Configuration Error: Payment system is not properly configured.
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = useFlutterwave({
    public_key: publicKey,
    tx_ref: `TX-${Date.now()}`,
    amount: total,
    currency: "UGX",
    payment_options: "mobilemoneyuganda, card",
    customer: {
      email: customerEmail,
      phone_number: customerPhone,
      name: customerName,
    },
    customizations: {
      title: "Engaato Shoe App",
      description: "Payment for sneakers",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Logo_nike_principal.jpg",
    },
  });

  const handleContinuePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      await handlePayment({
        callback: (response) => {
          console.log("Payment Response:", response);
          if (response.status === "successful") {
            setPaymentStatus("success");
            clearCart();
            
            // Optional: Save transaction details to your backend
            // await saveTransactionDetails(response);
          } else {
            setPaymentStatus("failed");
            setError("Payment was not successful. Please try again.");
          }
          closePaymentModal();
        },
        onClose: () => {
          console.log("Payment modal closed");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      setError("An error occurred while processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentStatus === "success") {
      const timer = setTimeout(() => {
        setPaymentStatus(null);
        onClose(); // Close the checkout modal after successful payment
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        {paymentStatus === "success" && (
          <div className="bg-green-500 text-white p-4 mb-4 rounded flex items-center justify-center space-x-2">
            <span>Payment Successful! 🎉</span>
          </div>
        )}

        {paymentStatus === "failed" && (
          <div className="bg-red-500 text-white p-4 mb-4 rounded">
            <p className="font-bold mb-1">Payment Failed ❌</p>
            {error && <p className="text-sm">{error}</p>}
          </div>
        )}

        {!paymentStatus && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Checkout Summary
            </h2>
            
            <div className="mb-6">
              <div className="flex flex-col space-y-2 mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Customer Details:</strong>
                  <p>Name: {customerName}</p>
                  <p>Email: {customerEmail}</p>
                  <p>Phone: {customerPhone}</p>
                </div>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Total Amount:</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {total.toLocaleString()} UGX
                </span>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Payment processed securely via Flutterwave
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleContinuePayment}
                disabled={loading}
                className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-3 rounded w-full hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </span>
                ) : (
                  "Continue to Payment"
                )}
              </button>
              
              <button
                onClick={onClose}
                disabled={loading}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded w-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;