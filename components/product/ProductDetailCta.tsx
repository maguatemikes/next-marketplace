"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer } from "@/components/CartDrawer";

interface ProductDetailCtaProps {
  product: {
    id: string | number;
    name: string;
    price: number;
    image?: string | null;
    externalImage?: string | null;
    featured_img?: string | null;
    raw_data?: {
      imageUrl?: string;
    };
    vendor?: string;
    stock?: number;
    isAffiliate?: boolean;
    externalUrl?: string;
  };
  quantity?: number;
}

const ProductDetailCta = ({ product, quantity = 1 }: ProductDetailCtaProps) => {
  const [cartOpen, setCartOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock =
    !product.isAffiliate && (!product.stock || product.stock <= 0);

  const handleClick = () => {
    if (product.isAffiliate && product.externalUrl) {
      // Affiliate product: redirect to external site
      window.open(product.externalUrl, "_blank");
    } else {
      // WooCommerce product: add to cart

      // Get the best available image
      const productImage =
        product?.image?.trim?.() ||
        product?.externalImage?.trim?.() ||
        product?.featured_img?.trim?.() ||
        product?.raw_data?.imageUrl?.trim?.() ||
        "/placeholder.png";

      // Add to Zustand cart store
      addItem({
        id: product.id as string | number,
        name: product.name,
        price: product.price,
        vendor: product.vendor || "ShopLocal",
        image: productImage,
        quantity: quantity,
      });

      // Open cart drawer
      setCartOpen(true);

      console.log("Add to Cart clicked", product.id);
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="flex-1 bg-[#F57C00] hover:bg-[#E67000] rounded-xl"
        disabled={isOutOfStock}
        onClick={handleClick}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {product.isAffiliate
          ? "Buy Now"
          : product.stock && product.stock > 0
            ? "Add to Cart"
            : "Out of Stock"}
      </Button>

      {/* Cart Drawer - Only shown for WooCommerce products */}
      {!product.isAffiliate && (
        <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      )}
    </>
  );
};

export default ProductDetailCta;
