// app/product/[id]/page.tsx
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '../../types/types';
import { notFound } from 'next/navigation';

interface ProductDetailsProps {
  params: { id: string };
}

const ProductDetails = async ({ params }: ProductDetailsProps) => {
  const product = await getProduct(params.id);

  if (!product) {
    notFound(); // Redirects to 404 if product not found
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
        <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover mb-4" />
        <p className="text-lg mb-2">{product.description}</p>
        <p className="text-xl font-semibold">{product.price} Ugx</p>
      </div>
    </div>
  );
};

// Helper function to fetch the product by ID
const getProduct = async (id: string): Promise<Product | null> => {
  const productRef = doc(db, 'products', id);
  const productDoc = await getDoc(productRef);

  if (!productDoc.exists()) {
    return null;
  }

  return { id: productDoc.id, ...productDoc.data() } as Product;
};

export default ProductDetails;
