// /**
//  * Product Type Definitions
//  *
//  * Type definitions for product data from WooCommerce/Dokan API
//  */

// /**
//  * Vendor Information
//  */
// export interface Vendor {
//   id?: number;
//   name: string;
//   slug?: string;
//   avatar?: string;
//   rating?: number;
// }

// /**
//  * Product Interface
//  *
//  * Represents a product from the WooCommerce/Dokan API
//  */
// export interface Product {
//   id: number;
//   name: string;
//   slug: string;
//   price: number;
//   originalPrice?: number;
//   image: string;
//   images?: string[];
//   category: string;
//   categories?: string[];
//   vendor: string | Vendor;
//   vendorSlug?: string;
//   rating?: number;
//   reviewCount?: number;
//   description?: string;
//   shortDescription?: string;
//   stock?: number;
//   inStock?: boolean;
//   isNew?: boolean;
//   isTrending?: boolean;
//   acceptsOffers?: boolean;
//   attributes?: Record<string, string>;
//   variations?: any[]:;
// }

// /**
//  * Cart Item Interface
//  */
// export interface CartItem {
//   product: Product;
//   quantity: number;
//   variationId?: number;
// }
