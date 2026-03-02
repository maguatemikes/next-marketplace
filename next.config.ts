import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http", // Add this to allow non-SSL affiliate links
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
