// Next.js 15 Server Component - Etsy-style Homepage with Bento Grid
import { Heart, ShoppingCart, Star } from "lucide-react";
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
      "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/products?per_page=30",
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
  const categoryShowcase = categories.slice(0, 6);
  const trendingProducts = products.slice(14, 20);
  const giftProducts = products.slice(20, 25);
  const featuredBrands = brands.slice(0, 8);

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

      {/* Jump into featured interests */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-8">
            Jump into featured interests
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categoryShowcase.length > 0
              ? categoryShowcase.map((category, idx) => (
                  <Link
                    key={category.slug}
                    href={`/product/search?category=${category.slug}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2 relative">
                      <Image
                        src={`https://images.unsplash.com/photo-${1515562141207 + idx}?w=300&h=300&fit=crop`}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-sm text-gray-900 text-center">
                      {category.name}
                    </p>
                  </Link>
                ))
              : [
                  {
                    name: "Jewelry",
                    image:
                      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
                  },
                  {
                    name: "Home Decor",
                    image:
                      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=300&fit=crop",
                  },
                  {
                    name: "Art & Prints",
                    image:
                      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=300&h=300&fit=crop",
                  },
                  {
                    name: "Clothing",
                    image:
                      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop",
                  },
                  {
                    name: "Accessories",
                    image:
                      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=300&h=300&fit=crop",
                  },
                  {
                    name: "Craft Supplies",
                    image:
                      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=300&h=300&fit=crop",
                  },
                ].map((interest, idx) => (
                  <Link key={idx} href="/product/search" className="group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2 relative">
                      <Image
                        src={interest.image}
                        alt={interest.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-sm text-gray-900 text-center">
                      {interest.name}
                    </p>
                  </Link>
                ))}
          </div>
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

      {/* Shop by Category - Large Feature */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).length > 0
              ? categories.slice(0, 6).map((category, idx) => (
                  <Link
                    key={category.slug}
                    href={`/product/search?category=${category.slug}`}
                    className="group relative rounded-2xl overflow-hidden h-64"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={`https://images.unsplash.com/photo-${1599643478518 + idx * 1000}?w=600&h=400&fit=crop`}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-xl font-medium mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-white/90">
                        {category.count} items
                      </p>
                    </div>
                  </Link>
                ))
              : [
                  { name: "Jewelry & Accessories", count: "2,345 items" },
                  { name: "Home & Living", count: "5,678 items" },
                  { name: "Art & Collectibles", count: "1,234 items" },
                  { name: "Clothing & Shoes", count: "3,456 items" },
                  { name: "Craft Supplies", count: "4,321 items" },
                  { name: "Electronics & Gadgets", count: "1,987 items" },
                ].map((category, idx) => (
                  <Link
                    key={idx}
                    href="/product/search"
                    className="group relative rounded-2xl overflow-hidden h-64"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={`https://images.unsplash.com/photo-${1599643478518 + idx * 1000}?w=600&h=400&fit=crop`}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-xl font-medium mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-white/90">{category.count}</p>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 bg-white">
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
      <section className="py-16 bg-gray-50">
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
      <section className="py-16 bg-white">
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
              Welcome to Berlin Houseware
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
                Quality Home Essentials
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Berlin Houseware brings premium, durable, and stylish home
                products to your doorstep. From kitchen tools to décor, every
                item is curated for quality and longevity.{" "}
                <Link href="/about" className="underline hover:text-gray-900">
                  Discover our commitment to excellence
                </Link>
              </p>
            </div>

            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Supporting Local Artisans
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Our products are crafted in collaboration with local designers
                and artisans. We ensure each piece is unique, sustainable, and
                adds a touch of Berlin style to your home.
              </p>
            </div>

            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Reliable Service
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Customer satisfaction is our top priority. Enjoy seamless
                shopping, fast delivery, and dedicated support for every
                purchase.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-base text-gray-900 mb-6">
              Have a question about our products or services? We're here to
              help.
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
