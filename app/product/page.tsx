// app/product/page.tsx (for Next.js 13+ using app directory)
import React from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ProductsList from '../components/ProductList';
import { Product } from '../types/types';

// This is now a Server Component
const ProductPage = async () => {
  const products = await getProducts(); // Fetch products from Firestore

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-10 px-5 bg-white">
        <h1 className="text-3xl font-bold mb-4 mt-5 dark:text-gray-700">Store</h1>
        <ProductsList products={products} />
      </div>
    </div>

  );
};

// Helper function to fetch products from Firestore
const getProducts = async (): Promise<Product[]> => {
  const productsCollection = collection(db, 'products');
  const productSnapshot = await getDocs(productsCollection);
  const products = productSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];

  return products;
};

export default ProductPage;
