import { ProductFilters } from "@/components/product/ProductFilters";
import type { Metadata } from "next";

const ITEMS_PER_PAGE = 9;

// ✅ Fetch products with filters
const fetchProduct = async (
  page: number = 1,
  filters: {
    category?: string;
    brand?: string;
    search?: string;
    vendor?: string;
  } = {},
) => {
  try {
    // Build query params with filters
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: ITEMS_PER_PAGE.toString(),
    });

    // Add filters to API request
    if (filters.search) params.append("search", filters.search);
    if (filters.category && filters.category !== "all")
      params.append("category", filters.category);
    if (filters.brand && filters.brand !== "all")
      params.append("brand", filters.brand);
    if (filters.vendor && filters.vendor !== "all")
      params.append("vendor", filters.vendor);

    const res = await fetch(
      `https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/products?${params.toString()}`,
      {
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
      },
    );

    if (!res.ok) {
      console.error(`Products API failed: ${res.status}`);
      return { products: [], total: 0 };
    }

    const data = await res.json();
    return {
      products: data.products || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }
};

const fetchCategory = async () => {
  try {
    const res = await fetch(
      "https://shoplocal.kinsta.cloud/wp-json/wp/v2/product_cat?per_page=100",
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/json" },
      },
    );

    if (!res.ok) {
      console.error(`Categories API failed: ${res.status}`);
      return [];
    }

    const data = await res.json();

    return data.map((cat: any) => ({
      name: cat.name,
      slug: cat.slug,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const fetchBrands = async () => {
  try {
    const res = await fetch(
      "https://shoplocal.kinsta.cloud/wp-json/wp/v2/product_brand?per_page=100",
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/json" },
      },
    );

    if (!res.ok) {
      console.error(`Brands API failed: ${res.status}`);
      return [];
    }

    const data = await res.json();

    return data.map((brand: any) => ({
      name: brand.name,
      slug: brand.slug,
    }));
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

// ✅ Generate dynamic metadata for SEO
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    brand?: string;
    search?: string;
    vendor?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Build dynamic title based on filters
  let title = "All Products";
  const titleParts: string[] = [];

  if (params.search) {
    titleParts.push(`Search: ${params.search}`);
  }
  if (params.category && params.category !== "all") {
    titleParts.push(
      params.category.charAt(0).toUpperCase() + params.category.slice(1),
    );
  }
  if (params.brand && params.brand !== "all") {
    titleParts.push(params.brand);
  }
  if (params.vendor && params.vendor !== "all") {
    titleParts.push(`by ${params.vendor}`);
  }

  if (titleParts.length > 0) {
    title = titleParts.join(" - ");
  }

  // Add page number to title if not on first page
  if (currentPage > 1) {
    title += ` - Page ${currentPage}`;
  }

  title += " | ShopLocal";

  // Build dynamic description
  let description =
    "Browse unique products from independent sellers on ShopLocal.";
  if (params.search) {
    description = `Search results for "${params.search}" - Find unique products from trusted sellers.`;
  } else if (params.category && params.category !== "all") {
    description = `Shop ${params.category} products from independent sellers. Quality items at great prices.`;
  }

  // Build canonical URL
  const baseUrl = "https://shoplocal.kinsta.cloud";
  const urlParams = new URLSearchParams();
  if (params.category && params.category !== "all")
    urlParams.append("category", params.category);
  if (params.brand && params.brand !== "all")
    urlParams.append("brand", params.brand);
  if (params.search) urlParams.append("search", params.search);
  if (params.vendor && params.vendor !== "all")
    urlParams.append("vendor", params.vendor);
  if (currentPage > 1) urlParams.append("page", currentPage.toString());

  const canonicalUrl = `${baseUrl}/products${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;

  // Build keywords
  const keywords = [
    "wholesale products",
    "independent sellers",
    "online marketplace",
    "buy wholesale",
    params.category,
    params.brand,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "ShopLocal",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-image-products.jpg`,
          width: 1200,
          height: 630,
          alt: "ShopLocal Products",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@shoplocal",
      creator: "@shoplocal",
      images: [`${baseUrl}/og-image-products.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(currentPage > 1 && {
      other: {
        "pagination-prev": `${baseUrl}/products?${new URLSearchParams({ ...Object.fromEntries(urlParams), page: (currentPage - 1).toString() }).toString()}`,
      },
    }),
  };
}

// ✅ Product Catalog Page Component
export default async function ProductCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    brand?: string;
    search?: string;
    vendor?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Extract filters from URL
  const filters = {
    category: params.category,
    brand: params.brand,
    search: params.search,
    vendor: params.vendor,
  };

  // Pass filters to fetch function
  const [productData, categories, brands] = await Promise.all([
    fetchProduct(currentPage, filters),
    fetchCategory(),
    fetchBrands(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl tracking-tight text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Browse unique products from independent sellers
          </p>
        </div>
      </section>

      <ProductFilters
        products={productData.products}
        totalFromServer={productData.total}
        categories={categories}
        brands={brands}
      />

      {/* CTA Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl tracking-tight text-gray-900 mb-4">
            Want to see your products here?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of sellers reaching wholesale buyers on our platform
          </p>
          <a
            href="/sell"
            className="inline-block px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all"
          >
            Become a Seller
          </a>
        </div>
      </section>
    </div>
  );
}
