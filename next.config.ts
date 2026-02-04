import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shoplocal.kinsta.cloud",
        port: "",
        pathname: "/**", // Allow all paths (wp-content, images, etc.)
      },
      {
        protocol: "https",
        hostname: "feeds.frgimages.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "resource.logitech.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
