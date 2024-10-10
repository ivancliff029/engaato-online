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
  return <ProductPageClient initialProducts={products} categories={categories} />;
}