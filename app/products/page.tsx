import { ProductFilters } from "@/components/product/ProductFilters";

const fetchProduct = async () => {
  try {
    const res = await fetch(
      "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/products",
      {
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
      },
    );

    if (!res.ok) {
      console.error(`Products API failed: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
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
    return data;
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
    return data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export default async function ProductCatalogPage() {
  // ✅ Server fetches all data in parallel (cached)
  const [products, categories, brands] = await Promise.all([
    fetchProduct(),
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

      {/* ✅ Client component handles filtering + rendering */}
      <ProductFilters
        products={products}
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

// ✅ Optional: Add metadata
export const metadata = {
  title: "All Products | ShopLocal",
  description: "Browse unique products from independent sellers",
};
