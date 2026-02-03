import { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorStorefrontClient } from "@/components/store-components/VendorStorefrontClient";

// ⭐ Route Segment Config - Dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 60;

// Types
interface VendorProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string;
  [key: string]: unknown;
}

interface VendorData {
  id: number;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  bio: string;
  location: string;
  rating: number;
  specialty: string;
  visits: number;
  products: VendorProduct[];
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
  };
  policies?: {
    shipping?: string;
    returns?: string;
    faqs?: string;
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fetch vendor data by username/slug
async function fetchVendorByUsername(slug: string): Promise<VendorData | null> {
  try {
    console.log(`🔍 Fetching vendor by username: ${slug}`);

    const response = await fetch(
      `https://shoplocal.kinsta.cloud/wp-json/custom-api/v1/vendor-by-username/${slug}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      console.error(`❌ Vendor API error: ${response.status}`);
      return null;
    }

    const data: unknown = await response.json();
    console.log(`✅ Found vendor: ${(data as VendorData).name}`);

    return data as VendorData;
  } catch (error) {
    const err = error as Error;
    console.error(`⚠️ Error fetching vendor:`, err.message);
    return null;
  }
}

// ⭐ Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await fetchVendorByUsername(slug);

  if (!vendor) {
    return {
      title: "Vendor Not Found - ShopLocal",
      description: "The vendor you're looking for could not be found.",
    };
  }

  const description =
    vendor.bio?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    `Shop from ${vendor.name} - a trusted local vendor on ShopLocal marketplace`;

  return {
    title: `${vendor.name} - ${vendor.specialty} | ShopLocal`,
    description,
    keywords: `${vendor.name}, ${vendor.specialty}, local vendor, ${vendor.location}, ShopLocal marketplace`,
    openGraph: {
      title: `${vendor.name} - ${vendor.specialty}`,
      description,
      type: "website",
      images: [
        {
          url: vendor.logo || vendor.banner,
          width: 1200,
          height: 630,
          alt: vendor.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${vendor.name} - ${vendor.specialty}`,
      description,
      images: [vendor.logo || vendor.banner],
    },
  };
}

// ⭐ Main Server Component
export default async function VendorStorefrontPage({ params }: PageProps) {
  const { slug } = await params;

  console.log(`\n🏪 Vendor Storefront - Server Component`);
  console.log(`📍 Slug: ${slug}`);

  // Fetch vendor data
  const vendor = await fetchVendorByUsername(slug);

  if (!vendor) {
    console.error(`❌ Vendor not found: ${slug}`);
    notFound();
  }

  console.log(`✅ Rendering vendor: ${vendor.name}`);
  console.log(`📦 Products: ${vendor.products?.length || 0}`);

  return <VendorStorefrontClient vendor={vendor} vendorSlug={slug} />;
}
