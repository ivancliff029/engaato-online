"use client"
import React, { useState, useEffect, useMemo } from 'react';
import ProductsList from './ProductList';
import ProductFilters from './Products/ProductFilters';
import Earn from '../components/Earn';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase'; 

const ITEMS_PER_PAGE = 9;

// Helper function to parse price
const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  return parseFloat(price.replace(/[^\d.-]/g, '')) || 0;
};

const ProductPageClient = ({ initialCategories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState(initialCategories || []);

  const currentFilters = {
    category: searchParams.get('category') || 'all',
    minPrice: Number(searchParams.get('minPrice')) || 20000,
    maxPrice: Number(searchParams.get('maxPrice')) || 200000,
    sortBy: searchParams.get('sortBy') || 'price-asc',
  };

  // Real-time products subscription
  useEffect(() => {
    setIsLoading(true);
    
    // Base query for products collection
    let productsQuery = collection(db, 'products');
    
    // Apply category filter if not 'all'
    if (currentFilters.category !== 'all') {
      productsQuery = query(productsQuery, where('category', '==', currentFilters.category));
    }
    
    // Apply price range filter
    productsQuery = query(
      productsQuery, 
      where('price', '>=', currentFilters.minPrice),
      where('price', '<=', currentFilters.maxPrice)
    );
    
    // Apply sorting
    const [sortField, sortDirection] = currentFilters.sortBy.split('-');
    productsQuery = query(
      productsQuery,
      orderBy(sortField, sortDirection === 'asc' ? 'asc' : 'desc')
    );

    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setIsLoading(false);
      
      // Update categories if we don't have them yet
      if (!initialCategories || initialCategories.length === 0) {
        const uniqueCategories = [...new Set(productsData.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    }, (error) => {
      console.error("Error fetching products:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentFilters.category, currentFilters.minPrice, currentFilters.maxPrice, currentFilters.sortBy]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const productPrice = parsePrice(product.price);
      return productPrice >= currentFilters.minPrice && productPrice <= currentFilters.maxPrice;
    });
  }, [products, currentFilters.minPrice, currentFilters.maxPrice]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const generatePageUrl = (pageNum) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNum.toString());
    return `/product?${params.toString()}`;
  };

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('category', newFilters.category);
    params.set('minPrice', newFilters.minPrice.toString());
    params.set('maxPrice', newFilters.maxPrice.toString());
    params.set('sortBy', newFilters.sortBy);
    
    router.push(`/product?${params.toString()}`);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      range.unshift("...");
    }
    if (page + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen font-inter">
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight mt-10"
        >
          Discover Our Collection
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <ProductFilters
                categories={categories}
                filters={currentFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
            <Earn />
          </motion.div>

          {/* Product Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <AnimatePresence>
              {paginatedProducts.length > 0 ? (
                <ProductsList products={paginatedProducts} />
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                  <p className="mt-2 text-gray-500">Try adjusting your filters</p>
                </div>
              )}
            </AnimatePresence>
            
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 flex justify-center"
              >
                <Pagination>
                  <PaginationContent className="flex items-center space-x-2 bg-white shadow-md rounded-full p-2">
                    <PaginationItem>
                      <PaginationPrevious
                        href={generatePageUrl(Math.max(1, page - 1))}
                        aria-disabled={page <= 1}
                        className={`rounded-full ${page <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                      />
                    </PaginationItem>

                    {getVisiblePages().map((pageNum, idx) => (
                      <PaginationItem key={idx}>
                        {pageNum === "..." ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href={generatePageUrl(pageNum)}
                            isActive={pageNum === page}
                            className={`rounded-full ${pageNum === page 
                              ? 'bg-blue-600 text-white' 
                              : 'hover:bg-gray-100'}`}
                          >
                            {pageNum}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href={generatePageUrl(Math.min(totalPages, page + 1))}
                        aria-disabled={page >= totalPages}
                        className={`rounded-full ${page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
);

export default ProductPageClient;