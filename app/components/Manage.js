"use client";
import React, { useEffect, useState } from "react";
import { db, storage } from "../lib/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Sparkles, Package, Award, Edit, Trash, Image, Plus, Save, X, Star } from "lucide-react";

const Manage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: 0,
    description: '',
    colors: '',
    sizes: '',
    imageUrl: '',
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    achievements: 0,
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Real-time products fetch from Firestore
  useEffect(() => {
    const productsCollection = collection(db, "products");
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Ensure price is always a number
        price: Number(doc.data().price) || 0
      }));
      
      setProducts(productList);
      
      // Update stats with proper number calculations
      setStats({
        totalProducts: productList.length,
        totalValue: productList.reduce((sum, product) => sum + product.price, 0),
        achievements: Math.floor(productList.length / 5),
      });
      
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  // Handle deletion of products
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      showSuccessMessage("Product deleted successfully! -5 XP");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      price: Number(product.price) // Ensure price is a number when editing
    });
    setOpenEdit(true);
  };

  // Handle new product dialog open
  const handleNewProductOpen = () => {
    setNewProduct({
      title: '',
      price: 0,
      description: '',
      colors: '',
      sizes: '',
      imageUrl: '',
    });
    setNewImage(null);
    setOpenNew(true);
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct((prevProduct) => ({
        ...prevProduct,
        [name]: name === 'price' ? Number(value) : value,
      }));
    } else {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [name]: name === 'price' ? Number(value) : value,
      }));
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // Show success message with timeout
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Handle saving product updates
  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      setLoading(true);
      let updatedImageUrl = editingProduct.imageUrl;

      // Upload new image if one is selected
      if (newImage) {
        const imageRef = ref(storage, `products/${editingProduct.id}`);
        await uploadBytes(imageRef, newImage);
        updatedImageUrl = await getDownloadURL(imageRef);
      }

      // Update product details in Firestore
      const productDocRef = doc(db, "products", editingProduct.id);
      await updateDoc(productDocRef, {
        title: editingProduct.title,
        price: Number(editingProduct.price), // Ensure price is stored as number
        description: editingProduct.description,
        colors: editingProduct.colors,
        sizes: editingProduct.sizes,
        imageUrl: updatedImageUrl,
      });

      setOpenEdit(false);
      setNewImage(null);
      setEditingProduct(null);
      setLoading(false);
      showSuccessMessage("Product updated successfully! +10 XP");
    } catch (error) {
      console.error("Error updating product:", error);
      setLoading(false);
    }
  };

  // Handle saving new product
  const handleNewProductSave = async () => {
    try {
      setLoading(true);
      let newImageUrl = '';

      if (newImage) {
        const imageRef = ref(storage, `products/${new Date().getTime()}_${newProduct.title}`);
        await uploadBytes(imageRef, newImage);
        newImageUrl = await getDownloadURL(imageRef);
      }

      const newProductDoc = {
        ...newProduct,
        price: Number(newProduct.price), // Ensure price is stored as number
        imageUrl: newImageUrl,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "products"), newProductDoc);
      setOpenNew(false);
      setNewImage(null);
      setLoading(false);
      showSuccessMessage("New product added successfully! +20 XP");
    } catch (error) {
      console.error("Error adding new product:", error);
      setLoading(false);
    }
  };

  // Handle cancel button click for dialogs
  const handleCancel = () => {
    setOpenEdit(false);
    setOpenNew(false);
    setNewImage(null);
    setEditingProduct(null);
  };

  // Calculate level based on number of products
  const level = Math.max(1, Math.floor(stats.totalProducts / 3));
  
  // Calculate progress to next level
  const progressToNextLevel = ((stats.totalProducts % 3) / 3) * 100;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header with level progress */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Manager Dashboard</h1>
            <p className="opacity-80">Manage your inventory, earn rewards, and level up!</p>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-2">
              <Star className="mr-2 text-yellow-300" />
              <span className="text-xl font-bold">Level {level}</span>
            </div>
            <div className="w-32">
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-yellow-300 h-2 rounded-full" 
                  style={{ width: `${progressToNextLevel}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1">{Math.floor(progressToNextLevel)}% to Level {level + 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success message notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded-md shadow-lg animate-bounce z-50">
          {successMessage}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-blue-600">TOTAL PRODUCTS</h3>
          </div>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500 mr-2" />
            <span className="text-3xl font-bold">{stats.totalProducts}</span>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-purple-600">TOTAL INVENTORY VALUE</h3>
          </div>
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-purple-500 mr-2" />
            <span className="text-3xl font-bold">UGX {stats.totalValue.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-amber-600">ACHIEVEMENTS</h3>
          </div>
          <div className="flex items-center">
            <Award className="h-8 w-8 text-amber-500 mr-2" />
            <span className="text-3xl font-bold">{stats.achievements}</span>
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Products</h2>
        <button 
          onClick={handleNewProductOpen} 
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-md flex items-center transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
          <div className="mt-6">
            <button 
              onClick={handleNewProductOpen}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center mx-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video bg-gray-100 relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start pb-2">
                  <h3 className="text-xl font-semibold line-clamp-1">{product.title}</h3>
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    UGX {product.price.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {product.colors.split(',').map((color, index) => (
                      <span key={index} className="border border-gray-200 text-xs px-2 py-1 rounded-full">
                        {color.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    Sizes: {product.sizes}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded-md flex items-center text-sm"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-md flex items-center text-sm"
                  >
                    <Trash className="h-4 w-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {openEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Product Title</label>
                <input
                  type="text"
                  name="title"
                  value={editingProduct?.title || ''}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Price (UGX)</label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct?.price || ''}
                  onChange={handleInputChange}
                  placeholder="Enter product price"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea
                  name="description"
                  value={editingProduct?.description || ''}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Colors (comma separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={editingProduct?.colors || ''}
                  onChange={handleInputChange}
                  placeholder="Red, Blue, Green"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sizes (comma separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={editingProduct?.sizes || ''}
                  onChange={handleInputChange}
                  placeholder="S, M, L, XL"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {newImage ? (
                <p className="text-sm text-green-600">New image selected: {newImage.name}</p>
              ) : (
                editingProduct?.imageUrl && (
                  <div className="flex items-center">
                    <img
                      src={editingProduct.imageUrl}
                      alt={editingProduct.title}
                      className="w-16 h-16 object-cover rounded mr-2"
                    />
                    <span className="text-sm text-gray-500">Current image</span>
                  </div>
                )
              )}
              <div className="flex space-x-2 pt-2">
                <button 
                  onClick={handleSave} 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </button>
                <button 
                  onClick={handleCancel} 
                  className="border border-gray-300 px-4 py-2 rounded-md flex items-center"
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Product Modal */}
      {openNew && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Product Title</label>
                <input
                  type="text"
                  name="title"
                  value={newProduct.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Price (UGX)</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="Enter product price"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Colors (comma separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={newProduct.colors}
                  onChange={handleInputChange}
                  placeholder="Red, Blue, Green"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sizes (comma separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={newProduct.sizes}
                  onChange={handleInputChange}
                  placeholder="S, M, L, XL"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {newImage && <p className="text-sm text-green-600">Image selected: {newImage.name}</p>}
              <div className="flex space-x-2 pt-2">
                <button 
                  onClick={handleNewProductSave} 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </button>
                <button 
                  onClick={handleCancel} 
                  className="border border-gray-300 px-4 py-2 rounded-md flex items-center"
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage;