import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Star,
  DollarSign,
  MapPin,
  Phone,
  Globe,
  Clock,
  Mail,
  Send,
  User,
  CheckCircle,
  Shield,
  Store,
} from "lucide-react";
import { VendorDetailMap } from "@/components/vendor-components/VendorDetailMap";
import BackButton from "@/components/vendor-components/BackButton";

interface VendorDetail {
  id: string;
  title: {
    raw: string;
    rendered: string;
  };
  slug: string;
  link: string;
  status: string;
  type: string;
  author: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  content: {
    raw: string;
    rendered: string;
    protected: boolean;
  };

  // Taxonomies
  default_category: string;
  post_category: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  post_tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;

  // ✅ FLAT LOCATION FIELDS (not nested)
  street: string;
  country: string;
  region: string;
  city: string;
  zip: string;
  latitude: string;
  longitude: string;
  mapview: any;
  mapzoom: any;

  // ✅ FLAT CONTACT FIELDS (not nested)
  phone: string;
  email: string;
  website: string;
  twitter: string;
  facebook: string;
  video: string;

  // Business info
  special_offers: string;
  business_hours: any;
  featured: boolean;
  rating: string;
  rating_count: number;
  claimed: number; // 0 = not claimed, 1 = claimed

  // ✅ FLAT VENDOR FIELDS (not nested)
  vendor_id: number | null;
  vendor_name: string | null;
  vendor_slug: string | null;

  // Media
  featured_media: number | null;
  featured_image: {
    id: string;
    title: string;
    src: string;
    thumbnail: string;
    width: number;
    height: number;
  } | null;
  images: Array<{
    id: string;
    title: string;
    src: string;
    thumbnail: string;
    featured: boolean;
    position: string;
  }>;

  // Meta
  comment_status: string;
  ping_status: string;
  meta: {
    _acf_changed: boolean;
    footnotes: string;
  };
  guid: {
    rendered: string;
  };

  _cached: boolean;
}

const fetchVendorDetailById = async (slug: string): Promise<VendorDetail> => {
  const response = await fetch(
    `https://shoplocal.kinsta.cloud/wp-json/custom-api-v3/v1/places/${slug}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch vendor details");
  }

  const data = await response.json();
  return data;
};

// ✅ Next.js 15 generateMetadata - Best Practice
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const detail = await fetchVendorDetailById(slug);

    const title = detail.title.rendered || "Local Business";
    const description = detail.content.raw
      ? detail.content.raw
          .slice(0, 160)
          .replace(/<[^>]*>/g, "")
          .trim()
      : `Visit ${title} - ${detail.post_category[0]?.name || "Local Business"} located at ${detail.street || "your area"}`;

    const imageUrl =
      detail.featured_image?.src ||
      "https://shoplocal.com/og-default-vendor.jpg";
    const category = detail.post_category[0]?.name || "Local Business";
    const address = detail.street || "";

    return {
      title: `${title} | ShopLocal Business Directory`,
      description,
      keywords: [
        title,
        category,
        "local business",
        "shop local",
        address,
        detail.post_category.map((cat) => cat.name),
      ]
        .flat()
        .filter(Boolean),

      // Open Graph
      openGraph: {
        title: `${title} - ${category}`,
        description,
        url: `https://shoplocal.com/vendors/${slug}`,
        siteName: "ShopLocal",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "en_US",
      },

      // Twitter Card
      twitter: {
        card: "summary_large_image",
        title: `${title} - ${category}`,
        description,
        images: [imageUrl],
        creator: "@shoplocal",
        site: "@shoplocal",
      },

      // Robots
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },

      // Alternates
      alternates: {
        canonical: `https://shoplocal.com/vendors/${slug}`,
      },

      // Additional structured data for business
      other: {
        "business:contact_data:street_address": detail.street || "",
        "business:contact_data:phone_number": detail.phone || "",
        "business:contact_data:website": detail.website || "",
        "business:contact_data:email": detail.email || "",
        "geo.position":
          detail.latitude && detail.longitude
            ? `${detail.latitude};${detail.longitude}`
            : "",
        "geo.placename": title,
      },
    };
  } catch (error) {
    // Fallback metadata if fetch fails
    return {
      title: "Business Not Found | ShopLocal",
      description:
        "The requested business could not be found in our directory.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const detail = await fetchVendorDetailById(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <BackButton />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className="aspect-[21/9] relative">
                {detail.featured_image?.src ? (
                  <Image
                    src={detail.featured_image.src}
                    alt={detail.title.rendered}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
              <div>
                <h1 className="text-3xl text-gray-900 mb-3">
                  {detail.title.rendered}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(parseFloat(detail.rating || "0"))
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {detail.rating} ({detail.rating_count} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {detail.post_category[0] && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-900 text-xs rounded-lg">
                      {detail.post_category[0].name}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gray-100 text-gray-900 text-xs rounded-lg">
                    Local Business
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified Listing
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              <div>
                <h2 className="text-lg text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                    <p className="text-gray-900">{detail.street || "N/A"}</p>
                  </div>

                  {detail.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                      <a
                        href={`tel:${detail.phone}`}
                        className="text-gray-900 hover:text-green-500 transition-colors"
                      >
                        {detail.phone}
                      </a>
                    </div>
                  )}

                  {detail.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                      <a
                        href={`mailto:${detail.email}`}
                        className="text-gray-900 hover:text-green-500 transition-colors"
                      >
                        {detail.email}
                      </a>
                    </div>
                  )}

                  {detail.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-500 shrink-0" />
                      <a
                        href={detail.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:text-green-500 transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              <div>
                <Link
                  href={`/store-front/${detail.vendor_slug}`}
                  className="w-full px-6 py-3 bg-green-300 hover:bg-green-400 text-white rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Store className="w-5 h-5" />
                  <span>Visit Vendor Store</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg text-gray-900">Hours</h2>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Monday</span>
                  <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Tuesday</span>
                  <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Wednesday</span>
                  <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Thursday</span>
                  <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Friday</span>
                  <span className="text-gray-600">9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Saturday</span>
                  <span className="text-gray-600">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Sunday</span>
                  <span className="text-gray-600">Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl text-gray-900 mb-4">About</h2>
              <div
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: detail.content.rendered }}
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg text-gray-900 mb-6">Customer Reviews</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900">Jennifer Thompson</p>
                        <span className="text-sm text-gray-500">
                          1 week ago
                        </span>
                      </div>

                      <div className="flex mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>

                      <p className="text-gray-600 leading-relaxed">
                        Excellent local business! The quality of products and
                        service is outstanding. Highly recommend to anyone in
                        the area!
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 mt-6" />
                </div>

                <div>
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900">Robert Wilson</p>
                        <span className="text-sm text-gray-500">
                          2 weeks ago
                        </span>
                      </div>

                      <div className="flex mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>

                      <p className="text-gray-600 leading-relaxed">
                        Great experience overall. Good selection and fair
                        prices. Will definitely be returning!
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 mt-6" />
                </div>

                <div>
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900">Maria Santos</p>
                        <span className="text-sm text-gray-500">
                          3 weeks ago
                        </span>
                      </div>

                      <div className="flex mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>

                      <p className="text-gray-600 leading-relaxed">
                        Amazing service and quality! The staff was friendly and
                        very helpful. Love supporting local businesses like
                        this!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-gray-900" />
                <h2 className="text-lg text-gray-900">Contact Business</h2>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-900 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="What is this regarding?"
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Your message..."
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="text-sm">Send Message</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Interactive Map */}
              <VendorDetailMap
                latitude={detail.latitude}
                longitude={detail.longitude}
                title={detail.title.rendered}
                address={detail.street || "Address not available"}
              />

              {/* Conditional: Claimed vs Unclaimed Listing */}
              {detail.claimed === 1 ? (
                // ✅ CLAIMED LISTING
                <div className="bg-white border-2 border-green-600 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg text-gray-900">
                          Claimed Listing
                        </h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        This business has been claimed and verified by the
                        owner. The information is accurate and regularly
                        updated.
                      </p>

                      <div className="space-y-2 mb-4 bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Owner verified</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Information accurate</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Regularly updated</span>
                        </div>
                      </div>

                      <button className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm flex items-center justify-center">
                        Contact Business
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // ❌ UNCLAIMED LISTING
                <div className="bg-white border-2 border-orange-400 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg text-gray-900">
                          Unclaimed Listing
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        This listing has not been claimed by the business owner
                        yet. If you own this business, claim it to manage your
                        information and connect with customers.
                      </p>

                      <div className="space-y-2 mb-4 bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-orange-500" />
                          <span>Verify your ownership</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-orange-500" />
                          <span>Update business info</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-orange-500" />
                          <span>Respond to reviews</span>
                        </div>
                      </div>

                      <Link
                        href={`/sell/`}
                        className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center"
                      >
                        Claim This Listing
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
