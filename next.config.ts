import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Development optimizations to prevent build issues
  experimental: {
    // Improve build stability
    optimizePackageImports: ['@heroicons/react'],
  },
  
  // Webpack configuration for better development experience
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Improve hot reloading stability
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
