"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface CategorySelectClientProps {
  id: string;
  label?: string;
  categories: Category[];
}

export function CategorySelectClient({
  id,
  label = "Category",
  categories,
}: CategorySelectClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    // Reset to page 1 when changing category
    params.delete("page");

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-2 ">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Select value={currentCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger id={id} className="h-10 w-full bg-gray-50">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name} {category.count > 0 && `(${category.count})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
