// app/robots.ts
import { MetadataRoute } from "next";

/**
 * Next.js 15 Robots.ts configuration
 * This tells Google and other bots where your sitemap lives
 * and which pages they are allowed to crawl.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/", // Don't crawl internal API routes
        "/admin/", // Don't crawl admin dashboards
        "/cart/", // Don't crawl the shopping cart
        "/checkout/", // Don't crawl checkout pages
      ],
    },
    // This MUST match your SITE_URL from the sitemap file
    sitemap: "https://next-marketplace-eta.vercel.app",
  };
}
