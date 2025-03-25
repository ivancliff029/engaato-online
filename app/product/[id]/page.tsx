"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '../../types/types';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

interface ProductDetailsProps {
  params: { id: string };
}

interface SizeProps {
  size: number;
  country: string;
}

const ProductDetails = async ({ params }: ProductDetailsProps) => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const shoeSizes: SizeProps[] = [
    { size: 39, country: "USA" },
    { size: 40, country: "USA" },
    { size: 41, country: "USA" },
    { size: 42, country: "USA" },
    { size: 43, country: "USA" },
    { size: 44, country: "USA" },
    { size: 45, country: "USA" },
  ];

  return (
    <div className="container mx-auto mt-8 p-4 dark:bg-gray-900">
      <BackButton />

      <div className="flex flex-col md:flex-row border rounded-lg shadow-md p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">
            {product.title}
          </h2>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-400">
            {product.description}
          </p>

          <p className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200">
            {product.price} Ugx <span className="text-red-500">15% OFF</span>
          </p>
          <p className="text-sm text-gray-500 mb-4 line-through dark:text-gray-400">
            Original Price: {(product.price * 1.15).toFixed(2)} Ugx
          </p>

          <label htmlFor="shoe-size" className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200">
            Shoe Size:
          </label>
          <div className="flex">
            {shoeSizes.map((sizeOption) => (
              <div key={sizeOption.size} className="text-gray-300 border rounded px-2 cursor-pointer hover:bg-gray-400 hover:text-white mx-2">
                {sizeOption.size}
              </div>
            ))}
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

const getProduct = async (id: string): Promise<Product | null> => {
  const productRef = doc(db, 'products', id);
  const productDoc = await getDoc(productRef);

  if (!productDoc.exists()) {
    return null;
  }

  return { id: productDoc.id, ...productDoc.data() } as Product;
};

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
    >
      <FaArrowLeft className="mr-2" />
      Back
    </button>
  );
};

const AddToCartButton = ({ product }: { product: Product }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAddedToCart(true);
  };

  return (
    <>
      {!addedToCart ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 dark:bg-blue-700 dark:hover:bg-blue-800"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      ) : (
        <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded mt-4 dark:bg-green-700">
          <FaCheck className="mr-2" /> Added to Cart
        </button>
      )}
    </>
  );
};

export default ProductDetails;