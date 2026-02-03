"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  Flag,
  CheckCircle,
  Shield,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";

interface Vendor {
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
  claimed: number;
  phone?: string;
  email?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    twitter?: string;
  };
  policies?: {
    shipping: string;
    returns: string;
    faqs: string;
  };
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price?: string;
  regular_price?: string;
  images?: Array<{ src: string; alt?: string }>;
  [key: string]: any;
}

interface VendorDetailClientProps {
  vendor: Vendor;
  products: Product[];
}

export function VendorDetailClient({
  vendor,
  products,
}: VendorDetailClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Check if this is a claimed listing
  const isClaimed = vendor.claimed === 1;

  // Mock reviews for now (you can fetch these from an API later)
  const mockReviews = [
    {
      id: 1,
      author: "Jennifer Thompson",
      date: "1 week ago",
      rating: 5,
      text: "Excellent local business! The quality of products and service is outstanding. Highly recommend to anyone in the area!",
    },
    {
      id: 2,
      author: "Robert Wilson",
      date: "2 weeks ago",
      rating: 4,
      text: "Great experience overall. Good selection and fair prices. Will definitely be returning!",
    },
    {
      id: 3,
      author: "Maria Santos",
      date: "3 weeks ago",
      rating: 5,
      text: "Amazing service and quality! The staff was friendly and very helpful. Love supporting local businesses like this!",
    },
  ];

  // Mock business hours
  const businessHours = [
    { day: "Monday", hours: "9:00 AM - 6:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
    { day: "Friday", hours: "9:00 AM - 7:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 5:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! (This is a demo)");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Return to Directory</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Hero Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className="aspect-[21/9] relative">
                <Image
                  src={vendor.banner}
                  alt={vendor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl text-gray-900 mb-3">{vendor.name}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(vendor.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {vendor.rating.toFixed(1)} ({mockReviews.length} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">$10–30</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-900 text-xs rounded-lg">
                    {vendor.specialty}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-900 text-xs rounded-lg">
                    Local Business
                  </span>
                  {isClaimed ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified Listing
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg">
                      Unclaimed Listing
                    </span>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Contact Information */}
              <div>
                <h2 className="text-lg text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                    <p className="text-gray-900">{vendor.location}</p>
                  </div>

                  {vendor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                      <a
                        href={`tel:${vendor.phone}`}
                        className="text-gray-900 hover:text-green-500 transition-colors"
                      >
                        {vendor.phone}
                      </a>
                    </div>
                  )}

                  {vendor.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                      <a
                        href={`mailto:${vendor.email}`}
                        className="text-gray-900 hover:text-green-500 transition-colors"
                      >
                        {vendor.email}
                      </a>
                    </div>
                  )}

                  {vendor.socialLinks?.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-500 shrink-0" />
                      <a
                        href={vendor.socialLinks.website}
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

              {/* Visit Vendor Store Button */}
              <div>
                <Link
                  href={`/vendor/${vendor.slug}`}
                  className="w-full px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Store className="w-5 h-5" />
                  <span>Visit Vendor Store</span>
                </Link>
              </div>

              {/* Products Available Banner */}
              {products.length > 0 && (
                <>
                  <div className="h-px bg-gray-200" />

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">
                            Shop from this vendor
                          </p>
                          <p className="text-xs text-gray-600">
                            {products.length} products available
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/vendor/${vendor.slug}`}
                        className="px-4 py-2 bg-white hover:bg-gray-50 text-sky-600 border border-sky-300 rounded-lg transition-colors text-sm whitespace-nowrap shadow-sm hover:shadow-md"
                      >
                        Browse Products
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg text-gray-900">Hours</h2>
              </div>

              <div className="space-y-2">
                {businessHours.map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-900">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{vendor.bio}</p>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg text-gray-900 mb-6">Customer Reviews</h2>

              <div className="space-y-6">
                {mockReviews.map((review, index) => (
                  <div key={review.id}>
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-gray-900">{review.author}</p>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>

                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    </div>

                    {index < mockReviews.length - 1 && (
                      <div className="h-px bg-gray-200 mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              id="contact-form"
            >
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-gray-900" />
                <h2 className="text-lg text-gray-900">Contact Business</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-900 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
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
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    required
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

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Map Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                {vendor.latitude && vendor.longitude ? (
                  <div className="aspect-[21/9] bg-gray-100 relative flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h3 className="text-gray-950 mb-2">Map Available</h3>
                      <p className="text-sm text-gray-500">
                        Location: {vendor.latitude}, {vendor.longitude}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        (Interactive map coming soon)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[21/9] bg-gray-100 relative flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-gray-950 mb-2">No Location Data</h3>
                      <p className="text-sm text-gray-500">
                        Location coordinates not available for this business
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Claim Listing or Verified Badge */}
              {!isClaimed ? (
                <div className="bg-white border-2 border-green-600 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Flag className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900 mb-2">
                        Is this your business?
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        Claim this listing to manage your business information,
                        respond to reviews, and connect with customers.
                      </p>

                      <div className="space-y-2 mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Get verified badge</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Update business info</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Respond to reviews</span>
                        </div>
                      </div>

                      <Link
                        href="/sell"
                        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Shield className="w-5 h-5" />
                        Claim This Listing
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-green-600 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
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

                      <button
                        onClick={() =>
                          document
                            .querySelector("#contact-form")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                      >
                        Contact Business
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        {products.length > 0 && (
          <div className="mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-gray-900">
                      Products from {vendor.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {products.length}{" "}
                      {products.length === 1 ? "product" : "products"} available
                    </p>
                  </div>
                </div>

                <Link
                  href={`/vendor/${vendor.slug}`}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Package className="w-4 h-4" />
                  <span className="text-sm">View Full Store</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all border border-gray-200"
                  >
                    <div className="aspect-square relative bg-white">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0].src}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      {product.price && (
                        <p className="text-lg text-gray-900">
                          ${product.price}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {products.length > 8 && (
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <Link
                    href={`/vendor/${vendor.slug}`}
                    className="inline-flex items-center gap-2 text-green-500 hover:text-green-600 transition-colors"
                  >
                    <span>View all {products.length} products</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
