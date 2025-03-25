import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';

export default function ProductsList({ products }) {
  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    } else if (typeof price === 'string') {
      const numberPrice = parseFloat(price);
      return isNaN(numberPrice) ? 'N/A' : numberPrice.toFixed(2);
    }
    return 'N/A';
  };

  // Variant for framer motion
  const productVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={productVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="group relative"
        >
          <Link href={`/product/${product.id}`}>
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform">
              {/* Product Image */}
              <div className="relative w-full pt-[75%]">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 z-10 bg-white/70 p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100">
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
              </button>

              {/* Product Details */}
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-900 truncate mb-1">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {product.category}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-extrabold text-blue-600">
                    {formatPrice(product.price)} Ugx
                  </span>
                  
                  {/* Quick Add to Cart */}
                  <button className="bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors duration-300 opacity-0 group-hover:opacity-100">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}