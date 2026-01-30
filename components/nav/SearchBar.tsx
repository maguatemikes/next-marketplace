"use client";

import { useState } from "react";
import { Search } from "lucide-react";

/**
 * SearchBar Component
 * Reusable search input with icon
 * Client Component - uses useState for search query
 */
interface SearchBarProps {
  isMobile?: boolean;
}

export function SearchBar({ isMobile = false }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Handle search navigation
      console.log("Search:", searchQuery);
      setSearchQuery("");
    }
  };

  if (isMobile) {
    return (
      <div className="relative">
        <input
          type="text"
          placeholder="Search products, vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search products, vendors..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <Search className="w-4 h-4 text-gray-400 hover:text-gray-600" />
      </button>
    </div>
  );
}
