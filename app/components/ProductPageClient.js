"use client"
import React, { useState, useMemo } from 'react';
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

const ITEMS_PER_PAGE = 9;

// Helper function to parse price
const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  return parseFloat(price.replace(/[^\d.-]/g, '')) || 0;
};

const ProductPageClient = ({ initialProducts, categories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const [products] = useState(initialProducts);
  const [isLoading] = useState(false);

  const currentFilters = {
    category: searchParams.get('category') || 'all',
    minPrice: Number(searchParams.get('minPrice')) || 20000,
    maxPrice: Number(searchParams.get('maxPrice')) || 200000,
    sortBy: searchParams.get('sortBy') || 'price-asc',
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        if (currentFilters.category !== 'all' && product.category !== currentFilters.category) return false;
        const productPrice = parsePrice(product.price);
        if (productPrice < currentFilters.minPrice || productPrice > currentFilters.maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);
        switch (currentFilters.sortBy) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'name-asc':
            return a.title.localeCompare(b.title);
          case 'name-desc':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [products, currentFilters]);

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
              <ProductsList products={paginatedProducts} />
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