/**
 * Zustand Cart Store for Next.js ShopLocal App
 * Handles global cart state with localStorage persistence
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartState, DeliveryMethod } from "@/types/cart";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryMethod: "shipping",
      promoCode: "",

      // Add item to cart (or update quantity if exists)
      addItem: (newItem) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => String(item.id) === String(newItem.id),
        );

        if (existingItemIndex > -1) {
          // Item exists, update quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
          set({ items: updatedItems });
        } else {
          // New item, add to cart
          set({
            items: [
              ...items,
              {
                ...newItem,
                quantity: newItem.quantity || 1,
                deliveryMethod: newItem.deliveryMethod || get().deliveryMethod,
              },
            ],
          });
        }
      },

      // Remove item from cart
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => String(item.id) !== String(itemId),
          ),
        }));
      },

      // Update item quantity
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            String(item.id) === String(itemId) ? { ...item, quantity } : item,
          ),
        }));
      },

      // Update individual item delivery method
      updateItemDeliveryMethod: (itemId, method) => {
        set((state) => ({
          items: state.items.map((item) =>
            String(item.id) === String(itemId)
              ? { ...item, deliveryMethod: method }
              : item,
          ),
        }));
      },

      // Set global delivery method
      setDeliveryMethod: (method) => {
        set({ deliveryMethod: method });
      },

      // Set promo code
      setPromoCode: (code) => {
        set({ promoCode: code });
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [], promoCode: "" });
      },
    }),
    {
      name: "shoplocal-cart-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist items, deliveryMethod, and promoCode
      partialize: (state) => ({
        items: state.items,
        deliveryMethod: state.deliveryMethod,
        promoCode: state.promoCode,
      }),
    },
  ),
);

/**
 * Selectors for computed values (prevents unnecessary re-renders)
 */

// Get cart subtotal
export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

// Get cart item count
export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((count, item) => count + item.quantity, 0),
  );

// Get shipping cost (free over $500)
export const useCartShipping = () => {
  const subtotal = useCartSubtotal();
  return subtotal > 500 ? 0 : 25;
};

// Get tax (8%)
export const useCartTax = () => {
  const subtotal = useCartSubtotal();
  return subtotal * 0.08;
};

// Get discount (based on promo code)
export const useCartDiscount = () => {
  const promoCode = useCartStore((state) => state.promoCode);
  const subtotal = useCartSubtotal();

  // Mock promo code logic - replace with real API call
  const promos: Record<
    string,
    { type: "percentage" | "fixed"; value: number }
  > = {
    SAVE10: { type: "percentage", value: 10 },
    SAVE20: { type: "fixed", value: 20 },
    FREESHIP: { type: "fixed", value: 25 },
  };

  const promo = promos[promoCode.toUpperCase()];
  if (!promo) return 0;

  if (promo.type === "percentage") {
    return subtotal * (promo.value / 100);
  }
  return promo.value;
};

// Get cart total
export const useCartTotal = () => {
  const subtotal = useCartSubtotal();
  const shipping = useCartShipping();
  const tax = useCartTax();
  const discount = useCartDiscount();

  return subtotal + shipping + tax - discount;
};

// Get full cart summary
export const useCartSummary = () => {
  const subtotal = useCartSubtotal();
  const shipping = useCartShipping();
  const tax = useCartTax();
  const discount = useCartDiscount();
  const total = subtotal + shipping + tax - discount;
  const itemCount = useCartItemCount();

  return {
    subtotal,
    shipping,
    tax,
    discount,
    total,
    itemCount,
  };
};
