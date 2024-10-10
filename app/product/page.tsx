"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Product, FilterOptions } from '../types/types';
import ProductsList from '../components/ProductList';
import ProductFilters from '../components/Products/ProductFilters';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "../components/ui/button";

const ITEMS_PER_PAGE = 9;

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  // States to hold fetched data and filters
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get current filter values from URL params
  const currentFilters: FilterOptions = {
    category: searchParams.get('category') || 'all',
    minPrice: Number(searchParams.get('minPrice')) || 20000,
    maxPrice: Number(searchParams.get('maxPrice')) || 200000,
    sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || 'price-asc',
  };

  useEffect(() => {
    // Fetch products and categories when the component mounts
    const fetchProductsAndCategories = async () => {
      setIsLoading(true);
      const { products, categories } = await getProductsAndCategories();
      setProducts(products);
      setCategories(categories);
      setIsLoading(false);
    };
    fetchProductsAndCategories();
  }, []);

  // Apply filters and sorting
  const filteredProducts = products
    .filter(product => {
      if (currentFilters.category !== 'all' && product.category !== currentFilters.category) return false;
      if (product.price < currentFilters.minPrice || product.price > currentFilters.maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      switch (currentFilters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Helper function to generate page URL
  const generatePageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNum.toString());
    return `/product?${params.toString()}`;
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('category', newFilters.category);
    params.set('minPrice', newFilters.minPrice.toString());
    params.set('maxPrice', newFilters.maxPrice.toString());
    params.set('sortBy', newFilters.sortBy);
    
    router.push(`/product?${params.toString()}`);
  };

  // Calculate visible page numbers
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
    return <div>Loading...</div>; // Replace with a spinner or loading component
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-gray-700">Store</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              categories={categories}
              filters={currentFilters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductsList products={paginatedProducts} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={generatePageUrl(Math.max(1, page - 1))}
                        aria-disabled={page <= 1}
                        className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                        size="sm"
                      />
                    </PaginationItem>

                    {getVisiblePages().map((pageNum, idx) => (
                      <PaginationItem key={idx}>
                        {pageNum === "..." ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href={generatePageUrl(pageNum as number)}
                            isActive={pageNum === page}
                            size="sm"
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
                        className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                        size="sm"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to fetch products and categories from Firestore
async function getProductsAndCategories(): Promise<{ products: Product[]; categories: string[] }> {
  const productsCollection = collection(db, 'products');
  const productSnapshot = await getDocs(productsCollection);
  const products = productSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map(product => product.category)));

  return { products, categories };
}
