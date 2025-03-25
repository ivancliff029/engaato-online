"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { FaArrowLeft, FaCheck, FaStar } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an auth context

const ProductDetails = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth(); // Assuming you have user authentication

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        // Fetch product
        const productDoc = await getProduct(params.id);
        if (!productDoc) {
          router.push('/404');
          return;
        }
        setProduct(productDoc);

        // Fetch reviews for this product
        const productReviews = await getProductReviews(params.id);
        setReviews(productReviews);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductAndReviews();
  }, [params.id]);

  const shoeSizes = [
    { size: 39, country: "USA" },
    { size: 40, country: "USA" },
    { size: 41, country: "USA" },
    { size: 42, country: "USA" },
    { size: 43, country: "USA" },
    { size: 44, country: "USA" },
    { size: 45, country: "USA" },
  ];

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    if (newReview.rating === 0 || !newReview.comment.trim()) {
      alert('Please provide a rating and a comment');
      return;
    }

    setIsSubmittingReview(true);

    try {
      await addDoc(collection(db, 'reviews'), {
        productId: params.id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        ...newReview,
        createdAt: serverTimestamp(),
      });

      // Refresh reviews
      const updatedReviews = await getProductReviews(params.id);
      setReviews(updatedReviews);

      // Reset form
      setNewReview({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-8 p-4 dark:bg-gray-900">
      <button
        onClick={() => router.back()}
        className="flex items-center mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="flex flex-col md:flex-row border rounded-lg shadow-md p-4 dark:bg-gray-800 dark:border-gray-700">
        {/* Product Details Section */}
        <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">
            {product.title}
          </h2>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-400">
            {product.description}
          </p>

          <p className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200">
            {product.price} Ugx <span className="text-red-500">15% OFF</span>
          </p>
          <p className="text-sm text-gray-500 mb-4 line-through dark:text-gray-400">
            Original Price: {(product.price * 1.15).toFixed(2)} Ugx
          </p>

          <label htmlFor="shoe-size" className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200">
            Shoe Size:
          </label>
          <div className="flex mb-4">
            {shoeSizes.map((sizeOption) => (
              <div 
                key={sizeOption.size} 
                className="text-gray-300 border rounded px-2 cursor-pointer hover:bg-gray-400 hover:text-white mx-2"
              >
                {sizeOption.size}
              </div>
            ))}
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            onClick={() => addToCart(product, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-200">
          Customer Reviews
        </h3>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-gray-100 p-4 rounded-lg dark:bg-gray-700"
              >
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-500 mr-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {review.userName}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to review this product!
          </p>
        )}

        {/* Add Review Form */}
        {user && (
          <form onSubmit={handleAddReview} className="mt-6">
            <h4 className="text-lg font-semibold mb-4 dark:text-gray-200">
              Write a Review
            </h4>
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  className={`text-2xl mr-1 ${
                    newReview.rating >= star 
                      ? 'text-yellow-500' 
                      : 'text-gray-300 hover:text-yellow-300'
                  }`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Write your review here..."
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows="4"
            />
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Fetch product from Firestore
const getProduct = async (id) => {
  try {
    const productRef = doc(db, 'products', id);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return null;
    }

    return { id: productDoc.id, ...productDoc.data() };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Fetch reviews for a specific product
const getProductReviews = async (productId) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('productId', '==', productId));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export default ProductDetails;