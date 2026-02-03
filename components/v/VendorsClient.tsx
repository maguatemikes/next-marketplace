"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VendorsFilters } from "./VendorsFilters";
import { VendorsPagination } from "./VendorsPagination";
import { VendorBusinessCard } from "./VendorBusinessCard";
import { InteractiveBusinessMap } from "./InteractiveBusinessMap";
import { LocationControls } from "./LocationControls";
import { Search, FilterIcon, Map, Loader2 } from "lucide-react";

// Types
export interface Vendor {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  tagline: string;
  bio: string;
  specialty: string;
  categoryId?: number;
  rating: number;
  location: string;
  latitude?: string;
  longitude?: string;
  distance?: number;
  claimed: number;
  socialLinks?: {
    website?: string;
    instagram?: string;
  };
  policies?: {
    shipping: string;
    returns: string;
    faqs: string;
  };
}

interface Place {
  id: number;
  claimed: number;
  title: string | { raw: string; rendered: string };
  content: string | { raw: string; rendered: string };
  default_category?: number;
  post_category?:
    | string
    | { id: number; name: string; slug: string }
    | Array<{ id: number; name: string; slug: string }>;
  region?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  slug?: string;
  rating?: number;
  featured_image?: { src?: string; thumbnail?: string; sizes?: any };
  images?: Array<{ src?: string; thumbnail?: string }>;
  gd_custom_ratings?: number;
  [key: string]: any;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: { src?: string };
}

interface Region {
  id: number;
  name: string;
  slug: string;
}

interface City {
  id: number;
  name: string;
  slug: string;
}

interface LocationPair {
  region: string;
  city: string;
}

interface VendorsClientProps {
  initialPlaces: Place[];
  categories: Category[];
  regions: Region[];
  cities: City[];
  totalPlaces: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

// Helper function to convert Place to Vendor
function placeToVendor(
  place: Place,
  userLocation?: { lat: number; lon: number } | null,
): Vendor {
  let specialty = "General";
  let categoryId: number | undefined;

  if (place.default_category) {
    categoryId = place.default_category;
  }

  if (place.post_category) {
    if (typeof place.post_category === "string") {
      specialty = place.post_category;
    } else if (Array.isArray(place.post_category)) {
      specialty = place.post_category.map((cat) => cat.name).join(", ");
      if (!categoryId && place.post_category.length > 0) {
        categoryId = place.post_category[0].id;
      }
    } else if (typeof place.post_category === "object") {
      specialty = place.post_category.name;
      if (!categoryId) {
        categoryId = place.post_category.id;
      }
    }
  }

  const stripHtml = (html: string | null | undefined) => {
    if (!html || typeof html !== "string") return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const thumbnailUrl =
    place.featured_image?.thumbnail || place.images?.[0]?.thumbnail || "";
  const fullImageUrl =
    place.featured_image?.src || place.images?.[0]?.src || "";

  const logo =
    thumbnailUrl || fullImageUrl || "https://via.placeholder.com/150";
  const banner =
    fullImageUrl || thumbnailUrl || "https://via.placeholder.com/800x300";

  const content = stripHtml(
    typeof place.content === "string" ? place.content : place.content?.rendered,
  );
  const tagline = content.substring(0, 100) || "Quality local business";
  const bio = content || "A trusted local business in your community.";

  const titleString =
    typeof place.title === "string"
      ? place.title
      : place.title?.rendered || "Business";

  let distance: number | undefined;
  if (userLocation && place.latitude && place.longitude) {
    distance = calculateDistance(
      userLocation.lat,
      userLocation.lon,
      parseFloat(place.latitude),
      parseFloat(place.longitude),
    );
  }

  const customRating =
    place.gd_custom_ratings || place.gd_custom_rating || place.rating || 4.5;

  return {
    id: place.id.toString(),
    name: titleString,
    slug:
      place.slug ||
      titleString
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    logo,
    banner,
    tagline,
    bio,
    specialty,
    categoryId,
    rating:
      typeof customRating === "number"
        ? customRating
        : parseFloat(String(customRating)) || 0,
    location:
      place.city && place.region
        ? `${place.city}, ${place.region}`
        : place.city || place.region || "Local",
    latitude: place.latitude,
    longitude: place.longitude,
    distance,
    claimed: place.claimed || 0,
    socialLinks: {
      website: place.website || undefined,
      instagram: place.twitter || undefined,
    },
    policies: {
      shipping:
        place.special_offers ||
        "Please contact us for shipping details and rates.",
      returns:
        "Returns accepted within 30 days. Please contact us for more information.",
      faqs: "For any questions, please reach out to us directly.",
    },
  };
}

// Calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function VendorsClient({
  initialPlaces,
  categories,
  regions,
  cities,
  totalPlaces,
  totalPages,
  currentPage,
  perPage,
}: VendorsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ⭐ Extract URL params once to avoid cascading
  const urlCategory = searchParams.get("category") || "all";
  const urlPage = searchParams.get("page") || "1";

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(urlCategory);
  const [ratingFilter, setRatingFilter] = useState<number[]>([0]);
  const [sortBy, setSortBy] = useState("featured");
  const [showMap, setShowMap] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  // ⭐ Loading state for pagination
  const [isNavigating, setIsNavigating] = useState(false);

