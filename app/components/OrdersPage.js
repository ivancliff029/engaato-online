"use client";

import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { Package, CheckCircle, XCircle, User, CreditCard, Loader, RefreshCw, Search } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const db = getFirestore();
      const ordersCollection = collection(db, "transactions");
      const snapshot = await getDocs(ordersCollection);

      const ordersData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          transactionId: String(doc.id),
          customer: {
            name: data.customer?.name || "Unknown Customer",
            email: data.customer?.email || "No email provided",
          },
          status: data.status?.toLowerCase() || "unknown",
          amount: Number(data.amount) || 0,
          currency: data.currency || "UGX",
          date: data.date || new Date().toISOString(),
          products: Array.isArray(data.products) 
            ? data.products.map(p => ({
                id: String(p.id),
                title: p.title || "Unknown Product",
                price: Number(p.price) || 0,
                quantity: Number(p.quantity) || 1
              }))
            : [],
          paymentMethod: data.paymentMethod || "Unknown"
        };
      });

      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchTermLower = searchTerm.toLowerCase();
    const orderId = String(order.transactionId || "").toLowerCase();
    const customerName = String(order.customer?.name || "").toLowerCase();
    const customerEmail = String(order.customer?.email || "").toLowerCase();

    const matchesSearch = 
      orderId.includes(searchTermLower) ||
      customerName.includes(searchTermLower) ||
      customerEmail.includes(searchTermLower);
    
    const matchesStatus = 
      statusFilter === "all" || 
      order.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle className="h-8 w-8 text-red-500" />
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={fetchOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-600 mt-2">
            View and manage all customer orders in one place
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by ID, name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg mb-2">
          <div className="text-sm font-medium text-blue-800">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {format(new Date(), "dd MMM yyyy, hh:mm a")}
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {orders.length === 0 ? "No orders yet" : "No matching orders found"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {orders.length === 0 
              ? "When customers place orders, they'll appear here."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.transactionId} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      order.status === "successful" 
                        ? "bg-green-100 text-green-600" 
                        : order.status === "pending"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-red-100 text-red-600"
                    }`}>
                      {order.status === "successful" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800">Order #{order.transactionId}</h2>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.date), "dd MMM yyyy, hh:mm a")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {order.amount.toLocaleString()} {order.currency}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer
                    </h3>
                    <div>
                      <p className="font-medium text-gray-800">{order.customer.name}</p>
                      <p className="text-sm text-gray-600">{order.customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment
                    </h3>
                    <div>
                      <p className="font-medium text-gray-800 capitalize">
                        {order.status}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Products ({order.products.length})
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {order.products.slice(0, 3).map((product) => (
                        <span key={product.id} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {product.title}
                        </span>
                      ))}
                      {order.products.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          +{order.products.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex justify-end">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;