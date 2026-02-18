import { Suspense } from "react";
import { SearchInputClient } from "@/components/vendor-components/SearchInputClient";
import { CategorySelectClient } from "@/components/vendor-components/CategorySelectClient";
import { LocationSelectClient } from "@/components/vendor-components/LocationSelectClient";
import { OpenNowToggleClient } from "@/components/vendor-components/OpenNowToggleClient";
import { ClearFiltersClient } from "@/components/vendor-components/ClearFiltersClient";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type ViewMode = "grid" | "map";

interface FilterSectionProps {
  viewMode: ViewMode;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Server-side fetch for categories
async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      "https://shoplocal.kinsta.cloud/wp-json/geodir/v2/places/categories",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Async server component that fetches categories
async function CategorySelectServer({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const categories = await fetchCategories();
  return <CategorySelectClient id={id} label={label} categories={categories} />;
}

// Skeleton for category select
function CategorySelectSkeleton({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// FilterSection is NOT async - renders immediately
export function FilterSection({ viewMode }: FilterSectionProps) {
  // Vertical layout for grid view
  if (viewMode === "grid") {
    return (
      <div className="sticky top-8 bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        </div>

        {/* Search - Renders immediately ✅ */}
        <SearchInputClient id="search" label="Search" />

        {/* Category Filter - Wrapped in Suspense ⏳ */}
        <Suspense fallback={<CategorySelectSkeleton label="Category" />}>
          <CategorySelectServer id="category" label="Category" />
        </Suspense>

        {/* City Filter - Renders immediately ✅ */}
        <LocationSelectClient id="city" label="City" />

        {/* Open Now Toggle - Renders immediately ✅ */}
        <OpenNowToggleClient id="open-now" label="Open Now" />

        {/* Clear Filters Button - Renders immediately ✅ */}
        <ClearFiltersClient
          variant="outline"
          className="w-full h-10 font-medium"
        />
      </div>
    );
  }

  // Horizontal layout for map view
  return (
    <div className="sticky top-0 z-10 bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        {/* Search - Renders immediately ✅ */}
        <div className="flex-1 min-w-50">
          <SearchInputClient id="search-h" label="Search" />
        </div>

        {/* Category Filter - Wrapped in Suspense ⏳ */}
        <div className="min-w-40">
          <Suspense fallback={<CategorySelectSkeleton label="Category" />}>
            <CategorySelectServer id="category-h" label="Category" />
          </Suspense>
        </div>

        {/* City Filter - Renders immediately ✅ */}
        <div className="min-w-40">
          <LocationSelectClient id="city-h" label="City" />
        </div>

        {/* Open Now Toggle - Renders immediately ✅ */}
        <div className="flex items-center gap-2 pb-2">
          <OpenNowToggleClient id="open-now-h" label="Open Now" />
        </div>

        {/* Clear Filters Button - Renders immediately ✅ */}
        <ClearFiltersClient
          variant="outline"
          size="sm"
          className="font-medium"
        />
      </div>
    </div>
  );
}
