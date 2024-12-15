"use client";
import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import ClipLoader from "react-spinners/ClipLoader";
import { Product } from '../types/types';
import { useRouter } from 'next/navigation';

const LatestArrivals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const router = useRouter();

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
    console.log(`${product.title} added to cart!`);
    // Add logic to handle cart addition here
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollection = collection(db, 'products');
        const querySnapshot = await getDocs(productCollection);
        const productsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const productData = doc.data();
            const imageUrl = await getImageUrl(productData.imageUrl);
            return { id: doc.id, ...productData, imageUrl } as Product;
          })
        );

        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('An error occurred while fetching products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = async (path: string): Promise<string | null> => {
    try {
      if (path) {
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        return url;
      }
      return null;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto mt-8 p-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Latest Arrivals</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <>
          {error && <p className="text-red-500 dark:text-red-400">Error: {error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden flex flex-col cursor-pointer shadow-md hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col justify-between flex-grow bg-white rounded-b-lg dark:bg-gray-800">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-300 text-green-500">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-300 ">{product.price} Ugx</p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <p className="text-gray-800 dark:text-gray-300">Page {currentPage}</p>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= products.length}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LatestArrivals;
