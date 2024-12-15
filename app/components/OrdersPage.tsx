"use client";

import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { format } from "date-fns";

interface Order {
  transactionId: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
  };
  status: string;
  date: string;
  products: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const db = getFirestore();
      const ordersCollection = collection(db, "transactions");
      const snapshot = await getDocs(ordersCollection);

      const ordersData: Order[] = snapshot.docs.map((doc) => ({
        transactionId: doc.id,
        ...doc.data(),
      })) as Order[];

      setOrders(ordersData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Customer Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders have been placed yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.transactionId} className="bg-white shadow p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                Order ID: {order.transactionId}
              </h2>
              <p className="text-gray-600">
                <strong>Customer Name:</strong> {order.customer.name}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {order.customer.email}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    order.status === "successful"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {order.status}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Amount:</strong> {order.amount.toLocaleString()} {order.currency}
              </p>
              <p className="text-gray-600">
                <strong>Order Date:</strong>{" "}
                {format(new Date(order.date), "dd MMM yyyy, hh:mm a")}
              </p>
              <div>
                <strong>Products:</strong>
                <ul className="list-disc list-inside mt-2">
                  {order.products.map((product) => (
                    <li key={product.id} className="text-gray-700">
                      {product.title} - {product.quantity} pcs @{" "}
                      {product.price.toLocaleString()} UGX
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
