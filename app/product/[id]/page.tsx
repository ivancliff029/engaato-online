"use client"
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '../../types/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaCheck } from 'react-icons/fa'; // Icons

interface ProductDetailsProps {
  params: { id: string };
}

const ProductDetails = async ({ params }: ProductDetailsProps) => {
  const product = await getProduct(params.id);

  if (!product) {
    notFound(); // Redirects to 404 if product not found
  }

  // Component structure
  return (
    <div className="container mx-auto mt-8 p-4 ">
      {/* Back Button */}
      <BackButton />

      {/* Flex container for image and details */}
      <div className="flex flex-col md:flex-row border rounded-lg shadow-md p-4">
        {/* Left side - Image */}
        <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        {/* Right side - Product details */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
          <p className="text-lg mb-4">{product.description}</p>
          
          {/* Discount Information */}
          <p className="text-xl font-semibold mb-2">
            {product.price} Ugx <span className="text-red-500">15% OFF</span>
          </p>
          <p className="text-sm text-gray-500 mb-4 line-through">
            Original Price: {(product.price * 1.15).toFixed(2)} Ugx
          </p>

          {/* Shoe Size Dropdown */}
          <label htmlFor="shoe-size" className="text-lg font-semibold mb-2">Shoe Size:</label>
          <select id="shoe-size" className="border rounded p-2 mb-4 dark:bg-gray-900">
            <option value="39">39</option>
            <option value="40">40</option>
            <option value="41">41</option>
            <option value="42">42</option>
            <option value="43">43</option>
            <option value="44">44</option>
            <option value="45">45</option>
          </select>

          {/* Add to Cart Button */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

// Helper function to fetch the product by ID
const getProduct = async (id: string): Promise<Product | null> => {
  const productRef = doc(db, 'products', id);
  const productDoc = await getDoc(productRef);

  if (!productDoc.exists()) {
    return null;
  }

  return { id: productDoc.id, ...productDoc.data() } as Product;
};

// Back Button Component
const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()} // Navigates back to the previous page
      className="flex items-center mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
    >
      <FaArrowLeft className="mr-2" /> {/* Icon for back */}
      Go Back
    </button>
  );
};

// Add to Cart Component
const AddToCartButton = ({ product }: { product: Product }) => {
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    // Add to cart logic here (e.g., add to state, send to backend, etc.)
    setAddedToCart(true);
    alert(`Added ${product.title} to cart!`);
  };

  return (
    <>
      {!addedToCart ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      ) : (
        <button
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          <FaCheck className="mr-2" /> Added to Cart
        </button>
      )}
    </>
  );
};

export default ProductDetails;
