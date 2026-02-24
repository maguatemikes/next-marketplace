import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { MapPin, Clock, Star, Check, ExternalLink, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface DirectoryItem {
  ID: number;
  title: string;
  slug: string;
  content: string;
  author: number;
  rating: string;
  category: string[];
  location: string[];
  claimed: number;
  image: string;
  latitude: number;
  longitude: number;
  vendor_id: number | null;
  vendor_name: string | null;
  vendor_slug: string | null;
}

interface DirectoryCardProps {
  item: DirectoryItem;
}

// Mock store hours data
const storeHours = [
  { day: "Monday", hours: "9:00 AM - 6:00 PM" },
  { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
  { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
  { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
  { day: "Friday", hours: "9:00 AM - 8:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

export function DirectoryCard({ item }: DirectoryCardProps) {
  // Check if claimed from API data
  const isClaimed = item.claimed === 1;

  // Random open/closed status (in production, calculate from hours)
  const isOpen = Math.random() > 0.3;

  // Parse rating from API
  const rating = parseFloat(item.rating) || 0;

  // Mock review count (in production, fetch from API)
  const reviewCount = Math.floor(Math.random() * 200) + 10;

  return (
    <TooltipProvider>
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gray-900/10 hover:border-gray-300 transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Claimed/Unclaimed Badge */}
          {isClaimed ? (
            <div className="absolute top-4 left-4 bg-green-600 text-white px-2.5 py-0.5 rounded-sm text-[9px] shadow-lg backdrop-blur-sm flex items-center gap-1">
              <Check className="w-3 h-3" />
              VERIFIED
            </div>
          ) : (
            <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-sm text-[9px] shadow-lg backdrop-blur-sm">
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
                <h3 className="text-lg text-gray-950 truncate">{item.title}</h3>
                {isClaimed && (
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>
              <div className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs">
                {item.category[0] || "Business"}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => {
                const isFullStar = i < Math.floor(rating);
                const isHalfStar =
                  i === Math.floor(rating) && rating % 1 >= 0.5;

                return (
                  <div key={i} className="relative">
                    <Star className="w-4 h-4 fill-none text-gray-300 transition-all" />
                    {(isFullStar || isHalfStar) && (
                      <Star
                        className="w-4 h-4 fill-amber-400 text-amber-400 absolute top-0 left-0 transition-all"
                        style={
                          isHalfStar
                            ? {
                                clipPath:
                                  "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
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
              {rating > 0 ? rating.toFixed(1) : "N/A"}
            </span>
            <span className="text-sm text-gray-400">({reviewCount})</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {item.content}
          </p>

          {/* Location & Status */}
          <div className="flex items-center justify-between text-sm mb-5">
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate">{item.location[0] || "Location"}</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                    isOpen
                      ? "text-green-600 hover:text-green-700"
                      : "text-red-600 hover:text-red-700"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{isOpen ? "Open" : "Closed"}</span>
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
            <Link href={`/vendors/${item.ID}`} className="flex-1">
              <Button className="w-full bg-[#F57C00] hover:bg-[#E67000] text-white rounded-md h-10 text-sm shadow-sm hover:shadow-md transition-all">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
            {item.vendor_id && item.vendor_slug && (
              <Link href={`/store-front/${item.vendor_slug}`}>
                <Button className=" bg-green-300 text-white rounded-md h-10 px-4 text-sm shadow-sm hover:bg-green-400 hover:text-white transition-all">
                  <Store className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Claim Listing Link */}
          {!isClaimed && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <a
                href="#"
                className="text-xs text-amber-600 hover:text-amber-700 hover:underline w-full text-center transition-colors block"
              >
                Is this your business? Claim it →
              </a>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
