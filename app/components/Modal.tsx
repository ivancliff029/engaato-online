import React from 'react';

const Modal = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full">
        <button className="text-gray-600 float-right" onClick={onClose}>×</button>
        {product && (
          <div>
            <img src={product.imageUrl} alt={product.title} className="w-full h-64 object-cover mb-4" />
            <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            <p className="text-lg font-semibold">{product.price} Ugx</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
