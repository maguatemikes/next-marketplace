"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  UtensilsCrossed,
  Key,
  Wrench,
  Recycle,
  Gavel,
  Users,
  Calendar,
  Grid3x3,
  Gift,
  Gamepad2,
  Trophy,
  Gem,
  Shirt,
  Utensils,
  Pizza,
  Salad,
  Beef,
  IceCream,
  PartyPopper,
  Mic2,
  Car,
  Box,
  WashingMachine,
  Sprout,
  Package,
  Plug,
  Hammer,
  Armchair,
  Laptop,
  Watch,
  Star,
  Music,
  Dumbbell,
  Store,
  UserPlus,
  Palette,
} from "lucide-react";

// Sub-category icon mapping
const subCategoryIcons: {
  [key: string]: { [key: string]: React.ComponentType<{ className?: string }> };
} = {
  Products: {
    All: Grid3x3,
    "Custom Gifts": Gift,
    Toys: Gamepad2,
    Sports: Trophy,
    Jewelry: Gem,
    Clothes: Shirt,
  },
  Food: {
    All: Utensils,
    Pizza: Pizza,
    Healthy: Salad,
    Burgers: Beef,
    Desserts: IceCream,
    Asian: UtensilsCrossed,
  },
  Rentals: {
    All: Key,
    Events: PartyPopper,
    "Audio/Video": Mic2,
    Vehicles: Car,
    Equipment: Box,
  },
  Services: {
    All: Wrench,
    Cleaning: WashingMachine,
    "Lawn Care": Sprout,
    Plumbing: Package,
    Electrical: Plug,
    Handyman: Hammer,
  },
  "Used Goods": {
    All: Recycle,
    Furniture: Armchair,
    Electronics: Laptop,
    Antiques: Watch,
    Appliances: WashingMachine,
  },
  Auctions: {
    All: Gavel,
    Jewelry: Gem,
    Art: Palette,
    Collectibles: Star,
    Music: Music,
  },
  "Local Community": {
    All: Users,
    Fitness: Dumbbell,
    Markets: Store,
    Clubs: UserPlus,
    Groups: Users,
  },
  Events: {
    All: Calendar,
    Music: Music,
    "Food & Drink": UtensilsCrossed,
    Art: Palette,
    Sports: Trophy,
    Festivals: PartyPopper,
  },
};

interface MarketplaceItem {
  id: string;
  name: string;
  price: number;
  image: string;
  marketplaceCategory: string;
  subCategory?: string;
  location?: string;
  date?: string;
  isNew?: boolean;
}

interface MarketplaceFiltersProps {
  marketplaceItems: MarketplaceItem[];
}

export function MarketplaceFilters({
  marketplaceItems,
}: MarketplaceFiltersProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("Products");
  const [activeTab, setActiveTab] = useState("All");

  // Define subcategories for each main category
  const categorySubTabs: { [key: string]: string[] } = {
    Products: ["All", "Custom Gifts", "Toys", "Sports", "Jewelry", "Clothes"],
    Food: ["All", "Pizza", "Healthy", "Burgers", "Desserts", "Asian"],
    Rentals: ["All", "Events", "Audio/Video", "Vehicles", "Equipment"],
    Services: [
      "All",
      "Cleaning",
      "Lawn Care",
      "Plumbing",
      "Electrical",
      "Handyman",
    ],
    "Used Goods": ["All", "Furniture", "Electronics", "Antiques", "Appliances"],
    Auctions: ["All", "Jewelry", "Art", "Collectibles", "Music"],
    "Local Community": ["All", "Fitness", "Markets", "Clubs", "Groups"],
    Events: ["All", "Music", "Food & Drink", "Art", "Sports", "Festivals"],
  };

  // Get current subcategory tabs
  const currentSubTabs = categorySubTabs[activeCategory] || ["All"];

  // Handle category change - reset to "All" tab
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setActiveTab("All");
  };

  // Filter marketplace items based on selected category and tab
  const filteredMarketplaceItems = marketplaceItems
    .filter((item) => {
      const categoryMatch = item.marketplaceCategory === activeCategory;
      const tabMatch = activeTab === "All" || item.subCategory === activeTab;
      return categoryMatch && tabMatch;
    })
    .slice(0, 8);

  return (
    <>
      {/* Main Category Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            {
              icon: ShoppingBag,
              label: "Products",
              color: "bg-gray-100 text-gray-700 hover:bg-gray-200",
            },
            {
              icon: UtensilsCrossed,
              label: "Food",
              color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
            },
            {
              icon: Key,
              label: "Rentals",
              color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
            },
            {
              icon: Wrench,
              label: "Services",
              color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
            },
            {
              icon: Recycle,
              label: "Used Goods",
              color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
            },
            {
              icon: Gavel,
              label: "Auctions",
              color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
            },
            {
              icon: Users,
              label: "Local Community",
              color: "bg-green-100 text-green-700 hover:bg-green-200",
            },
            {
              icon: Calendar,
              label: "Events",
              color: "bg-teal-100 text-teal-700 hover:bg-teal-200",
            },
          ].map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.label}
                onClick={() => handleCategoryChange(category.label)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  activeCategory === category.label
                    ? "bg-green-500 text-white shadow-lg scale-105"
                    : category.color
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-category Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex flex-wrap gap-2 justify-center pb-4">
          {currentSubTabs.map((tab) => {
            const SubIcon = subCategoryIcons[activeCategory]?.[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === tab
                    ? "bg-green-500 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {SubIcon && <SubIcon className="w-4 h-4" />}
                <span className="text-sm">{tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMarketplaceItems.length > 0 ? (
          filteredMarketplaceItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => router.push("/products/")}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {item.isNew && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                    NEW
                  </div>
                )}
              </div>
              <div className="p-4 bg-white border-t-2 border-gray-200">
                <h3 className="text-sm text-gray-900 mb-1 line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-green-600">${item.price.toFixed(2)}</p>
                  {item.location && (
                    <p className="text-xs text-gray-500">{item.location}</p>
                  )}
                  {item.date && (
                    <p className="text-xs text-gray-500">{item.date}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No items found in this category</p>
          </div>
        )}
      </div>
    </>
  );
}
