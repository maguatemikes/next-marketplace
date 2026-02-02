"use client";

import { useState } from "react";
import { ShoppingCart, Phone, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "./nav/SearchBar";
import { MobileMenuButton } from "./nav/MobileMenuButton";
import { CartDrawer } from "./CartDrawer";
import { useCartItemCount } from "@/store/useCartStore";

export function Navigation() {
  const [cartOpen, setCartOpen] = useState(false); // <- control the drawer
  const itemCount = useCartItemCount();

  const mainNavLinks = [
    { label: "Shop", path: "/products" },
    { label: "Vendors", path: "/vendors" },
    { label: "Deals", path: "/deals" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Become a Seller", path: "/sell" },
    { label: "Help", path: "/help" },
    { label: "About", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/berlin-logo.png"
                alt="Berlin logo"
                width={100}
                height={200}
              />
            </Link>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar />
            </div>

            <div className="hidden md:flex items-center gap-6">
              {/* Cart Button - now opens drawer */}
              <button
                onClick={() => setCartOpen(true)}
                className="flex flex-col items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {itemCount}
                </span>
                <span className="text-xs">Checkout</span>
              </button>

              {/* Contact Us */}
              <Link
                href="/contact"
                className="flex flex-col items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="text-xs">Contact Us</span>
              </Link>
            </div>

            <div className="flex items-center justify-end md:justify-between ml-8">
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm">Login</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-[#F57C00] hover:bg-[#E67000] text-white rounded-md transition-colors text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
              <div className="md:hidden">
                <MobileMenuButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#272621] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            {mainNavLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="flex items-center gap-1 px-4 py-3 text-white hover:bg-green-500/5 transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-500 text-white text-center py-2">
        <p className="text-sm">
          <span className="font-semibold">Free Shipping</span> on Orders over
          $50 | <span className="font-semibold">Support Local Sellers</span>
        </p>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </nav>
  );
}
