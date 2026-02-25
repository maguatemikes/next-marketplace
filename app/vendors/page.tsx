import { Suspense } from "react";
import { FilterSection } from "@/components/vendor-components/FilterSection";
import { DirectoryHeader } from "@/components/vendor-components/DirectoryHeader";
import { DirectoryContent } from "@/components/vendor-components/DirectoryContent";
import { DirectorySkeleton } from "@/components/vendor-components/DirectorySkeleton";

// Define the shape of your filters based on your URL: ?category=dentists&page=2
interface DirectoryFilters {
  category?: string;
  page?: string;
  location?: string;
  search?: string;
}

interface DirectoryResponse {
  data: any[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

const fetchDirectoryList = async (
  filters: DirectoryFilters,
): Promise<DirectoryResponse> => {
  const query = new URLSearchParams();
  if (filters.category) query.append("category", filters.category);
  if (filters.page) query.append("page", filters.page);
  if (filters.location) query.append("location", filters.location);
  if (filters.search) query.append("search", filters.search);

  const response = await fetch(
    `https://shoplocal.kinsta.cloud/wp-json/custom-api-v3/v1/places${query.toString()}`,
    {
      cache: "force-cache",
      next: { tags: ["listings"], revalidate: 3600 }, // ISR: Cache for 1 hour
    },
  );

  if (!response.ok) throw new Error("Failed to fetch directory");

  const result = await response.json();

  // API returns pagination at root level, restructure to match our interface
  return {
    data: result.data || [],
    pagination: {
      total: result.total || 0,
      totalPages: result.totalPages || 1,
      currentPage: result.currentPage || 1,
      perPage: result.perPage || 9,
    },
  };
};

type ViewMode = "grid" | "map";

export default async function VendorsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    category?: string;
    page?: string;
    location: string;
    search: string;
  }>;
}) {
  // Await the searchParams promise (Next.js 15 requirement)
  const { view, category, page, location, search } = await searchParams;
  const viewMode: ViewMode = view === "map" ? "map" : "grid";

  // Start fetching, but do NOT 'await' here.
  // Passing the raw promise allows Suspense to trigger the Skeleton.
  const listingsPromise = fetchDirectoryList({
    category,
    page,
    location,
    search,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Renders immediately while data fetches */}
      <DirectoryHeader viewMode={viewMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-12 gap-8"
              : "space-y-6"
          }
        >
          <aside className={viewMode === "grid" ? "lg:col-span-3" : ""}>
            <FilterSection viewMode={viewMode} />
          </aside>

          <div className={viewMode === "grid" ? "lg:col-span-9" : ""}>
            {/* The Skeleton shows while listingsPromise is pending */}
            <Suspense
              key={`${category}-${page}`}
              fallback={<DirectorySkeleton />}
            >
              <DirectoryContent viewMode={viewMode} promise={listingsPromise} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
