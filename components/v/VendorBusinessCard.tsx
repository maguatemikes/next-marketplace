"use client";

import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  ExternalLink,
  Store,
  Check,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

interface Vendor {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  tagline: string;
  specialty: string;
  rating: number;
  location: string;
  distance?: number;
  claimed: number | string;
}

interface VendorBusinessCardProps {
  vendor: Vendor;
}

// Format distance
function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${(distance * 5280).toFixed(0)} ft away`;
  }
  return `${distance.toFixed(1)} mi away`;
}

export function VendorBusinessCard({ vendor }: VendorBusinessCardProps) {
  const isClaimed = vendor.claimed === 1 || vendor.claimed === "1";

  // Generate stable review count based on vendor ID
  const reviewCount = Math.floor(((parseInt(vendor.id) * 7) % 150) + 10);

  // Mock store hours
  const storeHours = [
    { day: "Mon-Fri", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gray-900/10 hover:border-gray-300 transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={vendor.banner}
          alt={vendor.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Claimed/Unclaimed Badge */}
        {isClaimed ? (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-2.5 py-0.5 rounded-md text-xs font-medium shadow-lg backdrop-blur-sm flex items-center gap-1">
            <Check className="w-3 h-3" />
            VERIFIED
          </div>
        ) : (
          <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-md text-xs font-medium shadow-lg backdrop-blur-sm">
            UNCLAIMED
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg text-gray-950 truncate">{vendor.name}</h3>
              {isClaimed && (
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
            </div>
            <div className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs">
              {vendor.specialty}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => {
              const rating = Number(vendor.rating) || 4.5;
              const isFullStar = i < Math.floor(rating);
              const isHalfStar = i === Math.floor(rating) && rating % 1 >= 0.5;

              return (
                <div key={i} className="relative">
                  <Star className="w-4 h-4 fill-none text-gray-300 transition-all" />
                  {(isFullStar || isHalfStar) && (
                    <Star
                      className="w-4 h-4 fill-amber-400 text-amber-400 absolute top-0 left-0 transition-all"
                      style={
                        isHalfStar
                          ? {
                              clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                            }
                          : undefined
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
          <span className="text-sm text-gray-950">
            {(Number(vendor.rating) || 0).toFixed(1)}
          </span>
          <span className="text-sm text-gray-400">({reviewCount})</span>
        </div>

        {/* Distance */}
        {vendor.distance !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-green-500 mb-3">
            <Navigation className="w-3.5 h-3.5" />
            <span>{formatDistance(vendor.distance)}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {vendor.tagline}
        </p>

        {/* Location & Status */}
        <div className="flex items-center justify-between text-sm mb-5">
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">{vendor.location}</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-red-600 cursor-pointer hover:text-red-700 transition-colors">
                <Clock className="w-4 h-4" />
                <span>Closed</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="end" className="w-48">
              <div className="text-xs space-y-1.5">
                <div className="text-white pb-1.5 border-b border-white/20 mb-1.5">
                  Store Hours
                </div>
                {storeHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-300">{schedule.day}</span>
                    <span
                      className={
                        schedule.hours === "Closed"
                          ? "text-red-400"
                          : "text-white"
                      }
                    >
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            asChild
            className="flex-1 bg-[#F57C00] hover:bg-[#E67000] text-white rounded-md h-10 text-sm shadow-sm hover:shadow-md transition-all"
          >
            <Link href={`/vendors/${vendor.id}`}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </Link>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="outline"
                className="rounded-md h-10 w-10 p-0 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all"
              >
                <Link href={`/store-front/${vendor.slug}`}>
                  <Store className="w-4 h-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visit Store</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Claim Listing Link */}
        {!isClaimed && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link
              href="/sell"
              className="text-xs text-amber-600 hover:text-amber-700 hover:underline w-full text-center transition-colors block"
            >
              Is this your business? Claim it →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
