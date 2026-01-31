"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductDetailCtaProps {
  product: {
    id: string | number;
    stock?: number;
    isAffiliate?: boolean; // ✅ correct spelling
    externalUrl?: string;
  };
}

const ProductDetailCta = ({ product }: ProductDetailCtaProps) => {
  const isOutOfStock =
    !product.isAffiliate && (!product.stock || product.stock <= 0);

  return (
    <Button
      size="lg"
      className="flex-1 bg-[#F57C00] hover:bg-[#E67000] rounded-xl"
      disabled={isOutOfStock}
      onClick={() => {
        if (product.isAffiliate && product.externalUrl) {
          window.open(product.externalUrl, "_blank"); // redirect to affiliate site
        } else {
          // normal add to cart logic
          console.log("Add to Cart clicked", product.id);
        }
      }}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {product.isAffiliate
        ? "Buy Now"
        : product.stock && product.stock > 0
          ? "Add to Cart"
          : "Out of Stock"}
    </Button>
  );
};

export default ProductDetailCta;
