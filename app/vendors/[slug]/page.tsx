import Link from "next/link";
import Image from "next/image";
import {
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
  slug: string;
  email: string;
  street: string;
  phone: string;
  website: string;
  latitude?: string;
  longitude?: string;
  post_category: Category[];
  content: {
    rendered: string;
    raw: string;
  };
  featured_image?: {
    id: string;
    title: string;
    src: string;
    thumbnail: string;
  };
  title: {
    rendered: string;
    raw: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const fetchVendorDetailById = async (slug: string): Promise<VendorDetail> => {
  const response = await fetch(
    `https://shoplocal.kinsta.cloud/wp-json/geodir/v2/places/${slug}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    },
  );

  const data = await response.json();
  return data;
};

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<VendorDetail>;
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
                  {detail.title?.raw}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                    <span className="text-gray-600 text-sm">
                      4.5 (3 reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">$10–30</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-900 text-xs rounded-lg">
                    {detail.post_category[0]?.name}
                  </span>
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
                  href="/vendor/sample-business"
                  className="w-full px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
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
              <p className="text-gray-600 leading-relaxed">
                {detail.content.raw}
              </p>
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
                title={detail.title.raw}
                address={detail.street || "Address not available"}
              />

              <div className="bg-white border-2 border-green-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg text-gray-900">
                        Verified Business
                      </h3>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      This business has been verified by ShopLocal. The
                      information is accurate and regularly updated.
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
