import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shoplocal.kinsta.cloud",
        port: "",
        pathname: "/images/**",
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
    ],
  },
};

export default nextConfig;
