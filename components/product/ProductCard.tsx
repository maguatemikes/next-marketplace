"use client";
import Image from "next/image";
import { Heart, Tag, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string | number;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image?: string | null;
    externalImage?: string | null;
    vendor?: string | { name?: string };
    category?: string;
    rating?: number;
    reviewCount?: number;
    stock?: number;
    isNew?: boolean;
    isTrending?: boolean;
    acceptsOffers?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // const hasDiscount =
  //   product.originalPrice && product.originalPrice > product.price;
  // const discountPercentage = hasDiscount
  //   ? Math.round(
  //       ((product.originalPrice - product.price) / product.originalPrice) * 100
  //     )
  //   : 0;

  const isLowStock = product.stock !== undefined && product.stock < 20;
  const vendorName =
    typeof product.vendor === "string"
      ? product.vendor
      : product.vendor?.name || "Unknown Vendor";

  const imageUrl = product.image || product.externalImage || null;

  const handleCardClick = () => router.push(`/product/${product.slug}`);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all hover:shadow-xl hover:shadow-gray-100/50 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 w-full">
        {imageUrl ? (
          <Link
            href={`/products/${product.slug}`}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={imageUrl}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover"
              unoptimized // allows external URLs
            />
          </Link>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
            No Image
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-3 right-3 w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-sm z-10 ${
            isWishlisted
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-white/90 text-gray-600 hover:bg-white hover:scale-110"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Top Badges */}
        {/* <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs">
              -{discountPercentage}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-1 bg-green-600 text-white rounded-lg text-xs">
              New
            </span>
          )}
          {product.isTrending && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs flex items-center gap-1">
              <Flame className="w-3 h-3" /> Trending
            </span>
          )}
        </div> */}

        {/* Bottom Badges */}
        <div className="absolute bottom-3 left-3 flex gap-2 z-10">
          {product.acceptsOffers && (
            <span className="px-2.5 py-1 bg-green-600 text-white rounded-lg text-xs flex items-center gap-1">
              <Tag className="w-3 h-3" /> Offers
            </span>
          )}
          {isLowStock && (
            <span className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-xs">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-gray-600 mb-2 uppercase tracking-wide block">
          {vendorName}
        </span>

        <button
          onClick={handleCardClick}
          className="block w-full text-left mb-3 group/title flex-1"
        >
          <h3 className="text-gray-900 group-hover/title:text-green-500 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm text-gray-900">{product.rating || 0}</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">
            {product.reviewCount || 0} reviews
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col gap-1">
            {/* <div className="flex items-center gap-2">
              <span className="text-lg text-gray-900">${product.price}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div> */}
          </div>
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded">
            {product.category || "Uncategorized"}
          </span>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          className="w-full mt-4 bg-[#F57C00] text-white px-4 py-2.5 rounded-md hover:bg-[#E67000] transition-colors text-sm flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
