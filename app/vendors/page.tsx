import { Suspense } from "react";
import { VendorsClient } from "@/components/v/VendorsClient";
import { config } from "@/lib/config";

// ⭐ Route Segment Config - Make page DYNAMIC to respond to URL changes
export const dynamic = "force-dynamic"; // Always run on the server for each request
export const revalidate = 0; // Disable static generation

// Server Component - Fetches data with PAGINATION
export const metadata = {
  title: "Business Directory - ShopLocal",
  description:
    "Discover trusted local businesses and independent sellers in your community. Browse verified vendors, local services, and unique shops near you on ShopLocal marketplace.",
  keywords:
    "business directory, local businesses, independent sellers, local vendors, community marketplace, local shops, find businesses near me",
  openGraph: {
    title: "Business Directory - ShopLocal",
    description:
      "Discover trusted local businesses and independent sellers in your community.",
    type: "website",
  },
};

// Types
interface Place {
  id: number;
  claimed: number;
  title: string | { raw: string; rendered: string };
  content: string | { raw: string; rendered: string };
  post_tags?: string;
  default_category?: number;
  post_category?:
    | string
    | { id: number; name: string; slug: string }
    | Array<{ id: number; name: string; slug: string }>;
  street?: string;
  country?: string;
  region?: string;
  city?: string;
  zip?: string;
  latitude?: string;
  longitude?: string;
  post_images?: string | null;
  phone?: string;
  email?: string;
  website?: string;
  twitter?: string;
  facebook?: string;
  video?: string;
  special_offers?: string;
  business_hours?: string;
  featured?: number;
  slug?: string;
  type?: string;
  status?: string;
  author?: number;
  post_author?: number;
  date?: string;
  featured_media?: number;
  link?: string;
  rating?: number;
  featured_image?: {
    src?: string;
    thumbnail?: string;
    sizes?: Record<string, unknown>;
  };
  images?: Array<{ src?: string; thumbnail?: string }>;
  acf?: {
    rating?: number;
    custom_rating?: number;
    [key: string]: unknown;
  };
  gd_custom_rating?: number;
  gd_custom_ratings?: number;
  custom_rating?: number;
  gd_rating?: number;
  overall_rating?: number;
  review_rating?: number;
  [key: string]: unknown;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: { src?: string };
  fa_icon?: string;
  fa_icon_color?: string;
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

interface PaginatedPlacesResponse {
  places: Place[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

// API response types
interface CategoryApiResponse {
  id: number;
  name: string;
  slug: string;
  icon?: { src?: string };
  fa_icon?: string;
  fa_icon_color?: string;
}

interface LocationApiResponse {
  id: number;
  name: string;
  slug: string;
}

interface CustomApiPlaceData {
  ID: number;
  rating?: number;
  claimed?: number;
}

interface CustomApiResponse {
  data?: CustomApiPlaceData[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
  perPage?: number;
}

interface UserApiResponse {
  slug?: string;
  [key: string]: unknown;
}

interface UserResult {
  id: number;
  slug: string | null;
}

// Fetch categories from API
async function fetchCategories(): Promise<Category[]> {
  try {
    const url = `${config.api.geodir}/places/categories?per_page=100&hide_empty=false`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "force-cache",
      next: { revalidate: 3600, tags: ["categories"] },
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid API response format");
    }

    return (data as CategoryApiResponse[])
      .filter((cat) => cat.name && cat.name !== "")
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    const error = err as Error;
    console.error("⚠️ Using fallback categories:", error.message);
    return [
      { id: 1, name: "Sportswear", slug: "sportswear" },
      { id: 2, name: "Electronics", slug: "electronics" },
      { id: 3, name: "Fashion", slug: "fashion" },
      { id: 4, name: "Home & Garden", slug: "home-garden" },
      { id: 5, name: "Food & Beverage", slug: "food-beverage" },
    ];
  }
}

// Fetch locations (regions and cities) - LIGHTWEIGHT
async function fetchLocations(): Promise<{
  regions: Region[];
  cities: City[];
}> {
  try {
    let regions: Region[] = [];
    let cities: City[] = [];

    try {
      const regionsUrl = `${config.api.geodir}/places/regions`;
      const regionsResponse = await fetch(regionsUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: { revalidate: 3600, tags: ["regions"] },
      });

      if (regionsResponse.ok) {
        const regionsData: unknown = await regionsResponse.json();
        if (Array.isArray(regionsData)) {
          regions = (regionsData as LocationApiResponse[])
            .filter((region) => region.name && region.name !== "")
            .sort((a, b) => a.name.localeCompare(b.name));
        }
      }
    } catch {
      console.warn("Could not fetch regions");
    }

    try {
      const citiesUrl = `${config.api.geodir}/places/cities`;
      const citiesResponse = await fetch(citiesUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: { revalidate: 3600, tags: ["cities"] },
      });

      if (citiesResponse.ok) {
        const citiesData: unknown = await citiesResponse.json();
        if (Array.isArray(citiesData)) {
          cities = (citiesData as LocationApiResponse[])
            .filter((city) => city.name && city.name !== "")
            .sort((a, b) => a.name.localeCompare(b.name));
        }
      }
    } catch {
      console.warn("Could not fetch cities");
    }

    return { regions, cities };
  } catch (err) {
    const error = err as Error;
    console.error("⚠️ Using fallback locations:", error.message);
    return {
      regions: [
        { id: 1, name: "California", slug: "california" },
        { id: 2, name: "New York", slug: "new-york" },
        { id: 3, name: "Texas", slug: "texas" },
        { id: 4, name: "Florida", slug: "florida" },
      ],
      cities: [],
    };
  }
}

// ⭐ Fetch places with PAGINATION from your custom endpoint
async function fetchPaginatedPlaces(
  page: number = 1,
  perPage: number = 12,
  categoryFilter?: string, // ⭐ NEW: Category filter parameter
): Promise<PaginatedPlacesResponse> {
  try {
    // ⭐ USE CUSTOM API ENDPOINT (or custom-api-test if available)
    // For now, using custom-api since custom-api-test might not be deployed yet
    let url = `${config.api.customApi}/places?page=${page}&per_page=${perPage}`;

    // Add category parameter for server-side filtering
    if (categoryFilter && categoryFilter !== "all") {
      url += `&category=${encodeURIComponent(categoryFilter)}`;
      console.log(
        `🔧 Using Custom API endpoint with category filter: ${categoryFilter}`,
      );
    } else {
      console.log(`🔧 Using Custom API endpoint for all places`);
    }

    console.log(`🌐 Fetching URL: ${url}`);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store", // ⭐ TEMPORARILY disable cache for debugging
    });

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`❌ API error: ${response.status} ${response.statusText}`);
      throw new Error(`API returned status ${response.status}`);
    }

    const result: unknown = await response.json();
    const typedResult = result as CustomApiResponse;

    // ⭐ Custom API Test endpoint returns { data, total, totalPages, currentPage, perPage }
    const placesData = typedResult.data || [];
    const total = typedResult.total || 0;
    const totalPages = typedResult.totalPages || 0;

    console.log(`📦 API Response:`, {
      endpoint: "custom-api",
      total,
      totalPages,
      dataCount: placesData.length,
    });

    if (placesData.length === 0) {
      console.warn(
        `⚠️ No places found for category: ${categoryFilter || "all"}`,
      );
      return {
        places: [],
        total: 0,
        totalPages: 0,
        currentPage: page,
        perPage,
      };
    }

    // ⭐ Get place IDs from the response
    const placeIds = placesData.map((p) => p.ID);

    // Fetch full GeoDirectory data for these specific IDs
    const geodirPromises = placeIds.map(async (id: number) => {
      try {
        const placeResponse = await fetch(`${config.api.geodir}/places/${id}`, {
          headers: { Accept: "application/json" },
          cache: "force-cache", // ⭐ Aggressive caching
          next: {
            revalidate: 600,
            tags: [`place-${id}`],
          },
        });

        if (placeResponse.ok) {
          const placeData: unknown = await placeResponse.json();
          return placeData as Place;
        }
        return null;
      } catch {
        return null;
      }
    });

    const geodirResults = await Promise.all(geodirPromises);
    const fullPlaces = geodirResults.filter((p): p is Place => p !== null);

    // Merge custom API data with GeoDirectory data
    const mergedPlaces = fullPlaces.map((place) => {
      const customData = placesData.find((p) => p.ID === place.id);

      return {
        ...place,
        gd_custom_ratings: customData?.rating || place.rating || 0,
        claimed: customData?.claimed || 0,
      };
    });

    // Fetch WordPress usernames
    const authorIds = [
      ...new Set(
        mergedPlaces
          .map((place) => place.author || place.post_author)
          .filter((id): id is number => typeof id === "number"),
      ),
    ];

    const usernameMap: Record<number, string> = {};

    if (authorIds.length > 0) {
      try {
        const userPromises = authorIds.map(
          async (authorId: number): Promise<UserResult> => {
            try {
              const userResponse = await fetch(
                `${config.api.wordpress}/users/${authorId}`,
                {
                  headers: { Accept: "application/json" },
                  cache: "force-cache", // ⭐ Aggressive caching
                  next: {
                    revalidate: 86400,
                    tags: [`user-${authorId}`],
                  },
                },
              );

              if (userResponse.ok) {
                const userData: unknown = await userResponse.json();
                const typedUserData = userData as UserApiResponse;
                return { id: authorId, slug: typedUserData.slug || null };
              }
              return { id: authorId, slug: null };
            } catch {
              return { id: authorId, slug: null };
            }
          },
        );

        const userResults = await Promise.all(userPromises);

        userResults.forEach((result) => {
          if (result.slug) {
            usernameMap[result.id] = result.slug;
          }
        });
      } catch (err) {
        console.error("⚠️ Error fetching usernames:", err);
      }
    }

    // Add usernames to places
    const finalPlaces = mergedPlaces.map((place) => {
      const authorId = place.author || place.post_author;
      const username = authorId ? usernameMap[authorId] : null;

      return {
        ...place,
        slug: username || place.slug,
      };
    });

    console.log(
      `✅ Fetched and cached ${finalPlaces.length} places for page ${page}`,
    );

    return {
      places: finalPlaces,
      total,
      totalPages,
      currentPage: page,
      perPage,
    };
  } catch (err) {
    const error = err as Error;
    console.error("⚠️ Error fetching paginated places:", error.message);
    return {
      places: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      perPage,
    };
  }
}

