/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@fit/shared'],
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
