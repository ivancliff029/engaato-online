import React from 'react';
import { Instagram, Facebook, Send, ChevronRight, MapPin, Phone, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-2">Join our newsletter</h3>
              <p className="text-gray-400">Stay updated with the latest releases, exclusive deals and styling tips.</p>
            </div>
            <div className="w-full md:w-96">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 p-2 rounded-md transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Engaato Online</h2>
            <p className="text-gray-400 mb-6 max-w-md">Premium quality footwear for everyone. We're passionate about helping you find the perfect fit with the latest styles and trends.</p>
            
            <div className="flex space-x-4 mb-8">
              <a href="https://instagram.com/engaatoonline" className="bg-gray-700 hover:bg-blue-500 p-2 rounded-full transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com/engaatoonline" className="bg-gray-700 hover:bg-blue-500 p-2 rounded-full transition-colors duration-300">
                <Facebook size={20} />
              </a>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin size={18} className="mr-3 text-blue-400" />
                <span>Kampala, Uganda</span>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="mr-3 text-blue-400" />
                <span>+256 766 586 689</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-3 text-blue-400" />
                <span>engaato@gmail.com</span>
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              Categories
              <span className="absolute bottom-0 left-0 w-10 h-1 bg-blue-500 -mb-2"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/category/mens" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Men's Shoes
                </a>
              </li>
              <li>
                <a href="/category/womens" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Women's Shoes
                </a>
              </li>
              <li>
                <a href="/category/sandals" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Sandals
                </a>
              </li>
              <li>
                <a href="/category/sneakers" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Sneakers
                </a>
              </li>
              <li>
                <a href="/category/boots" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Boots
                </a>
              </li>
            </ul>
          </div>
          
          {/* Explore */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              Explore
              <span className="absolute bottom-0 left-0 w-10 h-1 bg-blue-500 -mb-2"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/blog/care-tips" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Sneaker Care Tips
                </a>
              </li>
              <li>
                <a href="/blog/trends" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Latest Trends
                </a>
              </li>
              <li>
                <a href="/events" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Releases & Events
                </a>
              </li>
              <li>
                <a href="/sizing-guide" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Sizing Guide
                </a>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-10 h-1 bg-blue-500 -mb-2"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  FAQ
                </a>
              </li>
              <li>
                <a href="/shipping" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="/returns" className="flex items-center hover:text-blue-400 transition-colors duration-300">
                  <ChevronRight size={16} className="mr-2" />
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {currentYear} <span className="font-medium text-white">Engaato Online</span>. All Rights Reserved.
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm mr-2">Made with</span>
              <Heart size={16} className="text-red-500 mx-1" />
              <span className="text-gray-400 text-sm">in Uganda</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;