"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchInputClientProps {
  id: string;
  label?: string;
}

export function SearchInputClient({
  id,
  label = "Search",
}: SearchInputClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";

  // Local state for immediate UI updates
  const [searchValue, setSearchValue] = useState(currentSearch);

  // Sync local state with URL on mount/URL change
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // Handle search execution
  const handleSearch = () => {
    // Only update if searchValue is different from URL
    if (searchValue === currentSearch) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (searchValue.trim() === "") {
      params.delete("search");
    } else {
      params.set("search", searchValue.trim());
    }

    // Reset to page 1 when searching
    params.delete("page");

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
        <Input
          id={id}
          type="text"
          placeholder="Search businesses... (Press Enter)"
          className="pl-10 h-10 bg-gray-50"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
