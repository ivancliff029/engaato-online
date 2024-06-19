import React from 'react';

interface CheckoutProps {
  total: number;
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ total, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Total: {total} Ugx</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full">Pay with Mobile Money</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full">Pay with Bank</button>
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mt-2 w-full">Cancel</button>
      </div>
    </div>
  );
};

export default Checkout;
