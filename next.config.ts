/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // ✅ Ignore TypeScript build errors
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Ignore ESLint errors during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optional: if you deploy under subpath like /bolna/
  basePath: "/bolna",
};

module.exports = nextConfig;
