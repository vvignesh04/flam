/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    return config;
  },
};

module.exports = nextConfig;

