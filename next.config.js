/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co", "lh3.googleusercontent.com", "res.cloudinary.com"],
    unoptimized: true,
  },
};

module.exports = nextConfig
