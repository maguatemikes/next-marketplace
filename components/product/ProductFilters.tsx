// app/components/product/ProductFilters.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Grid3x3,
  Tag,
  Barcode,
  BadgePercent,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductSearchBar } from "@/components/product/ProductSearchBar";

interface ProductFiltersProps {
  products: any[];
  categories: { name: string; slug: string }[];
  brands: { name: string; slug: string }[];
}

export function ProductFilters({
  products,
  categories,
  brands,
}: ProductFiltersProps) {
  // ✅ Fix hydration: only render after mount
  const [mounted, setMounted] = useState(false);

  // ✅ Client-side filter state
  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    acceptsOffers: false,
    upc: "",
    search: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.acceptsOffers ||
    filters.brand !== "all" ||
    filters.upc !== "" ||
    filters.search !== "";

  // ✅ Handle filter changes
  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Clear all filters
  const handleClearFilters = () => {
    setFilters({
      category: "all",
      brand: "all",
      acceptsOffers: false,
      upc: "",
      search: "",
    });
  };

  // ✅ Client-side filtering (instant, runs in browser)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (
        filters.search &&
        !product.name?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category !== "all") {
        const productCategories =
          product.categories?.map((c: any) => c.slug) || [];
        if (!productCategories.includes(filters.category)) {
          return false;
        }
      }

      // Brand filter
      if (filters.brand !== "all") {
        const productBrands = product.brands?.map((b: any) => b.slug) || [];
        if (!productBrands.includes(filters.brand)) {
          return false;
        }
      }

      // UPC filter
      if (filters.upc && !product.upc?.includes(filters.upc)) {
        return false;
      }

      // Accepts offers filter
      if (filters.acceptsOffers && !product.accepts_offers) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  // ✅ Show loading skeleton until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <>
        {/* Search Bar Skeleton */}
        <section className="border-b border-gray-100 py-6 sticky top-20 z-40 backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Skeleton */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              </aside>

              {/* Grid Skeleton */}
              <div className="flex-1">
                <div className="mb-6">
                  <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl overflow-hidden shadow-sm"
                    >
                      <div className="aspect-square bg-gray-200 animate-pulse" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <section className="border-b border-gray-100 py-6 sticky top-20 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* <ProductSearchBar
            search={filters.search}
            sortBy="newest"
            onSearchChange={(value) => handleFilterChange("search", value)}
          /> */}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-40">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-gray-900" />
                    <h3 className="text-lg text-gray-900">Filters</h3>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm text-gray-900">Search</h4>
                  </div>
                  <Input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="Search products..."
                    className="bg-gray-50 border-0 rounded-lg h-9"
                  />
                </div>

                {/* Category */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Grid3x3 className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm text-gray-900">Category</h4>
                  </div>
                  <Select
                    value={filters.category}
                    onValueChange={(v) => handleFilterChange("category", v)}
                  >
                    <SelectTrigger className="bg-gray-50 border-0 rounded-lg h-9">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm text-gray-900">Brand</h4>
                  </div>
                  <Select
                    value={filters.brand}
                    onValueChange={(v) => handleFilterChange("brand", v)}
                  >
                    <SelectTrigger className="bg-gray-50 border-0 rounded-lg h-9">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map((b) => (
                        <SelectItem key={b.slug} value={b.slug}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* UPC */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Barcode className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm text-gray-900">UPC</h4>
                  </div>
                  <Input
                    type="text"
                    value={filters.upc}
                    onChange={(e) => handleFilterChange("upc", e.target.value)}
                    placeholder="Enter UPC..."
                    className="bg-gray-50 border-0 rounded-lg h-9"
                  />
                </div>

                {/* Accepts Offers */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={filters.acceptsOffers}
                      onCheckedChange={(c) =>
                        handleFilterChange("acceptsOffers", c)
                      }
                    />
                    <div className="flex items-center gap-2">
                      <BadgePercent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        Accepts Offers
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Results count */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                </p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <p className="text-gray-600 mb-4">No products found</p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
