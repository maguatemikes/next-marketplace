"use client";

import { use } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface BentoBottomProps {
  bannersPromise: Promise<any[]>;
  imageUrl?: string;
}

export function BentoBottom({ bannersPromise }: BentoBottomProps) {
  const banners = use(bannersPromise);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  if (!banners || banners.length === 0) return null;

  return (
    <div
      className="overflow-hidden w-full max-w-[950px] aspect-[950/250] mx-auto bg-gray-100 rounded-lg relative"
      ref={emblaRef}
    >
      <div className="flex h-full">
        {banners.map((banner, i) => (
          <div className="flex-[0_0_100%] min-w-0 h-full" key={i}>
            <a
              href={banner.trackingLink || "#"}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="block w-full h-full"
            >
              <Image
                src={banner.imageUrl}
                alt={banner.advertiserName || "FlexOffers Promotion"}
                width={950}
                height={250}
                priority={i === 0}
                className="w-full h-full object-fill"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
