"use client";

import { use } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface Advertiser {
  aid: number;
  imageUrl: string;
  trackingLink: string;
  name: string;
}

interface BrandSliderProps {
  advertisersPromise: Promise<Advertiser[]>;
}

export default function BrandSlider({ advertisersPromise }: BrandSliderProps) {
  const advertisers = use(advertisersPromise);

  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  if (!advertisers || advertisers.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden" ref={emblaRef}>
      {/* Container with negative margin to handle slide padding */}
      <div className="flex -ml-4">
        {advertisers.map((advertiser) => (
          <div
            key={advertiser.aid}
            className="flex-none min-w-0 pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
          >
            <a
              href={advertiser.trackingLink}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="block group"
            >
              <div className="relative aspect-square border-2 overflow-hidden rounded-sm">
                <Image
                  src={advertiser.imageUrl}
                  alt={advertiser.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
