const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  
  webpack: (config, { dev, isServer }) => {
    // Completely ignore backend directory
    config.module.rules.push({
      test: /backend[/\\]/,
      loader: 'ignore-loader'
    });
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    return config;
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://labubu-collectibles.onrender.com'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;