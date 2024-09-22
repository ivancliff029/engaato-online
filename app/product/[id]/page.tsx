"use client"; // Ensure the component is rendered on the client-side
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '../../types/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaCheck } from 'react-icons/fa'; // Icons
import { useCart } from '../../context/CartContext'; // Cart context


interface ProductDetailsProps {
  params: { id: string };
}
interface sizeProps{
  size:number;
  country:string;
}

const ProductDetails = async ({ params }: ProductDetailsProps) => {
  const [isActive, setIsActive] =useState<boolean>(true);
  // Fetch the product data
  const product = await getProduct(params.id);

  if (!product) {
    notFound(); // Redirects to 404 if the product is not found
  }

  const shoeSize:sizeProps[]=[
    {size:39,country:"USA"},
    {size:40,country:"USA"},
    {size:41,country:"USA"},
    {size:42,country:"USA"},
    {size:43,country:"USA"},
    {size:44,country:"USA"},
    {size:45,country:"USA"},
  ]

  return (
    <div className="container mx-auto mt-8 p-4 dark:bg-gray-900">
      {/* Back Button */}
      <BackButton />

      {/* Product Info */}
      <div className="flex flex-col md:flex-row border rounded-lg shadow-md p-4 dark:bg-gray-800 dark:border-gray-700">
        {/* Image Section */}
        <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">
            {product.title}
          </h2>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-400">
            {product.description}
          </p>

          {/* Price and Discount */}
          <p className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200">
            {product.price} Ugx <span className="text-red-500">15% OFF</span>
          </p>
          <p className="text-sm text-gray-500 mb-4 line-through dark:text-gray-400">
            Original Price: {(product.price * 1.15).toFixed(2)} Ugx
          </p>

          {/* Shoe Size Dropdown */}
          <label htmlFor="shoe-size" className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200">
            Shoe Size:
          </label>
          {/* <select id="shoe-size" className="border rounded p-2 mb-4 dark:bg-gray-900 dark:text-gray-500">
            <option value="39" className="dark:bg-gray-900 dark:text-gray-500">39</option>
            <option value="40">40</option>
            <option value="41">41</option>
            <option value="42">42</option>
            <option value="43">43</option>
            <option value="44">44</option>
            <option value="45">45</option>
          </select> */}
          <div className="flex ">
            <div className="text-gray-300 border rounded px-2 cursor-pointer hover:bg-gray-400 hover:text-white mx-2">39</div>
            <div className="text-gray-300 border rounded px-2 cursor-pointer hover:bg-gray-400 hover:text-white mx-2">40</div>
            <div className="text-gray-300 border rounded px-2 cursor-pointer hover:bg-gray-400 hover:text-white mx-2">41</div>
            <div className="text-gray-300 border rounded px-2 cursor-pointer hover:bg-gray-400 hover:text-white mx-2">45</div>
          </div>

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
      className="flex items-center mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
    >
      <FaArrowLeft className="mr-2" /> {/* Icon for back */}
      Go Back
    </button>
  );
};

// Add to Cart Button Component
const AddToCartButton = ({ product }: { product: Product }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart(); // Using cart context

  const handleAddToCart = () => {
    addToCart(product, 1); // Add product to cart with quantity 1
    setAddedToCart(true);
    alert(`Added ${product.title} to cart!`);
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
