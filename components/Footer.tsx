import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#272621] border-t border-[#A7A895] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* ============================================
            MAIN FOOTER GRID
            Four-column responsive layout
            ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* ============================================
              COLUMN 1: COMPANY INFO & SOCIAL MEDIA
              ============================================ */}
          <div>
            {/* Company Logo */}
            <div className="mb-4">
              <Image
                src={"/berlin-logo.png"}
                alt="Berlin Housewares - General Store & MarketPlace"
                width={100}
                height={200}
                className="h-10 w-auto"
              />
            </div>

            {/* Company Tagline */}
            <p className="text-sm text-[#D2D0B9] leading-relaxed mb-4">
              Where quality meets community. Premium brands and local sellers
              together.
            </p>

            {/* Hashtag/Slogan */}
            <p className="text-xs text-green-500 mb-6">#ShopLocalWithUs</p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              <button
                className="w-9 h-9 rounded-full bg-[#0F120C] hover:bg-green-500 hover:text-white flex items-center justify-center transition-all text-[#A7A895]"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-[#0F120C] hover:bg-green-500 hover:text-white flex items-center justify-center transition-all text-[#A7A895]"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-[#0F120C] hover:bg-green-500 hover:text-white flex items-center justify-center transition-all text-[#A7A895]"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-[#0F120C] hover:bg-green-500 hover:text-white flex items-center justify-center transition-all text-[#A7A895]"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ============================================
              COLUMN 2: FOR BUYERS
              Customer-facing navigation links
              ============================================ */}
          <div>
            <h3 className="text-sm mb-4 text-white">For Buyers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  Browse Products
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  Find Vendors
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* ============================================
              COLUMN 3: FOR SELLERS
              Vendor-facing navigation links
              ============================================ */}
          <div>
            <h3 className="text-sm mb-4 text-white">For Sellers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/sell"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor-login"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  Vendor Login
                </Link>
              </li>
              <li>
                <Link
                  href="/fees"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  Fees & Commission
                </Link>
              </li>
              <li>
                <Link
                  href="/seller-agreement"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  Seller Agreement
                </Link>
              </li>
            </ul>
          </div>

          {/* ============================================
              COLUMN 4: COMPANY & LEGAL
              About and legal documentation links
              ============================================ */}
          <div>
            <h3 className="text-sm mb-4 text-white">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-[#D2D0B9] hover:text-green-500 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ============================================
            BOTTOM BAR
            Copyright and quick legal links
            ============================================ */}
        <div className="border-t border-[#A7A895] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright Notice */}
          <p className="text-sm text-[#D2D0B9]">
            &copy; 2025 Berlin Housewares. All rights reserved.
          </p>

          {/* Quick Legal Links */}
          <div className="flex gap-6 text-sm text-[#D2D0B9]">
            <Link
              href="/privacy"
              className="hover:text-green-500 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-green-500 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="hover:text-green-500 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
