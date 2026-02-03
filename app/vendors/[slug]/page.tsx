import { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorDetailClient } from "@/components/v/VendorDetailClient";
import { config } from "@/lib/config";

// ⭐ Route Segment Config - Dynamic rendering for vendor details
export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes

// Types
interface VendorAddress {
  street_1?: string;
  street_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface VendorStoreInfo {
  dokan_store_time?: Record<string, unknown>;
  latitude?: string;
  longitude?: string;
  phone?: string;
  email?: string;
  website?: string;
  social?: {
    fb?: string;
    twitter?: string;
    instagram?: string;
  };
}

interface VendorData {
  id: number;
  store_name: string;
  slug: string;
  status?: string;
  address?: VendorAddress;
  phone?: string;
  email?: string;
  store_nfi?: VendorStoreInfo;
  banner?: string;
  gravatar?: string;
  shop_url?: string;
  products_per_page?: number;
  show_email?: string;
  rating?: {
    rating: number;
    count: number;
  };
}

interface VendorProduct {
  id: number;
  name: string;
  slug: string;
  price?: string;
  regular_price?: string;
  category?: string;
  image?: string;
  images?: Array<{ src: string; alt?: string }>;
  [key: string]: unknown;
}

interface Place {
  id: number;
  title: { raw: string; rendered: string };
  slug: string;
  link: string;
  status: string;
  type: string;
  author: number;
  post_author?: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  content: { raw: string; rendered: string; protected: boolean };
  default_category: string;
  post_category:
    | string
    | { id: number; name: string; slug: string }
    | Array<{ id: number; name: string; slug: string }>;
  post_tags: Array<{ id: number; name: string; slug: string }>;
  street: string;
  country: string;
  region: string;
  city: string;
  zip: string;
  latitude: string;
  longitude: string;
  mapview: string | null;
  mapzoom: string | null;
  phone: string;
  email: string;
  website: string;
  twitter: string;
  facebook: string;
  video: string;
  special_offers: string;
  business_hours: unknown;
  featured: boolean;
  rating: string;
  rating_count: number;
  featured_media: number;
  featured_image: {
    id: string;
    title: string;
    src: string;
    thumbnail: string;
    width: number;
    height: number;
  };
  images: Array<{
    id: string;
    title: string;
    src: string;
    thumbnail: string;
    featured: boolean;
    position: string;
  }>;
  comment_status: string;
  ping_status: string;
  claimed?: number;
  gd_custom_ratings?: number | string;
  [key: string]: unknown;
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ⭐ Fetch place data from GeoDirectory by ID
async function fetchPlaceById(id: string): Promise<Place | null> {
  try {
    console.log(`🔍 Fetching place by ID: ${id}`);

    // Use GeoDirectory single place endpoint
    const geodirUrl = `${config.api.geodir}/places/${id}`;

    const response = await fetch(geodirUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`❌ GeoDirectory API error: ${response.status}`);
      return null;
    }

    const place: unknown = await response.json();
    console.log(
      `✅ Found place: ${(place as Place).title?.rendered || (place as Place).title}`,
    );

    return place as Place;
  } catch (error) {
    const err = error as Error;
    console.error(`⚠️ Error fetching place:`, err.message);
    return null;
  }
}

// ⭐ Fetch vendor/place data from GeoDirectory (Legacy - for backward compatibility)
async function fetchPlaceBySlug(slug: string): Promise<Place | null> {
  // Check if slug is actually an ID (numeric)
  if (/^\d+$/.test(slug)) {
    return fetchPlaceById(slug);
  }

  try {
    console.log(`🔍 Fetching place by slug: ${slug}`);

    // Try GeoDirectory places endpoint with slug filter
    const geodirUrl = `${config.api.geodir}/places?slug=${slug}&per_page=1`;

    const response = await fetch(geodirUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`❌ GeoDirectory API error: ${response.status}`);
      return null;
    }

    const places: unknown = await response.json();

    if (!Array.isArray(places) || places.length === 0) {
      console.warn(`⚠️ No place found for slug: ${slug}`);
      return null;
    }

    const place = places[0] as Place;
    console.log(`✅ Found place: ${place.title?.rendered || place.title}`);

    return place;
  } catch (error) {
    const err = error as Error;
    console.error(`⚠️ Error fetching place:`, err.message);
    return null;
  }
}

// ⭐ Fetch vendor products from WooCommerce
async function fetchVendorProducts(authorId: number): Promise<VendorProduct[]> {
  try {
    console.log(`🛍️ Fetching products for author: ${authorId}`);

    const productsUrl = `${config.api.wordpress}/products?author=${authorId}&per_page=12`;

    const response = await fetch(productsUrl, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.warn(`⚠️ Could not fetch products: ${response.status}`);
      return [];
    }

    const products: unknown = await response.json();
    console.log(`✅ Found ${(products as VendorProduct[]).length} products`);

    return products as VendorProduct[];
  } catch (error) {
    const err = error as Error;
    console.error(`⚠️ Error fetching products:`, err.message);
    return [];
  }
}

