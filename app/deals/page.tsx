"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Clock,
  TrendingUp,
  Tag,
  Sparkles,
  Star,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock product data
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: {
    name: string;
    slug: string;
  };
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: "1",
    name: "Handcrafted Leather Wallet",
    slug: "handcrafted-leather-wallet",
    price: 45.99,
    originalPrice: 65.99,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    vendor: { name: "Leather Craft Co", slug: "leather-craft-co" },
    rating: 4.8,
    reviews: 124,
    category: "Accessories",
    inStock: true,
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-tshirt",
    price: 24.99,
    originalPrice: 34.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    vendor: { name: "Eco Threads", slug: "eco-threads" },
    rating: 4.6,
    reviews: 89,
    category: "Clothing",
    inStock: true,
  },
  {
    id: "3",
    name: "Ceramic Coffee Mug Set",
    slug: "ceramic-coffee-mug-set",
    price: 32.99,
    originalPrice: 45.99,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    vendor: { name: "Pottery Studio", slug: "pottery-studio" },
    rating: 4.9,
    reviews: 156,
    category: "Home & Kitchen",
    inStock: true,
  },
  {
    id: "4",
    name: "Natural Soy Candles",
    slug: "natural-soy-candles",
    price: 18.99,
    originalPrice: 26.99,
    image:
      "https://images.unsplash.com/photo-1602874801006-c0c1441d0dd9?w=800&q=80",
    vendor: { name: "Aromatics Co", slug: "aromatics-co" },
    rating: 4.7,
    reviews: 203,
    category: "Home Decor",
    inStock: true,
  },
  {
    id: "5",
    name: "Vintage Denim Jacket",
    slug: "vintage-denim-jacket",
    price: 68.99,
    originalPrice: 95.99,
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    vendor: { name: "Retro Finds", slug: "retro-finds" },
    rating: 4.5,
    reviews: 67,
    category: "Clothing",
    inStock: true,
  },
  {
    id: "6",
    name: "Artisan Soap Collection",
    slug: "artisan-soap-collection",
    price: 28.99,
    originalPrice: 39.99,
    image:
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80",
    vendor: { name: "Pure Essentials", slug: "pure-essentials" },
    rating: 4.8,
    reviews: 142,
    category: "Beauty",
    inStock: true,
  },
  {
    id: "7",
    name: "Bamboo Cutting Board",
    slug: "bamboo-cutting-board",
    price: 35.99,
    originalPrice: 49.99,
    image:
      "https://images.unsplash.com/photo-1593198245308-c8aef2ed7d0f?w=800&q=80",
    vendor: { name: "Kitchen Essentials", slug: "kitchen-essentials" },
    rating: 4.9,
    reviews: 178,
    category: "Home & Kitchen",
    inStock: true,
  },
  {
    id: "8",
    name: "Macrame Wall Hanging",
    slug: "macrame-wall-hanging",
    price: 42.99,
    originalPrice: 59.99,
    image:
      "https://images.unsplash.com/photo-1595815771614-fbd9c0a0de28?w=800&q=80",
    vendor: { name: "Crafted Decor", slug: "crafted-decor" },
    rating: 4.7,
    reviews: 95,
    category: "Home Decor",
    inStock: true,
  },
];

