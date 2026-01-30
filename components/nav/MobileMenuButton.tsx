"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

/**
 * MobileMenuButton Component
 * Toggle button for mobile menu with state management
 * Client Component - uses useState for menu open/close state
 */
export function MobileMenuButton() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <button
        className="p-2 -mr-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {mobileMenuOpen && (
        <MobileMenu onClose={() => setMobileMenuOpen(false)} />
      )}
    </>
  );
}
