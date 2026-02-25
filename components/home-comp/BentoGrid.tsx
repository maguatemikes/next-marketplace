import Image from "next/image";
import Link from "next/link";

interface Banner {
  imageUrl: string;
}

const fetchBannerType = async (): Promise<Banner | null> => {
  const url =
    "https://api.flexoffers.com/v3/promotions?bannerTypeIds=4&page=5&pageSize=1";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Use an environment variable for security
        apiKey: "e046d538-fa83-4510-abe0-b8b15c576bfa",
      },
      // Next.js 15: optional caching configuration
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error("Failed to fetch banner");

    const data = await response.json();
    // Assuming 'results' is an array; take the first item
    return data.results?.[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const BentoGrid = async () => {
  const banner = await fetchBannerType();
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Who are we? - LCP */}
          <Link
            href="/products?page=1&search=new+balance"
            aria-label="View New Balance Shoes"
            className="md:row-span-2 bg-[#6B7280] rounded-3xl overflow-hidden cursor-pointer group relative h-150"
          >
            <div className="absolute inset-0">
              {banner?.imageUrl ? (
                <Image
                  src={banner.imageUrl}
                  alt="New Balance Shoes"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              ) : null}

              <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/40"></div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/products?page=1&search=logitech"
            className="bg-[#8B9BA8] rounded-3xl overflow-hidden cursor-pointer group relative h-[292px]"
            aria-label="view logitech headphones"
          >
            <div className="absolute inset-0">
              <Image
                src="/hero-images/logictech.jpg"
                alt="An image of logitech graphics for headphones"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/products?page=1&search=new+era"
            className="bg-[#8B7D7B] rounded-3xl overflow-hidden cursor-pointer group relative h-[292px]"
            aria-label="browser our new era caps"
          >
            <div className="absolute inset-0">
              <Image
                src="/hero-images/caps.avif"
                alt="new era caps"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            href="/product/search"
            className="lg:col-span-2 lg:col-start-2 bg-gradient-to-br from-[#FFF4E6] to-[#FFE8D6] rounded-3xl overflow-hidden cursor-pointer group h-[292px]"
          >
            <div className="h-full flex flex-col justify-between">
              <div className="flex-1 flex items-center justify-center relative">
                <Image
                  src="/hero-images/apple-watch.webp"
                  alt="apple watch series"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  loading="lazy"
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
