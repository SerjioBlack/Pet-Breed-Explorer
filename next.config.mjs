/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn2.thedogapi.com', 'cdn2.thecatapi.com'],
  },
};

export default nextConfig;