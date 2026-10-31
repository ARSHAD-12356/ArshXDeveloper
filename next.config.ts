import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Add external hosts here if your project media lives on a CDN.
    remotePatterns: [],
  },
};

export default nextConfig;
