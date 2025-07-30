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
        source: '/api/orders/:path*',
        destination: 'http://localhost:3001/api/orders/:path*',
      },
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:3001/api/products/:path*',
      },
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:3001/api/auth/:path*',
      },
      {
        source: '/api/payments/:path*',
        destination: 'http://localhost:3001/api/payments/:path*',
      },
      {
        source: '/api/support/:path*',
        destination: 'http://localhost:3001/api/support/:path*',
      },
      {
        source: '/api/forecasting/:path*',
        destination: 'http://localhost:3001/api/forecasting/:path*',
      },
      {
        source: '/api/privacy/:path*',
        destination: 'http://localhost:3001/api/privacy/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:3001/api/users/:path*',
      },
      {
        source: '/api/currency/:path*',
        destination: 'http://localhost:3001/api/currency/:path*',
      },
      {
        source: '/api/reviews/:path*',
        destination: 'http://localhost:3001/api/reviews/:path*',
      },
      {
        source: '/api/analytics/:path*',
        destination: 'http://localhost:3001/api/analytics/:path*',
      },
      {
        source: '/api/marketing/:path*',
        destination: 'http://localhost:3001/api/marketing/:path*',
      },
    ];
  },
};

export default nextConfig;
