"use client"
import React, { useState } from 'react';
import { Product, FilterOptions } from '../types/types';
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

// Define the props interface for ProductPageClient
interface ProductPageClientProps {
  initialProducts: Product[];
  categories: string[];
}

const ITEMS_PER_PAGE = 9;

// Helper function to parse price
const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  return parseFloat(price.replace(/[^\d.-]/g, '')) || 0;
};

const ProductPageClient: React.FC<ProductPageClientProps> = ({ initialProducts, categories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const [products] = useState<Product[]>(initialProducts);
  const [isLoading] = useState(false);

  const currentFilters: FilterOptions = {
    category: searchParams.get('category') || 'all',
    minPrice: Number(searchParams.get('minPrice')) || 20000,
    maxPrice: Number(searchParams.get('maxPrice')) || 200000,
    sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || 'price-asc',
  };

  const filteredProducts = products
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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const generatePageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNum.toString());
    return `/product?${params.toString()}`;
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
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
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-gray-700">Store</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProductFilters
              categories={categories}
              filters={currentFilters}
              onFilterChange={handleFilterChange}
            />
            <Earn />
          </div>

          <div className="lg:col-span-3">
            <ProductsList products={paginatedProducts} />
            
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={generatePageUrl(Math.max(1, page - 1))}
                        aria-disabled={page <= 1}
                        className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
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
};

export default ProductPageClient;
