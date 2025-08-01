import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Ensure static files are properly served
  trailingSlash: false,
  
  // API rewrites for production
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://labubu-collectibles.onrender.com'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
