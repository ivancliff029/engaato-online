"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button"; 
import { db, storage } from "../lib/firebase"; 
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog"; 

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  colors: string;
  sizes: string;
  imageUrl: string;
}

const Manage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [openEdit, setOpenEdit] = useState(false); 
  const [openNew, setOpenNew] = useState(false); 
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    title: '',
    price: 0,
    description: '',
    colors: '',
    sizes: '',
    imageUrl: '', 
  });

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  // Handle deletion of products
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle edit button click
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct((prevProduct) => ({
        ...prevProduct!,
        [name]: value,
      }));
    } else {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // Handle saving product updates
  const handleSave = async () => {
    if (!editingProduct) return;

    try {
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
        price: editingProduct.price,
        description: editingProduct.description,
        colors: editingProduct.colors,
        sizes: editingProduct.sizes,
        imageUrl: updatedImageUrl,
      });

      // Update product list in the UI
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id ? { ...editingProduct, imageUrl: updatedImageUrl } : product
        )
      );

      setOpenEdit(false); 
      setNewImage(null); 
      setEditingProduct(null); 
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Handle saving new product
  const handleNewProductSave = async () => {
    try {
      let newImageUrl = '';

      if (newImage) {
        const imageRef = ref(storage, `products/${newProduct.title}`);
        await uploadBytes(imageRef, newImage);
        newImageUrl = await getDownloadURL(imageRef);
      }

      const newProductDoc = {
        ...newProduct,
        imageUrl: newImageUrl,
      };

      const docRef = await addDoc(collection(db, "products"), newProductDoc);
      setProducts((prevProducts) => [...prevProducts, { id: docRef.id, ...newProductDoc }]);
      setOpenNew(false); 
      setNewImage(null); 
    } catch (error) {
      console.error("Error adding new product:", error);
    }
  };

  // Handle cancel button click for dialogs
  const handleCancel = () => {
    setOpenEdit(false);
    setOpenNew(false);
    setNewImage(null);
    setEditingProduct(null);
  };

  return (
    <div className="p-6">
      <Button className="mb-4" onClick={handleNewProductOpen}>
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
                  alt={product.title}
                  className="w-16 h-16 object-cover mr-4 rounded"
                />
              )}
              <div>
                <h3 className="text-xl">{product.title}</h3>
                <p className="text-gray-600">Price: {product.price} Ugx</p>
                <p className="text-sm text-gray-500">{product.description}</p>
                <p className="text-sm text-gray-500">Colors: {product.colors}</p>
                <p className="text-sm text-gray-500">Sizes: {product.sizes}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(product)} className="bg-blue-500 text-white">
                Edit
              </Button>
              <Button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={editingProduct?.title || ''}
              onChange={handleInputChange}
              placeholder="Product Title"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="price"
              value={editingProduct?.price || ''}
              onChange={handleInputChange}
              placeholder="Product Price"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <textarea
              name="description"
              value={editingProduct?.description || ''}
              onChange={handleInputChange}
              placeholder="Product Description"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="colors"
              value={editingProduct?.colors || ''}
              onChange={handleInputChange}
              placeholder="Product Colors"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="sizes"
              value={editingProduct?.sizes || ''}
              onChange={handleInputChange}
              placeholder="Product Sizes"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {newImage ? (
              <p>New image selected: {newImage.name}</p>
            ) : (
              editingProduct?.imageUrl && (
                <img
                  src={editingProduct.imageUrl}
                  alt={editingProduct.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )
            )}
            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-green-500 text-white">
                Save
              </Button>
              <Button onClick={handleCancel} className="bg-gray-500 text-white">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Product Dialog */}
      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={newProduct.title}
              onChange={handleInputChange}
              placeholder="Product Title"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="Product Price"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              placeholder="Product Description"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="colors"
              value={newProduct.colors}
              onChange={handleInputChange}
              placeholder="Product Colors"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="sizes"
              value={newProduct.sizes}
              onChange={handleInputChange}
              placeholder="Product Sizes"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {newImage && <p>Image selected: {newImage.name}</p>}
            <div className="flex space-x-2">
              <Button onClick={handleNewProductSave} className="bg-green-500 text-white">
                Add Product
              </Button>
              <Button onClick={handleCancel} className="bg-gray-500 text-white">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Manage;
