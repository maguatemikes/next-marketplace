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
      {
        protocol: "https",
        hostname: "dyson-h.assetsadobe2.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.designerbrands.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nb.scene7.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pisces.bbystatic.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
