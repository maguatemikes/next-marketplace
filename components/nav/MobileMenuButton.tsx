"use client";

import { useState } from "react";
import { Menu, X, LogIn, ShoppingCart, Phone } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartItemCount } from "@/store/useCartStore";

export function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
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
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:text-gray-900"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-white z-50 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-6 space-y-6">
              {/* User Section */}
              {isAuthenticated && user ? (
                <div className="pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.displayName || user.username}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/account-settings"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pb-6 border-b border-gray-200 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#F57C00] hover:bg-[#E67000] text-white rounded-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-2 pb-6 border-b border-gray-200">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                  </div>
                  {itemCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Phone className="w-5 h-5" />
                  <span>Contact Us</span>
                </Link>
              </div>

              {/* Main Navigation */}
              <nav className="space-y-1">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
