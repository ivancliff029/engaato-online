"use client";
import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import ProductCard from './ProductCard';
import ClipLoader from "react-spinners/ClipLoader";
import Modal from './Modal';
import { useCart } from '../context/CartContext';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid'); // For changing view type
  const { getCartItemCount, cart, removeFromCart, getTotalPrice } = useCart();

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

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const toggleViewType = () => {
    setViewType((prevType) => (prevType === 'grid' ? 'list' : 'grid'));
  };

  const handleFilterChange = async (criteria: string) => {
    setLoading(true);
    try {
      const productCollection = collection(db, 'products');
      let querySnapshot;
      switch (criteria) {
        case 'latest':
          querySnapshot = await getDocs(query(productCollection, orderBy('createdAt', 'desc')));
          break;
        case 'trending':
          querySnapshot = await getDocs(query(productCollection, orderBy('views', 'desc')));
          break;
        case 'upcoming':
          querySnapshot = await getDocs(query(productCollection, orderBy('releaseDate', 'asc')));
          break;
        default:
          querySnapshot = await getDocs(productCollection);
          break;
      }
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
      console.error('Error filtering products:', error);
      setError('An error occurred while filtering products.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Products</h2>
        <div className="flex items-center">
          <button
            onClick={toggleViewType}
            className="mr-4 text-gray-600 focus:outline-none"
          >
            {viewType === 'grid' ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 4v16M12 4v16m6-8v4H6v-4h12z"
                ></path>
              </svg>
            )}
          </button>
          <select
            onChange={(e) => handleFilterChange(e.target.value)}
            className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm text-gray-700 focus:outline-none"
          >
            <option value="">Filter by</option>
            <option value="latest">Latest</option>
            <option value="trending">Most Trending</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <>
          {error && <p>Error: {error}</p>}
          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onClick={handleProductClick} />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-md p-4 mb-4 flex items-center">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-32 h-32 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-gray-700 mb-2">{product.description}</p>
                    <p className="text-lg font-semibold">{product.price}</p>
                    <button
                      onClick={() => handleProductClick(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 focus:outline-none"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedProduct && (
        <Modal isOpen={!!selectedProduct} onClose={handleCloseModal} product={selectedProduct} />
      )}
    </div>
  );
};

export default ProductsList;
