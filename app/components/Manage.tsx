"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button"; 
import { db } from "../lib/firebase"; 
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string; 
}

const Manage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products"); // Replace with your collection name
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id)); // Replace with your collection name
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6">
      <Button className="mb-4" onClick={() => alert("Add new product")}>
        <span className="mr-2">+</span> New
      </Button>
      <h2 className="text-2xl font-bold mb-4">Store Products</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-md">
            <div className="flex items-center mb-2 sm:mb-0">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover mr-4 rounded"
                />
              )}
              <div>
                <h3 className="text-xl">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price}</p>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => alert(`Edit product ${product.id}`)} className="bg-blue-500 text-white">
                Edit
              </Button>
              <Button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Manage;