  // User location
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // ⭐ Reset loading state when page actually changes
  useEffect(() => {
    setIsNavigating(false);
  }, [currentPage]);

  // ⭐ Sync category filter from URL (only when URL category changes)
  useEffect(() => {
    if (categoryFilter !== urlCategory) {
      setCategoryFilter(urlCategory);
    }
  }, [urlCategory]);

  // When region changes, reset city filter
  useEffect(() => {
    if (regionFilter !== "all") {
      setCityFilter("all");
    }
  }, [regionFilter]);

  // ⭐ Handle category change (SERVER-SIDE navigation)
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setIsNavigating(true);

    const params = new URLSearchParams();
    params.set("page", "1");

    if (value && value !== "all") {
      params.set("category", value);
    }

    // ⭐ Navigate - page is dynamic so it will auto-refresh
    router.push(`/vendors?${params.toString()}`);
  };

  // ⭐ Handle page change (SERVER-SIDE navigation)
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setIsNavigating(true);

      const params = new URLSearchParams();
      params.set("page", page.toString());

      const urlCategory = searchParams.get("category");
      if (urlCategory && urlCategory !== "all") {
        params.set("category", urlCategory);
      }

      // ⭐ Navigate - page is dynamic so it will auto-refresh
      router.push(`/vendors?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ⭐ Clear all filters (navigate to clean state)
  const clearAllFilters = () => {
    setSearchQuery("");
    setRegionFilter("all");
    setCityFilter("all");
    setCategoryFilter("all");
    setRatingFilter([0]);
    setSelectedVendorId(null);
    setIsNavigating(true);
    // ⭐ Navigate - page is dynamic so it will auto-refresh
    router.push("/vendors?page=1");
  };

  // Filter and transform places to vendors
  const filteredAndSortedVendors = useMemo(() => {
    let filtered = initialPlaces;

    // Apply search filter (client-side)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((place) => {
        const title =
          typeof place.title === "string"
            ? place.title
            : place.title?.rendered || "";
        return title.toLowerCase().includes(query);
      });
    }

    // Apply region filter (client-side)
    if (regionFilter && regionFilter !== "all") {
      filtered = filtered.filter((place) => place.region === regionFilter);
    }

    // Apply city filter (client-side)
    if (cityFilter && cityFilter !== "all") {
      filtered = filtered.filter((place) => place.city === cityFilter);
    }

    // ⭐ NOTE: Category filtering is now handled SERVER-SIDE
    // The initialPlaces already contain filtered results from the API
    // No need to filter by category again on the client

    // Convert to vendors
    let vendors = filtered.map((place) => placeToVendor(place, userLocation));

    // Apply rating filter
    vendors = vendors.filter(
      (vendor) => ratingFilter[0] === 0 || vendor.rating >= ratingFilter[0],
    );

    // Apply vendor selection from map
    if (selectedVendorId) {
      vendors = vendors.filter((vendor) => vendor.id === selectedVendorId);
    }

    // Sort vendors
    vendors.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "distance") {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      }
      return 0; // featured
    });

    return vendors;
  }, [
    initialPlaces,
    searchQuery,
    regionFilter,
    cityFilter,
    // categoryFilter removed from dependencies - server handles it
    ratingFilter,
    selectedVendorId,
    sortBy,
    userLocation,
  ]);

  // Paginate vendors (client-side pagination within the server page)
  const paginatedVendors = filteredAndSortedVendors;

  // Compute available cities based on selected region and current page data
  const availableCities = useMemo(() => {
    if (regionFilter === "all") {
      return cities.map((c) => c.name).sort();
    }

    // Filter cities that belong to selected region from initial places
    const citiesInRegion = [
      ...new Set(
        initialPlaces
          .filter((place) => place.region === regionFilter && place.city)
          .map((place) => place.city!),
      ),
    ].sort();

    return citiesInRegion;
  }, [regionFilter, cities, initialPlaces]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl text-gray-950 mb-4 tracking-tight">
              Business Directory
            </h1>
            <p className="text-lg text-gray-600">
              Discover trusted local businesses in your community
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters - Mobile/Tablet View */}
          <div
            className={`mb-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${
              showMap ? "block" : "block lg:hidden"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FilterIcon className="w-5 h-5 text-green-700" />
                </div>
                <h2 className="text-xl text-gray-950">Filter Businesses</h2>
              </div>
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="rounded-lg"
                size="sm"
              >
                Clear Filters
              </Button>
            </div>

            <VendorsFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={handleCategoryChange}
              regionFilter={regionFilter}
              setRegionFilter={setRegionFilter}
              cityFilter={cityFilter}
              setCityFilter={setCityFilter}
              ratingFilter={ratingFilter}
              setRatingFilter={setRatingFilter}
              categories={categories}
              regions={regions}
              availableCities={availableCities}
              layout="grid"
            />
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filter - Desktop Only */}
            {!showMap && (
              <div className="hidden lg:block lg:w-64 flex-shrink-0">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
                  <VendorsFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={handleCategoryChange}
                    regionFilter={regionFilter}
                    setRegionFilter={setRegionFilter}
                    cityFilter={cityFilter}
                    setCityFilter={setCityFilter}
                    ratingFilter={ratingFilter}
                    setRatingFilter={setRatingFilter}
                    categories={categories}
                    regions={regions}
                    availableCities={availableCities}
                    layout="sidebar"
                    onClearFilters={clearAllFilters}
                  />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Top Bar */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl text-gray-950">
                      Business Directory
                    </h2>
                    <p className="text-gray-500">
                      {filteredAndSortedVendors.length} businesses found
                    </p>
                    {selectedVendorId && (
                      <p className="text-sm text-green-500 mt-1">
                        Filtered by map selection
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <LocationControls
                      userLocation={userLocation}
                      setUserLocation={setUserLocation}
                      setSortBy={setSortBy}
                    />

                    <Button
                      variant={showMap ? "default" : "outline"}
                      onClick={() => setShowMap(!showMap)}
                      className={
                        showMap
                          ? "rounded-lg bg-green-600 hover:bg-green-700"
                          : "rounded-lg border-green-600 text-green-600 hover:bg-green-50"
                      }
                    >
                      <Map className="w-4 h-4 mr-2" />
                      {showMap ? "Hide Map" : "Show Map"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Map - Mobile */}
              {showMap && (
                <div className="lg:hidden mb-6">
                  <InteractiveBusinessMap
                    vendors={paginatedVendors}
                    categories={categories}
                    onVendorSelect={(vendorId) => setSelectedVendorId(vendorId)}
                    selectedVendorId={selectedVendorId}
                  />
                </div>
              )}

              {/* Vendor Grid with Map */}
              <div
                className={
                  showMap ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""
                }
              >
                {/* Vendor Cards */}
                <div className="relative">
                  {/* ⭐ Loading Overlay for Cards */}
                  {isNavigating && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-20">
                      <div className="flex flex-col items-center gap-4 bg-white border border-green-200 rounded-2xl px-8 py-6 shadow-lg">
                        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                        <div className="text-center">
                          <p className="text-base font-medium text-gray-900">
                            Loading page {currentPage}...
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Fetching businesses
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  {paginatedVendors.length > 0 && (
                    <div
                      className={
                        showMap
                          ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
                          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      }
                    >
                      {paginatedVendors.map((vendor) => (
                        <VendorBusinessCard key={vendor.id} vendor={vendor} />
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {paginatedVendors.length === 0 && (
                    <div className="text-center py-24">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FilterIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl text-gray-900 mb-2">
                        No businesses found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Try adjusting your search or filters
                      </p>
                      <Button onClick={clearAllFilters} className="rounded-lg">
                        Clear Filters
                      </Button>
                    </div>
                  )}

                  {/* Pagination */}
                  {paginatedVendors.length > 0 && (
                    <div className="mt-12">
                      <VendorsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalPlaces}
                        itemsPerPage={perPage}
                        onPageChange={handlePageChange}
                        isLoading={isNavigating}
                      />
                    </div>
                  )}
                </div>

                {/* Map Column - Desktop */}
                {showMap && (
                  <div className="hidden lg:block">
                    <div className="sticky top-24">
                      <InteractiveBusinessMap
                        vendors={paginatedVendors}
                        categories={categories}
                        onVendorSelect={(vendorId) =>
                          setSelectedVendorId(vendorId)
                        }
                        selectedVendorId={selectedVendorId}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
