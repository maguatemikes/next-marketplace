import {
  Star,
  Heart,
  Share2,
  MapPin,
  Package,
  ArrowLeft,
  Truck,
  CheckCircle,
  FileText,
  Award,
  Shield,
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
import ProductDetailCta from "@/components/product/ProductDetailCta";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ✅ Component props interface (Next.js 15: params is a Promise)
interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ✅ Related product interface
interface RelatedProduct {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  image: string;
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
  vendor?: string;
  vendorSlug: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  description?: string;
  isNew?: boolean;
  isTrending?: boolean;
  acceptsOffers?: boolean;
  isAffliate?: boolean;
  externalUrl?: string;
  related_products?: RelatedProduct[];
}

// Fetch product from API
const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const res = await fetch(
    `https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/product-short/${slug}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  return data;
};

const fetchRelatedProduct = async (slug: string): Promise<Product> => {
  const res = await fetch(
    `https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/product/${slug}?ghhh`,
    { next: { revalidate: 3600 } },
  );
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

  const vendorName = product.vendor || "trusted sellers";

  const title = `${product.name} | Berlin Houseware`;
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
  const [product, relatedProduct] = await Promise.all([
    fetchProductBySlug(slug),
    fetchRelatedProduct(slug),
  ]);

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
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 relative ">
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover mix-blend-multiply"
          />
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-600">Sold by</span>
            {product.vendor ? (
              <Link
                href={`/store-front/${product.vendorSlug}`}
                className="text-green-500 hover:text-green-600"
              >
                {product.vendor}
              </Link>
            ) : (
              <span className="text-green-500">{product.vendor}</span>
            )}
            <Badge variant="outline">Verified Seller</Badge>
          </div>

          <h1 className="text-4xl text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    product.rating
                      ? i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-none text-gray-300"
                      : "fill-none text-gray-300" // Skeleton stars when no rating
                  }`}
                />
              ))}
            </div>
            {product.rating && (
              <span className="text-gray-600 text-sm">
                {product.rating} ({product.reviewCount || 5} reviews)
              </span>
            )}
          </div>

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
            <ProductDetailCta product={product} />
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
            <AccordionItem
              value="features"
              className="border-b border-gray-200"
            >
              <AccordionTrigger className="flex items-center gap-2 text-gray-900 hover:text-gray-900">
                <Package className="w-5 h-5 text-green-500" />
                <span className="flex-1 text-left">Product Features</span>
              </AccordionTrigger>
              <AccordionContent className="mt-2 text-gray-600">
                <ul className="space-y-2">
                  <li>✓ High-quality materials</li>
                  <li>✓ Lightweight and durable</li>
                  <li>✓ Fast shipping</li>
                  <li>✓ Buyer protection included</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="shipping"
              className="border-b border-gray-200"
            >
              <AccordionTrigger className="flex items-center gap-2 text-gray-900 hover:text-gray-900">
                <Truck className="w-5 h-5 text-green-500" />
                <span className="flex-1 text-left">Shipping & Returns</span>
              </AccordionTrigger>
              <AccordionContent className="mt-2 text-gray-600">
                <p>Free shipping on orders over $50</p>
                <p>30-day return policy</p>
                <p>Ships within 2-3 business days</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-sky-600 data-[state=active]:bg-transparent px-6 py-4"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-sky-600 data-[state=active]:bg-transparent px-6 py-4"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="warranty"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-sky-600 data-[state=active]:bg-transparent px-6 py-4"
            >
              Warranty & Returns
            </TabsTrigger>
            <TabsTrigger
              value="care"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-sky-600 data-[state=active]:bg-transparent px-6 py-4"
            >
              Care Instructions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="py-8">
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                This is a high-quality product designed to meet your needs.
                Crafted with premium materials and attention to detail, it
                offers exceptional performance and durability.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Perfect for everyday use, this product combines functionality
                with style. Whether you&apos;re looking for reliability or
                aesthetics, this item delivers on all fronts.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Backed by our commitment to quality, this product represents
                excellent value and is designed to last for years to come.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900">Electronics</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Brand:</span>
                  <span className="text-gray-900">Premium Brand</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">SKU/UPC:</span>
                  <span className="text-gray-900">SKU123456789</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Stock:</span>
                  <span className="text-gray-900">In Stock</span>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Vendor:</span>
                  <span className="text-gray-900">Local Marketplace</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-gray-900">$99.99</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="text-gray-900">$129.99</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Accepts Offers:</span>
                  <span className="text-gray-900">Yes</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="warranty" className="py-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Warranty Coverage
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-gray-600">
                  <p>
                    This product comes with a comprehensive 1-year manufacturer
                    warranty covering defects in materials and workmanship.
                  </p>
                  <p>
                    The warranty includes free repairs or replacement of
                    defective parts during the warranty period.
                  </p>
                  <p>
                    Please retain your proof of purchase for warranty claims.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-500" />
                  Return Policy
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-gray-600">
                  <p>
                    We offer a 30-day return policy for this product. Items must
                    be returned in original condition with all packaging and
                    accessories.
                  </p>
                  <p>
                    Refunds will be processed within 5-7 business days of
                    receiving the returned item.
                  </p>
                  <p>Please contact customer service to initiate a return.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="care" className="py-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Care & Maintenance
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-gray-600">
                  <p>
                    To ensure longevity and optimal performance, please follow
                    these care instructions:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Clean regularly with a soft, dry cloth</li>
                    <li>Avoid exposure to extreme temperatures or moisture</li>
                    <li>Store in a cool, dry place when not in use</li>
                    <li>
                      Follow manufacturer guidelines for specific maintenance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products Section */}
      <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl text-gray-900 mb-8">More from this Seller</h2>

        <div className="grid grid-cols-4 gap-4">
          {relatedProduct.related_products?.map((rel) => (
            <Link key={rel.id} href={`/products/${rel.slug}`} className="group">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3 relative">
                <Image
                  src={rel.image || "no image"}
                  alt={rel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  unoptimized
                />
              </div>

              <h3 className="text-gray-900 mb-1 group-hover:text-green-500">
                {rel.name}
              </h3>

              <p className="text-gray-600">${rel.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
