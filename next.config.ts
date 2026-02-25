import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows any HTTPS domain (Next.js 14/15)
      },
      {
        protocol: "http",
        hostname: "**", // This allows any HTTP domain
      },
    ],
  },
};

export default nextConfig;
