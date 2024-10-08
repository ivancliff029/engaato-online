import React from 'react';

interface CheckoutProps {
  total: number;
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ total, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Total: {total} Ugx
        </h2>
        <button className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full hover:bg-blue-600 dark:hover:bg-blue-700">
          Pay with Mobile Money
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded mt-2 w-full hover:bg-red-600 dark:hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Checkout;
