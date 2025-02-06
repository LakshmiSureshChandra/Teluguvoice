/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Add this to change the default port
  server: {
    port: 3001,
  },
}

module.exports = nextConfig