/**
 * Cart Type Definitions for Next.js ShopLocal App
 */

export type DeliveryMethod = "pickup" | "delivery" | "shipping";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  vendor: string;
  vendorSlug?: string;
  image: string;
  quantity: number;
  deliveryMethod?: DeliveryMethod;
  maxQuantity?: number; // Optional: for stock limits
  sku?: string; // Optional: for product tracking
}

export interface CartState {
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  promoCode: string;

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (itemId: string | number) => void;
  updateQuantity: (itemId: string | number, quantity: number) => void;
  updateItemDeliveryMethod: (
    itemId: string | number,
    method: DeliveryMethod,
  ) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setPromoCode: (code: string) => void;
  clearCart: () => void;

  // Computed values (moved to selectors for better memoization)
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface PromoCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase?: number;
}
