import Link from "next/link";
import { Suspense } from "react";
import BrandCarousel from "@/components/home-comp/BrandCarousel"; // Ensure named export

const flexBrandLogo = async () => {
  const res = await fetch(
    "https://api.flexoffers.com/v3/products/advertisers?page=1&pageSize=500",
    {
      headers: {
        Accept: "application/json",
        apiKey: "e046d538-fa83-4510-abe0-b8b15c576bfa",
      },
    },
  );
  const data = await res.json();
  return data || [];
};

const BrandContainer = () => {
  const brands = flexBrandLogo();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl text-gray-900">Our Brand Partners</h2>
          <Link
            href="/product/search"
            className="text-gray-900 underline hover:text-gray-700"
          >
            View all brands
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="h-40 animate-pulse bg-gray-100 rounded-xl" />
          }
        >
          <BrandCarousel advertisersPromise={brands} />
        </Suspense>
      </div>
    </section>
  );
};

export default BrandContainer;
