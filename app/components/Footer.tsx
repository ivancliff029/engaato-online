import React from 'react';
import { FaXing, FaInstagram, FaFacebook, FaSnapchat } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-600">
            <div className="mx-auto w-full max-w-screen-xl">
                <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-5">
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-300 uppercase dark:text-white">Engaato Online</h2>
                        <ul className="text-gray-500 dark:text-white font-medium">
                            <li className="mb-4 flex items-center text-white">
                                <FaInstagram className="w-4 h-4 mr-2" />
                                <span>Engaatoonline</span>
                            </li>
                            <li className="mb-4 flex items-center text-white">
                                <FaFacebook className="w-4 h-4 mr-2" />
                                <span>Engaato Online</span>
                            </li>
                            <li className="mb-4 flex items-center text-white">
                                <FaSnapchat className="w-4 h-4 mr-2" />
                                <span>Engaatoonline</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-300 uppercase dark:text-white">Categories</h2>
                        <ul className="text-gray-500 dark:text-white-400 font-medium">
                            <li className="mb-4 text-white">
                                <a href="#" className="hover:underline">Men's shoes</a>
                            </li>
                            <li className="mb-4 text-white">
                                <a href="#" className="hover:underline">Women's shoes</a>
                            </li>
                            <li className="mb-4 text-white">
                                <a href="#" className="hover:underline">Sandals</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-300 uppercase dark:text-white">Explore</h2>
                        <ul className="text-gray-500 dark:text-white-400 font-medium">
                            <li className="mb-4 text-white">
                                <a href="#" className="hover:underline">Sneaker Care Tips</a>
                            </li>
                            <li className="mb-4 text-white">
                                <a href="#" className="hover:underline">Latest Sneaker Trends</a>
                            </li>
                            <li className="mb-4 text-white">
                                <a href="#" className="hover:underline">Release & Events</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-300 uppercase dark:text-white">Culture</h2>
                        <ul className="text-gray-500 dark:text-white-400 font-medium">
                            <li className="mb-4 text-white">
                                <a href="#" className="hover:underline">Sneaker Customization</a>
                            </li>
                            <li className="mb-4 text-white">
                                <a href="#" className="hover:underline">History of Iconic Brands</a>
                            </li>
                            <li className="mb-4 text-white">
                                <a href="#" className="hover:underline">Influence of Sneakers</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-300 uppercase dark:text-white">Important Links</h2>
                        <ul className="text-gray-500 dark:text-white-400 font-medium">
                            <li className="mb-4 text-white">
                                <a href="/login" className="hover:underline">Login</a>
                            </li>
                            <li className="mb-4 text-white">
                                <a href="/signup" className="hover:underline">Signup</a>
                            </li>
                            <li className="mb-4 text-white">
                                <a href="/contact" className="hover:underline">Contact Us</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="px-4 py-6 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm text-gray-500 dark:text-gray-300 text-center">
                        © 2024 <a href="https://engaato-online.vercel.app/">Engaato Online</a>. All Rights Reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
