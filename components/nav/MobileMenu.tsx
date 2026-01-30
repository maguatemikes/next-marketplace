"use client";

import { ShoppingCart, Phone, LogIn } from "lucide-react";
import { SearchBar } from "./SearchBar";

/**
 * MobileMenu Component
 * Mobile slide-down menu with navigation and actions
 * Client Component - contains SearchBar which uses useState
 */
interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const mainNavLinks = [
    { label: "Shop Local", path: "/products" },
    { label: "Vendors", path: "/vendors" },
    { label: "Deals", path: "/deals" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Become a Seller", path: "/sell" },
    { label: "Help", path: "/help" },
    { label: "About", path: "/about" },
  ];

  return (
    <div className="md:hidden absolute top-full left-0 right-0 border-b border-gray-200 bg-white w-full shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto z-50">
      <div className="px-4 py-4 space-y-3">
        {/* Mobile Search Bar */}
        <SearchBar isMobile />

        {/* Mobile Navigation Links */}
        <div className="space-y-1">
          {mainNavLinks.map((link) => (
            <button
              key={link.path}
              onClick={onClose}
              className="flex items-center justify-between w-full px-4 py-3 rounded-md text-sm text-gray-900 hover:bg-gray-50"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
          {/* Login Button */}
          <button
            onClick={onClose}
            className="flex flex-col items-center gap-1 p-3 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-xs">Login</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onClose}
            className="flex flex-col items-center gap-1 p-3 text-gray-700 hover:bg-gray-50 rounded-md relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              3
            </span>
            <span className="text-xs">Checkout</span>
          </button>

          {/* Contact Button */}
          <button
            onClick={onClose}
            className="flex flex-col items-center gap-1 p-3 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            <Phone className="w-5 h-5" />
            <span className="text-xs">Contact</span>
          </button>
        </div>

        {/* Sign Up Button (Mobile) */}
        <div className="pt-3">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-[#F57C00] hover:bg-[#E67000] text-white rounded-md transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
