import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Package,
  ArrowLeft,
  Truck,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

// ✅ Component props interface (Next.js 15: params is a Promise)
interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ✅ Product data interface
interface Product {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image?: string | null;
  externalImage?: string | null;
  featured_img?: string | null;
  raw_data?: {
    imageUrl?: string;
  };
  vendor?: {
    store_name?: string;
    store_slug?: string;
  };
  category?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  description?: string;
  isNew?: boolean;
  isTrending?: boolean;
  acceptsOffers?: boolean;
}

// Fetch product from API
const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const res = await fetch(
    `https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/product/${slug}`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  return data;
};

// ✅ Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params; // ✅ Await params (Next.js 15)
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
      description: "This product does not exist.",
    };
  }

  const imageUrl =
    product?.image?.trim?.() ||
    product?.externalImage?.trim?.() ||
    product?.featured_img?.trim?.() ||
    product?.raw_data?.imageUrl?.trim?.() ||
    "/placeholder.png";

  const vendorName = product.vendor?.store_name || "trusted sellers";

  const title = `${product.name} | ShopLocal`;
  const description =
    product.description?.slice(0, 160) ||
    `Buy ${product.name} at the best price from ${vendorName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://shoplocal.kinsta.cloud/product/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// ✅ Dynamic product page (Server Component)
export default async function ProductDetails({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params; // ✅ Await params (Next.js 15)
  const product = await fetchProductBySlug(slug);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/products"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative">
          <Image
            src={
              product?.image?.trim?.() ||
              product?.externalImage?.trim?.() ||
              product?.featured_img?.trim?.() ||
              product?.raw_data?.imageUrl?.trim?.() ||
              "/placeholder.png"
            }
            alt={product?.name || "Product image"}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-600">Sold by</span>
            {product.vendor?.store_slug ? (
              <Link
                href={`/vendor/${product.vendor.store_slug}`}
                className="text-green-500 hover:text-green-600"
              >
                {product.vendor.store_name || "Unknown Vendor"}
              </Link>
            ) : (
              <span className="text-green-500">
                {product.vendor?.store_name || "Unknown Vendor"}
              </span>
            )}
            <Badge variant="outline">Verified Seller</Badge>
          </div>

          <h1 className="text-4xl text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating!)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-none text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                {product.rating} ({product.reviewCount || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl text-gray-900">${product.price}</span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
            </div>
          </div>

          {/* Stock */}
          <div
            className={`flex items-center gap-2 mb-8 ${
              product.stock && product.stock > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>
              {product.stock && product.stock > 0
                ? "In Stock - Ready to Ship"
                : "Out of stock"}
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex gap-4 mb-8">
            <Button
              size="lg"
              className="flex-1 bg-[#F57C00] hover:bg-[#E67000] rounded-xl"
              disabled={!product.stock || product.stock <= 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock && product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl">
              <Heart className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="features">
              <AccordionTrigger className="text-gray-900 hover:text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500" />
                <span>Product Features</span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ High-quality materials</li>
                  <li>✓ Lightweight and durable</li>
                  <li>✓ Fast shipping</li>
                  <li>✓ Buyer protection included</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger className="text-gray-900 hover:text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-500" />
                <span>Shipping & Returns</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-gray-600">
                  <p>Free shipping on orders over $50</p>
                  <p>30-day return policy</p>
                  <p>Ships within 2-3 business days</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Related Products Section - Placeholder */}
      <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl text-gray-900 mb-8">More from this Seller</h2>
        <div className="text-center py-12 text-gray-500">
          <p>Related products will appear here</p>
        </div>
      </div>
    </div>
  );
}
