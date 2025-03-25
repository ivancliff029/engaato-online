"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { Product } from '../types/types';
import { useRouter } from 'next/navigation';

const LatestArrivals = () => {
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
    <section className="relative bg-neutral-50 py-16 px-4 overflow-hidden">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Headline */}
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-black text-center mb-12 text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-900 tracking-tight"
        >
          Latest Arrivals
        </motion.h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                repeat: Infinity, 
                duration: 1, 
                ease: "linear" 
              }}
              className="w-16 h-16 border-4 border-neutral-900 border-t-neutral-300 rounded-full"
            />
          </div>
        ) : (
          <>
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center text-xl"
              >
                {error}
              </motion.p>
            )}
            
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {currentProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl border border-neutral-100 group"
                  >
                    {product.imageUrl && (
                      <div className="relative overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">
                        {product.title}
                      </h3>
                      <p className="text-neutral-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-emerald-600">
                          {product.price} Ugx
                        </span>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-12 space-x-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 transition-all"
              >
                <ChevronLeft />
              </button>
              
              <div className="text-neutral-700 font-medium">
                Page {currentPage} of {Math.ceil(products.length / itemsPerPage)}
              </div>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage * itemsPerPage >= products.length}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 transition-all"
              >
                <ChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LatestArrivals;