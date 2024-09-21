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
  const router = useRouter();

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
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

  return (
    <div className="container mx-auto mt-8 p-4 dark:bg-white-900">
      <h2 className="text-3xl font-bold mb-4">Latest Arrivals</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <>
          {error && <p>Error: {error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden flex flex-col cursor-pointer shadow-md hover:shadow-lg"
                onClick={() => handleProductClick(product)}
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col justify-between flex-grow bg-white rounded-b-lg">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-gray-500">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 dark:text-gray-500">{product.description}</p>
                  </div>
                  <p className="text-lg font-semibold mt-2 dark:text-gray-500">{product.price} Ugx</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LatestArrivals;
