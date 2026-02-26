"use client";

import { use } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface BentoLeftProps {
  bannersPromise: Promise<any[]>;
}

export function BentoLeft({ bannersPromise }: BentoLeftProps) {
  const banners = use(bannersPromise);

  const [emblaRef] = useEmblaCarousel({ loop: true, axis: "y" }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  if (!banners || banners.length === 0) return null;

  return (
    <div
      className="overflow-hidden w-full aspect-160/600 bg-gray-100 rounded-lg relative"
      ref={emblaRef}
    >
      <div className="flex flex-col h-full">
        {banners.map((banner, i) => (
          <div className="flex-[0_0_100%] min-h-0 relative" key={i}>
            <a
              href={banner.trackingLink || "#"}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="block w-full h-full"
            >
              <Image
                src={banner.imageUrl}
                alt={banner.advertiserName || "FlexOffers Promotion"}
                width={160}
                height={600}
                priority={i === 0}
                className="w-full h-full object-cover"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
