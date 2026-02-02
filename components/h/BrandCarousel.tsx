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

  // Default brand images
  const brandImages: { [key: string]: string } = {
    Nike: "https://images.unsplash.com/photo-1633432871237-b1841c33a8de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWtlJTIwbG9nbyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzAwMTU2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "Under Armour":
      "https://images.unsplash.com/flagged/photo-1558687887-32e936b96387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlciUyMGFybW91ciUyMGxvZ298ZW58MXx8fHwxNzcwMDQzMDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    Logitech:
      "https://images.unsplash.com/photo-1629362050323-b40efaa4c217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpdGVjaCUyMGxvZ28lMjBicmFuZHxlbnwxfHx8fDE3NzAwNDMwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    Dyson:
      "https://images.unsplash.com/photo-1708529589690-00e2bbb7f327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkeXNvbiUyMGJyYW5kJTIwbG9nb3xlbnwxfHx8fDE3NzAwNDMwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    Adidas:
      "https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZGlkYXMlMjBsb2dvJTIwYnJhbmR8ZW58MXx8fHwxNzcwMDEzNTk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    Samsung:
      "https://images.unsplash.com/photo-1661347998423-b15d37d6f61e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwbG9nbyUyMGJyYW5kfGVufDF8fHx8MTc2OTk3OTQwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    Apple:
      "https://images.unsplash.com/photo-1703756292090-f086a84d1cfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGxvZ28lMjBicmFuZHxlbnwxfHx8fDE3NzAwMTM1OTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    Sony: "https://images.unsplash.com/photo-1644105637327-00f653c887ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb255JTIwbG9nbyUyMGJyYW5kfGVufDF8fHx8MTc2OTk3OTQwNnww&ixlib=rb-4.1.0&q=80&w=1080",
  };

  // Fallback brands if API fails
  const fallbackBrands: Brand[] = [
    { name: "Nike", slug: "nike" },
    { name: "Under Armour", slug: "under-armour" },
    { name: "Logitech", slug: "logitech" },
    { name: "Dyson", slug: "dyson" },
    { name: "Adidas", slug: "adidas" },
    { name: "Samsung", slug: "samsung" },
    { name: "Apple", slug: "apple" },
    { name: "Sony", slug: "sony" },
  ];

  const displayBrands = brands.length > 0 ? brands : fallbackBrands;

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 768) {
        setItemsPerView(3);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(4);
      } else {
        setItemsPerView(5);
      }
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

  const getBrandImage = (brand: Brand) => {
    return brand.image || brandImages[brand.name] || brandImages["Nike"];
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
