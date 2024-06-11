"use client";
import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
}

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold mb-4">Products</h2>
      {loading && <p>Please wait, fetching data...</p>}
      {error && <p>Error: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
