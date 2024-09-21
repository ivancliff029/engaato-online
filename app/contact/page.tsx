"use client";
import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { db } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'contacts'), {
        name,
        email,
        subject,
        message,
        timestamp: new Date(),
      });

      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      console.log('Contact information submitted successfully.');
      setSent(true);
    } catch (error) {
      console.error('Error submitting contact information:', error);
    }

    setLoading(false);
  };

  return (
    <>
    <CartProvider>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contact Us</h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            Got a question about our sneakers? Want to share feedback on our latest styles? Need help with sizing or shipping? Reach out and let us know how we can step up your sneaker game!
          </p>
          <form onSubmit={handleSubmit} className="space-y-8">
          <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={6}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className={`flex items-center justify-center py-3 px-5 text-sm font-medium text-white rounded-lg bg-primary-700 shadow-md sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : (
                <>
                  <span className="text-black">Send message</span>
                  <FiSend className="ml-2" />
                </>
              )}
            </button>
            {sent && ( 
              <p className="text-green-500 mt-2">Message sent successfully!</p>
            )}
          </form>
        </div>
      </section>
      </CartProvider>
    </>
  );
};

export default ContactForm;
