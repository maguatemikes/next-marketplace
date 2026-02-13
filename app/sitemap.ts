import { MetadataRoute } from "next";

// 1. FRONTEND: Where the users go (Vercel)
const SITE_URL = "https://next-marketplace-eta.vercel.app";

// 2. BACKEND: Where the data lives (WordPress/Kinsta)
const API_BASE_URL = "https://shoplocal.kinsta.cloud";

interface Product {
  slug: string;
  modified?: string;
}

interface Vendor {
  slug: string;
  modified?: string;
  id: number;
}

/**
 * Fetches 500 vendors using 100 per page logic
 */
async function getAllVendors(): Promise<Vendor[]> {
  let allVendors: Vendor[] = [];
  let currentPage = 1;
  let hasMore = true;
  const perPage = 100; // Keep this at 100 as per API rules

  try {
    while (hasMore) {
      const res = await fetch(
        `${API_BASE_URL}/wp-json/geodir/v2/places?per_page=${perPage}&page=${currentPage}`,
        {
          next: { revalidate: 3600 },
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!res.ok) {
        hasMore = false;
        break;
      }

      const data = await res.json();
      const vendors = Array.isArray(data) ? data : data?.places || [];

      if (vendors.length > 0) {
        allVendors = [...allVendors, ...vendors];

        // LOGIC: Stop after fetching page 5 (500 items total)
        if (currentPage >= 5) {
          hasMore = false;
        } else if (vendors.length === perPage) {
          currentPage++;
        } else {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }
    console.log(`✅ Sitemap: Fetched ${allVendors.length} vendors total.`);
    return allVendors;
  } catch (error) {
    console.error("Sitemap: Error fetching vendors", error);
    return allVendors;
  }
}

/**
 * Fetches products from Headless WordPress API
 */
async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/wp-json/custom-api/v1/products?per_page=500`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) return [];
    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (data?.products && Array.isArray(data.products)) return data.products;

    return [];
  } catch (error) {
    console.error("Sitemap: Error fetching products", error);
    return [];
  }
}

/**
 * Next.js 15 Sitemap Generator
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productsData, vendorsData] = await Promise.all([
    getAllProducts(),
    getAllVendors(),
  ]);

  const products = Array.isArray(productsData) ? productsData : [];
  const vendors = Array.isArray(vendorsData) ? vendorsData : [];

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/vendors`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/sell`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/help`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/deals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // 2. Dynamic Product Pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: product.modified ? new Date(product.modified) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Dynamic Vendor Pages
  const vendorPages: MetadataRoute.Sitemap = vendors.map((vendor) => ({
    url: `${SITE_URL}/vendors/${vendor.id}`,
    lastModified: vendor.modified ? new Date(vendor.modified) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...vendorPages];
}
