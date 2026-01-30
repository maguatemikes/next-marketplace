"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductSearchBarProps {
  search: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function ProductSearchBar({
  search,
  sortBy,
  onSearchChange,
  onSortChange,
}: ProductSearchBarProps) {
  return (
    <div className=" border-b border-gray-100 py-6 sticky top-20 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-stretch h-10">
          <div className="flex-1 relative h-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-full rounded-xl border-gray-200 bg-gray-50"
            />
          </div>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full md:w-50 rounded-xl border-gray-200 bg-gray-50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="nearest">Nearest to Me</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
