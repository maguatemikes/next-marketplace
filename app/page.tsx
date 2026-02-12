// Next.js 15 Server Component - Etsy-style Homepage with Bento Grid
import {
  Heart,
  ShoppingCart,
  Star,
  ShoppingBag,
  Package,
  Shirt,
  Wrench,
  Baby,
  Gift,
  Laptop,
  Home,
  Sparkles,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BrandCarousel from "@/components/home-comp/BrandCarousel";

// TypeScript interfaces
interface Product {
  id: string | number;
  name: string;
  slug: string;
  price: string | number;
  image?: string;
  externalImage?: string;
  featured_img?: string;
  raw_data?: {
    imageUrl?: string;
  };
  rating?: number;
  vendor?: string;
}

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface Brand {
  name: string;
  slug: string;
}

// Server-side data fetching functions
async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/products?per_page=100",
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
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
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(
      "https://shoplocal.kinsta.cloud/wp-json/wp/v2/product_cat?per_page=100",
      {
        next: { revalidate: 3600 }, // Revalidate every hour
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
      count: cat.count || 0,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function fetchBrands(): Promise<Brand[]> {
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
}

// Helper to get product image
function getProductImage(product: Product): string {
  return (
    product?.image?.trim?.() ||
    product?.externalImage?.trim?.() ||
    product?.featured_img?.trim?.() ||
    product?.raw_data?.imageUrl?.trim?.() ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
  );
}

const fetchCategoryImage = async () => {
  const res = await fetch(
    "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/categories/",
  );
  const data = await res.json();
  return data;
};

export default async function Homepage() {
  // Fetch all data in parallel on the server
  const [products, categories, brands] = await Promise.all([
    fetchFeaturedProducts(),
    fetchCategories(),
    fetchBrands(),
  ]);

  // Slice products for different sections
  const bestProducts = products.slice(0, 10);
  const editorsPicks = products.slice(10, 14);
  const trendingProducts = products.slice(14, 20);
  const giftProducts = products.slice(20, 25);
  const featuredBrands = brands.slice(0, 8);
  const standardCategories = await fetchCategoryImage();
  const showFirstFiveCategory = standardCategories.slice(0, 6);

  // Category icons mapping
  const categoryIcons: { [key: string]: any } = {
    "Amazon FBA Supplies": ShoppingBag,
    "Apparel / Clothing": Shirt,
    "Art & Supplies": Sparkles,
    Automotive: Wrench,
    "Baby Items": Baby,
    "Business Services": Briefcase,
    "Computer Products": Laptop,
    Electronics: Laptop,
    Gifts: Gift,
    "Housewares / Home": Home,
  };

  // Default category list with icons
  const defaultCategories = [
    { name: "Amazon FBA Supplies", slug: "amazon-fba", icon: ShoppingBag },
    { name: "Apparel / Clothing", slug: "apparel", icon: Shirt },
    { name: "Art & Supplies", slug: "art-supplies", icon: Sparkles },
    { name: "Automotive", slug: "automotive", icon: Wrench },
    { name: "Baby Items", slug: "baby", icon: Baby },
    { name: "Business Services", slug: "business", icon: Briefcase },
    { name: "Computer Products", slug: "computers", icon: Laptop },
    { name: "Electronics", slug: "electronics", icon: Laptop },
    { name: "Gifts", slug: "gifts", icon: Gift },
    { name: "Housewares / Home", slug: "housewares", icon: Home },
    { name: "General Merchandise", slug: "general", icon: Package },
    { name: "Fashion Accessories", slug: "fashion", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Bento Grid Hero Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Who are we? - LCP */}
            <Link
              href="/products?page=1&search=new+balance"
              aria-label="View New Balance Shoes"
              className="md:row-span-2 bg-[#6B7280] rounded-3xl overflow-hidden cursor-pointer group relative h-150"
            >
              <div className="absolute inset-0">
                <Image
                  src="/hero-images/new-balance.jpg"
                  alt="New Balance Shoes"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/40"></div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              href="/products?page=1&search=logitech"
              className="bg-[#8B9BA8] rounded-3xl overflow-hidden cursor-pointer group relative h-[292px]"
              aria-label="view logitech headphones"
            >
              <div className="absolute inset-0">
                <Image
                  src="/hero-images/logictech.jpg"
                  alt="An image of logitech graphics for headphones"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link
              href="/products?page=1&search=new+era"
              className="bg-[#8B7D7B] rounded-3xl overflow-hidden cursor-pointer group relative h-[292px]"
              aria-label="browser our new era caps"
            >
              <div className="absolute inset-0">
                <Image
                  src="/hero-images/caps.avif"
                  alt="new era caps"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </Link>

            {/* Card 4 */}
            <Link
              href="/product/search"
              className="lg:col-span-2 lg:col-start-2 bg-gradient-to-br from-[#FFF4E6] to-[#FFE8D6] rounded-3xl overflow-hidden cursor-pointer group h-[292px]"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="flex-1 flex items-center justify-center relative">
                  <Image
                    src="/hero-images/apple-watch.webp"
                    alt="apple watch series"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    loading="lazy"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Brand Partners Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl text-gray-900">Our Brand Partners</h2>
            <Link
              href="/product/search"
              className="text-gray-900 underline hover:text-gray-700"
            >
              View all brands
            </Link>
          </div>
          <BrandCarousel brands={featuredBrands} />
        </div>
      </section>

      {/* Discover our best of since 2018 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-8">
            Discover our best of since 2018
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {bestProducts.length > 0 ? (
              bestProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-white mb-3 relative">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name || "Product"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      loading="lazy"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <h3 className="text-sm text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-sm font-medium text-gray-900">
                    ${product.price}
                  </p>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products available
              </p>
            )}
          </div>
        </div>
      </section>

      {/* top Picks */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl text-gray-900">Top Picks</h2>
            <Link
              href="/product/search"
              className="text-gray-900 underline hover:text-gray-700"
            >
              See more
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {editorsPicks.length > 0 ? (
              editorsPicks.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-white mb-3 relative shadow-sm">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name || "Product"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                    <div className="absolute top-3 left-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md">
                      Best Pick
                    </div>
                  </div>
                  <h3 className="text-sm text-gray-900 mb-1 line-clamp-2 font-medium">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {product.vendor || "ShopLocal"}
                  </p>

                  <p className="text-base font-medium text-gray-900">
                    ${product.price}
                  </p>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products available
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Wholesale Products Categories - NEW SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl text-gray-900 mb-2">
              BerlinsMarket: Your Wholesale Product
            </h2>
            <p className="text-3xl md:text-4xl text-gray-900">
              Source Across All Major Categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.length > 0
              ? categories.slice(0, 24).map((category) => {
                  const IconComponent = categoryIcons[category.name] || Package;
                  return (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      className="group flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 mb-0.5 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          +{category.count > 0 ? category.count : "120k"}{" "}
                          products
                        </p>
                      </div>
                    </Link>
                  );
                })
              : defaultCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Link
                      key={category.slug}
                      href={`/product/search?category=${category.slug}`}
                      className="group flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 mb-0.5 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500">+120k products</p>
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl text-gray-900">Trending Now</h2>
            <Link
              href="/product/search"
              className="text-gray-900 underline hover:text-gray-700"
            >
              Explore all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingProducts.length > 0 ? (
              trendingProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-white mb-3 relative">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name || "Product"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-white text-gray-900 text-xs rounded-md font-medium">
                      Trending
                    </div>
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <h3 className="text-sm text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-900">
                    ${product.price}
                  </p>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No trending products
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Gift Ideas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-8">Gift Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "For Her",
                subtitle: "Thoughtful gifts she'll love",
                image:
                  "https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=400&h=500&fit=crop",
              },
              {
                title: "For Him",
                subtitle: "Gifts that make an impression",
                image:
                  "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=500&fit=crop",
              },
              {
                title: "For Kids",
                subtitle: "Fun and creative finds",
                image:
                  "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=500&fit=crop",
              },
              {
                title: "For Home",
                subtitle: "Make any space special",
                image:
                  "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=500&fit=crop",
              },
            ].map((gift, idx) => (
              <Link
                key={idx}
                href="/product/search"
                className="group relative rounded-2xl overflow-hidden h-80"
              >
                <Image
                  src={gift.image}
                  alt={gift.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-xl font-medium mb-1">{gift.title}</h3>
                  <p className="text-sm text-white/90">{gift.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* More to explore */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-8">More to explore</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {giftProducts.length > 0 ? (
              giftProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-white mb-3 relative shadow-sm">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name || "Product"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      loading="lazy"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                      <ShoppingCart className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <h3 className="text-sm text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-1">
                    {product.rating && (
                      <>
                        <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                        <span className="text-xs text-gray-700">
                          {product.rating}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${product.price}
                  </p>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products available
              </p>
            )}
          </div>
        </div>
      </section>

      {/* What is ShopLocal? */}
      <section className="py-20 bg-[#d2ffcc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-2">
              Welcome to BerlinsMarket
            </h2>
            <p className="text-sm text-gray-700">
              <Link href="/about" className="underline hover:text-gray-900">
                Learn more about our story
              </Link>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Wholesale Marketplace
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                BerlinsMarket connects resellers and retailers with verified
                wholesale suppliers across 120+ categories. Access authentic
                products at true wholesale prices with transparent pricing and
                bulk order capabilities.{" "}
                <Link href="/about" className="underline hover:text-gray-900">
                  Discover how we verify suppliers
                </Link>
              </p>
            </div>

            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Built for Resellers
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Whether you're an Amazon FBA seller, eBay reseller, or
                brick-and-mortar retailer, our platform offers volume discounts,
                dropshipping options, and white-label opportunities to help grow
                your business.
              </p>
            </div>

            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Verified Suppliers
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Every supplier on BerlinsMarket is verified for authenticity and
                reliability. We ensure competitive pricing, quality products,
                and professional service for every wholesale transaction.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-base text-gray-900 mb-6">
              Ready to start sourcing wholesale products for your business?
            </p>
            <Link
              href="/help"
              className="inline-block px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors font-medium"
            >
              Visit Our Help Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
