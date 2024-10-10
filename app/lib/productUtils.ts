import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../types/types';

export async function getProductsAndCategories(): Promise<{ products: Product[]; categories: string[] }> {
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