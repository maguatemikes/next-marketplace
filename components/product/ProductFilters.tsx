"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductCard } from "@/components/product/ProductCard";

// ✅ FIX: Add Product interface
interface Product {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  vendor?: string | { name: string; slug?: string };
  vendorSlug?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  inStock?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  acceptsOffers?: boolean;
  upc?: string;
}

interface ProductFiltersProps {
  products: Product[]; // ✅ FIX: Changed from [] to Product[]
  categories: { name: string; slug: string }[];
  brands: { name: string; slug: string }[];
  totalFromServer: number;
}

const ITEMS_PER_PAGE = 9;
const SEARCH_DEBOUNCE_MS = 500; // ✅ NEW: Debounce delay

export function ProductFilters({
  products,
  categories,
  brands,
  totalFromServer,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  // ✅ NEW: Separate state for immediate search input (no debounce)
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );

  // ✅ Initialize filters from URL
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    brand: searchParams.get("brand") || "all",
    acceptsOffers: false,
    upc: searchParams.get("upc") || "",
    search: searchParams.get("search") || "",
  });

  // ✅ NEW: Debounced search effect

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.acceptsOffers ||
    filters.brand !== "all" ||
    filters.upc !== "" ||
    filters.search !== "";

  // ✅ FIX: Add proper type for value parameter
  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1

    // ✅ Add/remove filter params in URL
    if (field === "category" && value !== "all") {
      params.set("category", value as string);
    } else if (field === "category") {
      params.delete("category");
    }

    if (field === "brand" && value !== "all") {
      params.set("brand", value as string);
    } else if (field === "brand") {
      params.delete("brand");
    }

    if (field === "search" && value) {
      params.set("search", value as string);
    } else if (field === "search") {
      params.delete("search");
    }

    // UPC is client-side only (not in API)
    if (field === "upc" && value) {
      params.set("upc", value as string);
    } else if (field === "upc") {
      params.delete("upc");
    }

    // Update URL (triggers server component re-render)
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only update filter if search value actually changed
      if (searchInput !== filters.search) {
        handleFilterChange("search", searchInput);
      }
    }, SEARCH_DEBOUNCE_MS);

    // Cleanup: cancel timeout if user types again before delay expires
    return () => clearTimeout(timeoutId);
  }, [searchInput]); // Only re-run when searchInput changes

  const handleClearFilters = () => {
    // ✅ NEW: Also clear searchInput state
    setSearchInput("");

    setFilters({
      category: "all",
      brand: "all",
      acceptsOffers: false,
      upc: "",
      search: "",
    });

    // Clear all params except page
    router.push("?page=1");
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ CHANGE: Only client-side filter for UPC and acceptsOffers
  // (Server already filtered by category, brand, search)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // UPC filter (not supported by API, so filter client-side)
      if (filters.upc && !product.upc?.includes(filters.upc)) {
        return false;
      }

      // Accepts Offers filter (not supported by API)
      if (filters.acceptsOffers && !product.acceptsOffers) {
        return false;
      }

      return true;
    });
  }, [products, filters.upc, filters.acceptsOffers]);

  // ✅ Pagination calculations (unchanged)
  const totalPages = Math.ceil(totalFromServer / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + filteredProducts.length;
  const paginatedProducts = filteredProducts;

  const getPageNumbers = () => {
    const pages: (number | string)[] = []; // ✅ FIX: Add type annotation
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "ellipsis",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages,
        );
      }
    }

    return pages;
  };

  return (
    <>
      {/* Search Bar */}
      <section className="border-b border-gray-100 py-6 sticky top-20 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Optional: ProductSearchBar component */}
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

                {/* Search - ✅ CHANGED: Now uses searchInput state with debounce */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm text-gray-900">Search</h4>
                  </div>
                  <Input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search products..."
                    className="bg-gray-50 border-0 rounded-lg h-9"
                  />
                  {/* ✅ NEW: Optional loading indicator */}
                  {searchInput !== filters.search && searchInput !== "" && (
                    <p className="text-xs text-gray-500 mt-1">Searching...</p>
                  )}
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
                        handleFilterChange("acceptsOffers", c as boolean)
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
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{endIndex} of {totalFromServer}{" "}
                  products
                </p>
                {totalPages > 1 && (
                  <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </p>
                )}
              </div>

              {filteredProducts.length > 0 ? (
                <>
                  {/* Product Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              handlePageChange(Math.max(1, currentPage - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {getPageNumbers().map((page, index) => (
                          <PaginationItem key={index}>
                            {page === "ellipsis" ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                onClick={() => handlePageChange(page as number)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              handlePageChange(
                                Math.min(totalPages, currentPage + 1),
                              )
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
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
