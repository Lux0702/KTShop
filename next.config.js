/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.ibb.co",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "picsum.photos",
      "via.placeholder.com",
      "placehold.co",
      "logo.com",
    ],
  },
};

module.exports = nextConfig;
