/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  
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