"use client";

import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Region {
  id: number;
  name: string;
  slug: string;
}

interface VendorsFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  regionFilter: string;
  setRegionFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  ratingFilter: number[];
  setRatingFilter: (value: number[]) => void;
  categories: Category[];
  regions: Region[];
  availableCities: string[];
  layout: "grid" | "sidebar";
  onClearFilters?: () => void;
}

export function VendorsFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  regionFilter,
  setRegionFilter,
  cityFilter,
  setCityFilter,
  ratingFilter,
  setRatingFilter,
  categories,
  regions,
  availableCities,
  layout,
  onClearFilters,
}: VendorsFiltersProps) {
  if (layout === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-900">Search</label>
          </div>
          <Input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-50 border-0 rounded-lg h-9"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm text-gray-900">Category</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-gray-50 border-0 rounded-lg h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-900">Region</label>
          </div>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="bg-gray-50 border-0 rounded-lg h-9">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-900">City</label>
          </div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="bg-gray-50 border-0 rounded-lg h-9">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="all">All Cities</SelectItem>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-900">
              Min Rating: {ratingFilter[0]}
            </label>
          </div>
          <Slider
            value={ratingFilter}
            onValueChange={setRatingFilter}
            max={5}
            step={0.5}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  // Sidebar layout
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-900" />
          <h3 className="text-lg text-gray-900">Filters</h3>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-900">Search</label>
          </div>
          <Input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-50 border-0 rounded-lg h-9"
          />
        </div>

        <div className="h-px bg-gray-100" />

        {/* Category */}
        <div className="space-y-3">
          <label className="text-sm text-gray-900">Category</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-gray-50 border-0 rounded-lg h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Region */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-900">Region</label>
          </div>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="bg-gray-50 border-0 rounded-lg h-9">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-px bg-gray-100" />

        {/* City */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-900">City</label>
          </div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="bg-gray-50 border-0 rounded-lg h-9">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Rating */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gray-600" />
            <label className="text-sm text-gray-900">Minimum Rating</label>
          </div>
          <Slider
            value={ratingFilter}
            onValueChange={setRatingFilter}
            max={5}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0</span>
            <div className="flex items-center gap-1">
              <span>{ratingFilter[0]}</span>
              <Star className="w-3 h-3 fill-gray-500" />
            </div>
            <span>5</span>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Clear Filters */}
        {onClearFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full rounded-lg"
          >
            Clear All Filters
          </Button>
        )}
      </div>
    </>
  );
}
