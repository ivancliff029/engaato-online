import React from 'react';
import ProductsList from '../components/ProductList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';

const Home = () => {
    return(
        <>
        <CartProvider>
        <Navbar />
        <ProductsList />
        <Footer />
        </CartProvider>
        </>
    );
};

export default Home;