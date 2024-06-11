import React from 'react';
import ProductsList from '../components/ProductList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    return(
        <>
        <Navbar />
        <ProductsList />
        <Footer />
        </>
    );
};

export default Home;