// ProductCard Component
function ProductCard({
  product,
  discount,
}: {
  product: Product;
  discount?: string;
}) {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gray-900/10 hover:border-gray-300 transition-all duration-300">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative h-64 overflow-hidden bg-gray-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {discount && (
          <Badge className="absolute top-4 left-4 z-10 bg-red-600 text-white rounded-lg">
            {discount}
          </Badge>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Vendor */}
        <Link
          href={`/store-front/${product.vendor.slug}`}
          className="flex items-center gap-2 mb-3 group/vendor"
        >
          <Store className="w-4 h-4 text-gray-400 group-hover/vendor:text-green-600 transition-colors" />
          <span className="text-sm text-gray-600 group-hover/vendor:text-green-600 transition-colors">
            {product.vendor.name}
          </span>
        </Link>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg text-gray-950 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-none text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl text-gray-950">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>

        {/* Actions */}
        <Button
          asChild
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md h-10 text-sm shadow-sm hover:shadow-md transition-all"
          disabled={!product.inStock}
        >
          <Link href={`/products/${product.slug}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
}

// Main Page Component
export default function DealsPromotions() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock deals data
  const flashDeals = products.slice(0, 4);
  const trendingDeals = products.slice(4, 8);
  const newDeals = products.slice(2, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-4xl">Deals & Promotions</h1>
            <Sparkles className="w-8 h-8" />
          </div>
          <p className="text-xl text-green-100">
            Save big on your favorite products from local vendors
          </p>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="py-8 bg-gradient-to-r from-orange-50 to-red-50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 rounded-full p-3">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl text-gray-950 mb-1">Flash Sale!</h2>
                <p className="text-gray-600">
                  Limited time offers - Don&apos;t miss out!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-600">Ends in:</span>
              </div>
              <div className="flex gap-2">
                <div className="bg-white rounded-lg p-3 min-w-[60px] text-center border border-orange-200">
                  <div className="text-2xl text-gray-950">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
                <div className="bg-white rounded-lg p-3 min-w-[60px] text-center border border-orange-200">
                  <div className="text-2xl text-gray-950">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-500">Mins</div>
                </div>
                <div className="bg-white rounded-lg p-3 min-w-[60px] text-center border border-orange-200">
                  <div className="text-2xl text-gray-950">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-500">Secs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Banner Deals */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deal 1 */}
            <Link
              href="/products"
              className="relative bg-gradient-to-br from-green-600 to-green-700 rounded-2xl overflow-hidden group block"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="relative p-8 text-white">
                <Badge className="bg-yellow-400 text-yellow-900 mb-4 rounded-lg">
                  Up to 50% OFF
                </Badge>
                <h3 className="text-3xl mb-2">Eco-Friendly Collection</h3>
                <p className="text-green-100 mb-6">
                  Sustainable products for a better tomorrow
                </p>
                <div className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg group-hover:bg-green-50 transition-colors">
                  Shop Now →
                </div>
              </div>
            </Link>

            {/* Deal 2 */}
            <Link
              href="/products"
              className="relative bg-gradient-to-br from-green-700 to-green-800 rounded-2xl overflow-hidden group block"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="relative p-8 text-white">
                <Badge className="bg-yellow-400 text-yellow-900 mb-4 rounded-lg">
                  Buy 2 Get 1 FREE
                </Badge>
                <h3 className="text-3xl mb-2">Handmade Crafts</h3>
                <p className="text-green-100 mb-6">
                  Unique artisan pieces from local creators
                </p>
                <div className="inline-block bg-white text-green-700 px-6 py-2 rounded-lg group-hover:bg-green-50 transition-colors">
                  Shop Now →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Deals Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="flash" className="space-y-8">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="flash" className="rounded-lg">
                <Zap className="w-4 h-4 mr-2" />
                Flash Deals
              </TabsTrigger>
              <TabsTrigger value="trending" className="rounded-lg">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="new" className="rounded-lg">
                <Tag className="w-4 h-4 mr-2" />
                New Deals
              </TabsTrigger>
            </TabsList>

            {/* Flash Deals */}
            <TabsContent value="flash">
              <div className="mb-6">
                <h2 className="text-2xl text-gray-950 mb-2">Flash Deals</h2>
                <p className="text-gray-500">
                  Limited time offers expiring soon
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {flashDeals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    discount="-30%"
                  />
                ))}
              </div>
            </TabsContent>

            {/* Trending Deals */}
            <TabsContent value="trending">
              <div className="mb-6">
                <h2 className="text-2xl text-gray-950 mb-2">Trending Deals</h2>
                <p className="text-gray-500">Most popular deals right now</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingDeals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    discount="-25%"
                  />
                ))}
              </div>
            </TabsContent>

            {/* New Deals */}
            <TabsContent value="new">
              <div className="mb-6">
                <h2 className="text-2xl text-gray-950 mb-2">New Deals</h2>
                <p className="text-gray-500">Fresh offers added today</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newDeals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    discount="-20%"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl text-gray-950 mb-4">Never Miss a Deal</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to get exclusive deals and early access to sales
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
