// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['www.google.com','firebasestorage.googleapis.com'], // Allow images from Google
    },
    // other configurations can be added here...
  }
  
  module.exports = nextConfig;
  