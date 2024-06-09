"use client";
import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import Modal from './Modal';

interface Product {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
}

const LatestArrivals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null as string | null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
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
        if (typeof error === 'string') {
          console.error('Error: ', error);
          setError(error);
        } else {
          console.error('Unknown error occurred.');
          setError("An unknown error occurred.");
        }        
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = async (path: string): Promise<string | null> => {
    try {
      if (path) {
        console.log('Fetching image URL for path:', path);  
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        console.log('Fetched URL:', url); 
        return url;
      }
      return null;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-4">Latest Arrivals</h2>
      {loading && <p>Please wait, fetching data...</p>}
      {error && <p>Error: {error}</p>}
      <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
           <div
           key={product.id}
           className="border rounded-lg overflow-hidden flex flex-col cursor-pointer"
           onClick={() => handleProductClick(product)}
         >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-48 object-cover cursor-pointer"
              />
            )}
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              </div>
              <p className="text-lg font-semibold mt-2">{product.price} Ugx</p>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} product={selectedProduct} />
    </div>

    </div>
  );
};

export default LatestArrivals;
