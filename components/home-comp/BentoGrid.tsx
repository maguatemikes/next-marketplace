import { Suspense } from "react";
import Image from "next/image";
import { BentoLeft } from "@/components/home-comp/BentoLeft";
import { BentoBottom } from "@/components/home-comp/BentoBottom";

// Helper for fetching
const fetchTypeBanners = async (type: string): Promise<any[]> => {
  try {
    const res = await fetch(
      `https://api.flexoffers.com/v3/promotions?bannerTypeIds=${type}&page=1&pageSize=100`,
      {
        headers: {
          Accept: "application/json",
          apiKey: "e046d538-fa83-4510-abe0-b8b15c576bfa",
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
};

export default function BentoGrid() {
  const fetchType4 = fetchTypeBanners("4");
  const fetchType13 = fetchTypeBanners("13");

  return (
    <div className="flex gap-4 max-w-[1130px] mx-auto sm:h-[600px] ">
      {/* Left sidebar */}
      <div className="sm:w-[160px] w-[60px] flex-shrink-0">
        <Suspense fallback={<LeftSkeleton />}>
          <BentoLeft bannersPromise={fetchType4} />
        </Suspense>
      </div>

      {/* Right content */}
      <div className="flex-1 max-w-[950px] flex flex-col gap-4">
        {/* Top Banner */}
        <div className="relative sm:h-[340px] h-[135px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
          <Image
            src="/hero-images/collage.png"
            alt="collage"
            fill
            className="object-cover"
          />
        </div>

        {/* Bottom section */}
        <div className="flex-1">
          <Suspense fallback={<BottomSkeleton />}>
            <BentoBottom bannersPromise={fetchType13} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Keep Skeletons here or move to a separate file
function LeftSkeleton() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {[1, 2].map((i) => (
        <div key={i} className="flex-1 bg-gray-200 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

function BottomSkeleton() {
  return <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />;
}
