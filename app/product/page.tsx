import { Suspense } from 'react';
import { getProductsAndCategories } from '../lib/productUtils';
import ProductPageClient from '../components/ProductPageClient';

export async function generateMetadata() {
  return {
    title: 'Product Page',
    description: 'View our products and apply filters',
  };
}

export default async function ProductPage() {
  const { products, categories } = await getProductsAndCategories();
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductPageClient initialProducts={products} categories={categories} />;
    </Suspense>
  )}