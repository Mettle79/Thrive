/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: '', // Add your base path if needed
  assetPrefix: '', // Add your asset prefix if needed
}

module.exports = nextConfig 