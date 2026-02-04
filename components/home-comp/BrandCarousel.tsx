"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Brand {
  name: string;
  slug: string;
  image?: string;
}

interface BrandCarouselProps {
  brands: Brand[];
}

export default function BrandCarousel({ brands }: BrandCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);

  // Brand images keyed by SLUG (stable identifiers)
  const brandImages: Record<string, string> = {
    nike: "https://shoplocal.kinsta.cloud/wp-content/uploads/2026/01/nike.png",
    logitech:
      "https://shoplocal.kinsta.cloud/wp-content/uploads/2026/01/logitech.png",
    dyson:
      "https://shoplocal.kinsta.cloud/wp-content/uploads/2026/01/dyson.webp",
    lee: "https://shoplocal.kinsta.cloud/wp-content/uploads/2026/02/lee-logo-black-and-white.png",
    "under-armor":
      "https://shoplocal.kinsta.cloud/wp-content/uploads/2026/01/underarmor.png",
    wfe: "https://shoplocal.kinsta.cloud/wp-content/uploads/2026/01/wfe.png",
  };

  const PLACEHOLDER =
    "https://shoplocal.kinsta.cloud/wp-content/uploads/2026/01/brand-placeholder.png";

  const displayBrands = brands.length > 0 ? brands : [];

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 768) setItemsPerView(3);
      else if (window.innerWidth < 1024) setItemsPerView(4);
      else setItemsPerView(5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, displayBrands.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // ✅ Correct image resolver
  const getBrandImage = (brand: Brand) => {
    return brand.image || brandImages[brand.slug] || PLACEHOLDER;
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {displayBrands.map((brand) => (
            <div
              key={brand.slug}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <Link
                href={`/product/search?brand=${brand.slug}`}
                className="block group"
              >
                <div className="aspect-3/2 rounded-2xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center p-6 hover:shadow-lg transition-shadow relative">
                  <Image
                    src={getBrandImage(brand)}
                    alt={brand.name}
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-6"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    unoptimized
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {displayBrands.length > itemsPerView && (
        <>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed z-10 transition-all"
            aria-label="Previous brands"
          >
            <ChevronLeft className="w-5 h-5 text-gray-900" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed z-10 transition-all"
            aria-label="Next brands"
          >
            <ChevronRight className="w-5 h-5 text-gray-900" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {displayBrands.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? "w-8 bg-gray-900" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
