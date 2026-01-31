import {
  ArrowRight,
  Sparkles,
  Palette,
  Leaf,
  Pencil,
  Zap,
  ShoppingBag,
  CheckCircle,
  Shield,
  Building2,
  Package,
  Award,
  Smartphone,
  Store,
  Crown,
  Search,
  ShoppingCart,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { MarketplaceFilters } from "@/components/h/MarketplaceFilters";

import { HeroSection } from "@/components/h/HeroSection";

// Import mock data (or fetch from API)

// Server-side data fetching
async function getNewProducts() {
  try {
    // Fetch from WooCommerce API
    const response = await fetch(
      "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/products?page=1&per_page=8",
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.mapped || [];
  } catch (error) {
    console.error("❌ Failed to fetch WooCommerce products:", error);
    // Return empty array on error
    return [];
  }
}

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } =
  {
    Palette,
    Leaf,
    Pencil,
    Zap,
  };

export default async function Homepage() {
  // Fetch products on the server
  const newProducts = await getNewProducts();

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Dual Positioning Strategy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-4">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-900">
                Hybrid Hyperlocal & National Platform
              </span>
            </div>
            <h2 className="text-4xl tracking-tight text-gray-900 mb-4">
              One Catalog, Two Delivery Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse a unified catalog where products are sourced either from
              neighborhood stores for instant 15–40 minute delivery, or from
              national warehouses for 1–3 day shipping. You choose speed, we
              deliver quality.
            </p>
          </div>

          {/* Dual Value Props */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Shop National */}
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-400/15 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-4">
                  National Shipping (1–3 Days)
                </h3>
                <p className="text-gray-700 mb-6">
                  Browse a wider selection from national brands and regional
                  warehouses. Predictive AI optimizes inventory placement for
                  faster fulfillment. Traditional logistics with reliable 1–3
                  day delivery nationwide.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <span className="font-semibold">1–3 day delivery</span>{" "}
                      via traditional logistics
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <span className="font-semibold">Wider selection</span>{" "}
                      from national brands
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <span className="font-semibold">AI-driven</span> regional
                      inventory allocation
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <span className="font-semibold">Competitive pricing</span>{" "}
                      at scale
                    </span>
                  </li>
                </ul>
                <Link
                  href="/products"
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 group-hover:scale-105"
                >
                  Shop National Brands
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Shop Local */}
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-8 overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-pink-400/15 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-4">
                  Hyperlocal Instant (15–40 Min)
                </h3>
                <p className="text-gray-700 mb-6">
                  Get products instantly from neighborhood sellers within 1–5 km
                  radius. Real-time tracking with geofencing, eco-friendly
                  delivery via bicycle or EV, supporting your local economy
                  while getting what you need fast.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <span className="font-semibold">
                        15–40 minute delivery
                      </span>{" "}
                      from local stores
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <span className="font-semibold">Real-time tracking</span>{" "}
                      with geofencing
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <span className="font-semibold">Eco-friendly</span>{" "}
                      delivery (bike/EV)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <span className="font-semibold">Support local</span> small
                      businesses
                    </span>
                  </li>
                </ul>
                <Link
                  href="/vendors"
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 group-hover:scale-105"
                >
                  Find Local Sellers Near You
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Benefits Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-gray-900 mb-2">Real-Time Tracking</h4>
              <p className="text-sm text-gray-600">
                Live order visibility with geofencing for hyperlocal deliveries
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-gray-900 mb-2">Eco-Friendly</h4>
              <p className="text-sm text-gray-600">
                Shorter routes reduce carbon footprint—bicycle and EV delivery
                options
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-gray-900 mb-2">Unified Catalog</h4>
              <p className="text-sm text-gray-600">
                Browse one platform—choose your delivery speed and seller type
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Promotional Banners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-8 relative z-10">
                <div className="mb-3">
                  <span className="text-white/90 text-sm tracking-wide uppercase">
                    UP TO 20% OFF
                  </span>
                </div>
                <h3 className="text-white text-2xl mb-6 leading-tight">
                  Get The Latest
                  <br />
                  Products From
                  <br />
                  Top Sellers
                </h3>
                <Link
                  href="/products"
                  className="bg-white text-gray-900 px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors inline-block"
                >
                  SEE ALL
                </Link>
              </div>
              <Package className="absolute bottom-4 right-4 w-32 h-32 text-white/20" />
            </div>

            <div className="relative bg-gradient-to-br from-green-600 to-green-700 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-8 relative z-10">
                <div className="mb-3">
                  <span className="text-white/90 text-sm tracking-wide uppercase">
                    TRUSTED SELLERS
                  </span>
                </div>
                <h3 className="text-white text-2xl mb-6 leading-tight">
                  Quality
                  <br />
                  Affordable
                  <br />
                  Products
                </h3>
                <Link
                  href="/vendors"
                  className="bg-white text-gray-900 px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors inline-block"
                >
                  SEE ALL
                </Link>
              </div>
              <Award className="absolute bottom-4 right-4 w-32 h-32 text-white/20" />
            </div>

            <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-8 relative z-10">
                <div className="mb-3">
                  <span className="text-white/90 text-sm tracking-wide uppercase">
                    COMING SOON!
                  </span>
                </div>
                <h3 className="text-white text-2xl mb-6 leading-tight">
                  ShopLocal
                  <br />
                  Mobile App
                </h3>
                <Link
                  href="/about"
                  className="bg-white text-gray-900 px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors inline-block"
                >
                  SEE ALL
                </Link>
              </div>
              <Smartphone className="absolute bottom-4 right-4 w-32 h-32 text-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Exclusive Brands */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-900">
                Exclusive Partnerships
              </span>
            </div>
            <h2 className="text-4xl tracking-tight text-gray-900 mb-3">
              Premium Brands You Trust
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shop exclusive collections from top brands partnered with
              ShopLocal for quality you can count on
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Leaf,
                label: "Eco-Friendly",
                description: "Sustainable Products",
                stats: "EcoWear & More",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Palette,
                label: "Handmade Artisan",
                description: "Crafted with Care",
                stats: "Artisan Collection",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Pencil,
                label: "Custom & Personalized",
                description: "Your Design, Our Craft",
                stats: "PrintPro Partners",
                color: "from-teal-500 to-cyan-500",
              },
              {
                icon: Sparkles,
                label: "Premium Brands",
                description: "Tech, Beauty & More",
                stats: "TechLife & NaturalGlow",
                color: "from-amber-500 to-orange-500",
              },
            ].map((brand, index) => {
              const Icon = brand.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 hover:shadow-2xl cursor-pointer border border-gray-200 hover:border-transparent overflow-hidden transition-all"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                  />
                  <div className="relative mb-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${brand.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="relative">
                    <h3 className="text-gray-900 mb-1">{brand.label}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {brand.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
                      <span className="text-xs text-gray-600">
                        {brand.stats}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all group shadow-lg hover:shadow-xl"
            >
              Explore All Brands
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Shop Local Marketplace */}

      {/* 6. Top Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl tracking-tight text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-600">Find exactly what youre looking for</p>
          </div>

          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = iconMap[category.iconName];
              return (
                <Link
                  key={category.name}
                  href="/products"
                  className="group bg-white rounded-2xl p-8 text-center hover:shadow-lg hover:shadow-gray-100/50 border border-gray-100 hover:border-gray-200 transition-all"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {Icon && <Icon className="w-8 h-8 text-green-600" />}
                    </div>
                  </div>
                  <h3 className="text-gray-900 group-hover:text-green-500 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div> */}
        </div>
      </section>

      {/* 7. Marketplace & Community */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl tracking-tight text-gray-900 mb-3">
              Marketplace & Community
            </h2>
            <p className="text-gray-600">
              Explore our diverse collection of products and services
            </p>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors group shadow-lg"
            >
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. New Arrivals */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl tracking-tight text-gray-900 mb-3">
                New Arrivals
              </h2>
              <p className="text-gray-600">
                Latest products from our marketplace sellers
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.length > 0 ? (
              newProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewProduct={(slug: string) => `/product/${slug}`}
                  onViewVendor={(slug: string) => `/vendor/${slug}`}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No products available at the moment
                </p>
              </div>
            )}
          </div> */}
        </div>
      </section>

      {/* Remaining sections... */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-emerald-50/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-6">
            <ArrowRight className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-4xl tracking-tight text-gray-900 mb-4">
            Are You a Local Seller or Brand?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get visibility alongside premium brands and reach customers who
            value quality and community. Featured placements, local badges, and
            more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sell"
              className="group px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all inline-flex items-center justify-center gap-2"
            >
              Start Selling Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl border-2 border-gray-200 transition-all inline-block text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
