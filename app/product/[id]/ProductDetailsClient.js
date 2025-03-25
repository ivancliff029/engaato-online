'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheck, FaStar } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const shoeSizes = [
  { size: 39, country: "USA" },
  { size: 40, country: "USA" },
  { size: 41, country: "USA" },
  { size: 42, country: "USA" },
  { size: 43, country: "USA" },
  { size: 44, country: "USA" },
  { size: 45, country: "USA" },
];

export default function ProductDetailsClient({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const router = useRouter();
  const { addToCart } = useCart();
  const { currentUser } = useAuth(); // Changed from 'user' to 'currentUser'

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('productId', '==', product.id));
        
        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [product.id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first');
      return;
    }
    addToCart(product, 1);
    setAddedToCart(true);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    // Check for user authentication
    if (!currentUser) {
      alert('Please log in to submit a review');
      return;
    }

    if (newReview.rating === 0 || !newReview.comment.trim()) {
      alert('Please provide a rating and a comment');
      return;
    }

    setIsSubmittingReview(true);

    try {
      const reviewData = {
        productId: product.id,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        ...newReview,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'reviews'), reviewData);

      // Update local reviews state
      setReviews(prev => [...prev, { id: docRef.id, ...reviewData }]);

      // Reset form
      setNewReview({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const calculatedOriginalPrice = product.price * 1.15;

  return (
    <div className="container mx-auto mt-8 p-4 dark:bg-gray-900">
      <button
        onClick={() => router.back()}
        className="flex items-center mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <div className="flex flex-col md:flex-row border rounded-lg shadow-md p-4 dark:bg-gray-800 dark:border-gray-700">
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
            {product.price.toLocaleString()} Ugx{' '}
            <span className="text-red-500">15% OFF</span>
          </p>
          <p className="text-sm text-gray-500 mb-4 line-through dark:text-gray-400">
            Original Price: {calculatedOriginalPrice.toLocaleString()} Ugx
          </p>

          <label className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200">
            Shoe Size:
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {shoeSizes.map((sizeOption) => (
              <div
                key={sizeOption.size}
                onClick={() => setSelectedSize(sizeOption.size)}
                className={`border rounded px-4 py-2 cursor-pointer transition-colors ${
                  selectedSize === sizeOption.size
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {sizeOption.size}
              </div>
            ))}
          </div>

          {!addedToCart ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          ) : (
            <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded dark:bg-green-700">
              <FaCheck className="mr-2" /> Added to Cart
            </button>
          )}
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
        {currentUser && (
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
              rows={4}
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
}