// Main page component
export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>; // ⭐ Add category param
}) {
  // Get current page from URL (await searchParams for Next.js 15)
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const categoryFilter = params.category || "all"; // ⭐ Get category from URL
  const perPage = 12;

  console.log("🏪 Vendors Page - Server Component Rendering...");
  console.log(`📄 Current Page: ${currentPage}`);
  console.log(`🏷️ Category Filter: ${categoryFilter}`); // ⭐ Log category

  // Fetch data in parallel
  const [categories, locations, paginatedData] = await Promise.all([
    fetchCategories(),
    fetchLocations(),
    fetchPaginatedPlaces(currentPage, perPage, categoryFilter), // ⭐ Pass category filter
  ]);

  console.log(
    `✅ Fetched ${paginatedData.places.length} places for page ${currentPage}`,
  );
  console.log(
    `📊 Total: ${paginatedData.total} places, ${paginatedData.totalPages} pages`,
  );

  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading vendors...</div>}
    >
      <VendorsClient
        initialPlaces={paginatedData.places}
        categories={categories}
        regions={locations.regions}
        cities={locations.cities}
        totalPlaces={paginatedData.total}
        totalPages={paginatedData.totalPages}
        currentPage={currentPage}
        perPage={perPage}
      />
    </Suspense>
  );
}