// ⭐ Fetch WordPress username from author ID
async function fetchUsername(authorId: number): Promise<string | null> {
  try {
    const response = await fetch(`${config.api.wordpress}/users/${authorId}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (response.ok) {
      const userData = await response.json();
      return userData.slug || null;
    }

    return null;
  } catch {
    return null;
  }
}

// ⭐ Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await fetchPlaceBySlug(slug);

  if (!place) {
    return {
      title: "Business Not Found - ShopLocal",
      description: "The business you're looking for could not be found.",
    };
  }

  const title =
    typeof place.title === "string"
      ? place.title
      : place.title?.rendered || "Business";

  const content =
    typeof place.content === "string"
      ? place.content
      : place.content?.rendered || "";
  const description =
    content.replace(/<[^>]*>/g, "").substring(0, 160) ||
    `Discover ${title} - a trusted local business on ShopLocal`;

  const image =
    place.featured_image?.src ||
    place.images?.[0]?.src ||
    "https://shoplocal.kinsta.cloud/wp-content/uploads/2024/default-business.jpg";

  let specialty = "Local Business";
  if (place.post_category) {
    if (typeof place.post_category === "string") {
      specialty = place.post_category;
    } else if (Array.isArray(place.post_category)) {
      specialty = place.post_category.map((cat) => cat.name).join(", ");
    } else if (typeof place.post_category === "object") {
      specialty = place.post_category.name;
    }
  }

  const location =
    place.city && place.region
      ? `${place.city}, ${place.region}`
      : place.city || place.region || "";

  return {
    title: `${title} - ${specialty} | ShopLocal`,
    description,
    keywords: `${title}, ${specialty}, local business, ${location}, ShopLocal marketplace`,
    openGraph: {
      title: `${title} - ${specialty}`,
      description,
      type: "website",
      url: `https://yoursite.com/vendor-detail/${slug}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${specialty}`,
      description,
      images: [image],
    },
  };
}

// ⭐ Main Server Component
export default async function VendorDetailPage({ params }: PageProps) {
  const { slug } = await params;

  console.log(`\n🏪 Vendor Detail Page - Server Component`);
  console.log(`📍 Slug: ${slug}`);

  // Fetch place data
  const place = await fetchPlaceBySlug(slug);

  if (!place) {
    console.error(`❌ Place not found: ${slug}`);
    notFound();
  }

  // Fetch username if available
  const authorId = place.author || place.post_author;
  let username: string | null = null;

  if (authorId) {
    username = await fetchUsername(authorId);
  }

  // Fetch products if author exists
  const products = authorId ? await fetchVendorProducts(authorId) : [];

  // Transform place to vendor format using GeoDirectory API structure
  const title = place.title?.rendered || "Business";
  const bio =
    place.content?.rendered?.replace(/<[^>]*>/g, "") ||
    "A trusted local business in your community.";

  // Extract specialty from post_category
  let specialty = "General";
  let categoryId: number | undefined;

  if (
    place.post_category &&
    Array.isArray(place.post_category) &&
    place.post_category.length > 0
  ) {
    specialty = place.post_category.map((cat) => cat.name).join(", ");
    categoryId = place.post_category[0].id;
  }

  // Extract images from GeoDirectory response
  const thumbnailUrl =
    place.featured_image?.thumbnail || place.images?.[0]?.thumbnail || "";
  const fullImageUrl =
    place.featured_image?.src || place.images?.[0]?.src || "";

  const logo =
    thumbnailUrl || fullImageUrl || "https://via.placeholder.com/150";
  const banner =
    fullImageUrl || thumbnailUrl || "https://via.placeholder.com/800x300";

  const rating = place.gd_custom_ratings || place.rating || 4.5;

  const vendor = {
    id: place.id.toString(),
    name: title,
    slug: username || place.slug,
    logo,
    banner,
    tagline: bio.substring(0, 100) || "Quality local business",
    bio,
    specialty,
    categoryId,
    rating:
      typeof rating === "number" ? rating : parseFloat(String(rating)) || 0,
    location:
      place.street ||
      (place.city && place.region
        ? `${place.city}, ${place.region}`
        : place.city || place.region || "Local"),
    latitude: place.latitude,
    longitude: place.longitude,
    claimed: place.claimed || 0,
    phone: place.phone,
    email: place.email,
    socialLinks: {
      website: place.website || undefined,
      facebook: place.facebook || undefined,
      twitter: place.twitter || undefined,
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

  console.log(`✅ Rendering vendor: ${vendor.name}`);
  console.log(`📦 Products: ${products.length}`);

  return <VendorDetailClient vendor={vendor} products={products} />;
}
