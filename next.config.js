/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  
  // Exclude backend directory from Next.js build
  experimental: {
    externalDir: true,
  },
  
  webpack: (config, { isServer }) => {
    // Exclude backend directory from webpack compilation
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Ignore backend files completely
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push(/^backend\//)
    }
    
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