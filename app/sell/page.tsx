import { Metadata } from "next";
import { BecomeSellerClient } from "@/components/seller-comp/BecomeSellerClient";

export const metadata: Metadata = {
  title: "Become a Seller | ShopLocal",
  description:
    "Join ShopLocal marketplace as an authorized seller. Sell premium brand products or offer local services alongside national brands. Get visibility, reach customers, and grow your business.",
  keywords:
    "become a seller, sell on ShopLocal, marketplace seller, authorized seller, local business, sell products online, service provider",
  openGraph: {
    title: "Become a Seller | ShopLocal",
    description:
      "Join ShopLocal marketplace as an authorized seller. Get visibility, reach customers, and grow your business.",
    type: "website",
  },
};

const API_BASE_URL = "https://shoplocal.kinsta.cloud";

// Server-side data fetching
async function getCategories() {
  // These are static categories - could also fetch from API if needed
  return [
    { id: 1, name: "Retail Store (Products)", slug: "retail" },
    { id: 2, name: "Restaurant / Food Service", slug: "restaurant" },
    { id: 3, name: "Professional Services", slug: "professional" },
    { id: 4, name: "Health & Wellness", slug: "wellness" },
    { id: 5, name: "Home Services", slug: "home-services" },
    { id: 6, name: "Automotive", slug: "automotive" },
    { id: 7, name: "Beauty & Spa", slug: "beauty" },
    { id: 8, name: "Entertainment", slug: "entertainment" },
    { id: 9, name: "Other", slug: "other" },
  ];
}

// Server action for searching businesses
export async function searchBusinesses(query: string) {
  "use server";

  if (!query || query.length < 2) {
    return { businesses: [], error: null };
  }

  try {
    const url = new URL(`${API_BASE_URL}/wp-json/geodir/v2/places`);
    url.searchParams.append("search", query);
    url.searchParams.append("per_page", "10");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store", // Don't cache search results
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { businesses: [], error: null };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const businesses = data.map((place: any) => ({
      id: place.id,
      name:
        typeof place.title === "string"
          ? place.title
          : place.title?.rendered || "Business",
      address:
        [place.street, place.city, place.region, place.zip]
          .filter(Boolean)
          .join(", ") || "Address not available",
      category: place.post_category?.name || "General",
      verified: place.claimed,
      image: place.featured_image?.src || "https://via.placeholder.com/200",
    }));

    return { businesses, error: null };
  } catch (error: any) {
    console.error("Error searching businesses:", error);

    let errorMessage = "Unable to search businesses. Please try again.";
    if (error.message?.includes("timeout")) {
      errorMessage =
        "Request timed out. Please check your connection and try again.";
    } else if (error.message?.includes("Network")) {
      errorMessage = "Network error. Please check your internet connection.";
    }

    return { businesses: [], error: errorMessage };
  }
}

export default async function BecomeSellerPage() {
  // Fetch initial data on server
  const categories = await getCategories();

  return (
    <BecomeSellerClient
      categories={categories}
      searchBusinessesAction={searchBusinesses}
    />
  );
}
