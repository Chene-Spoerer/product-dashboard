import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Optimize images for production
  images: {
    unoptimized: true
  },

  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  }
};

export default nextConfig;
