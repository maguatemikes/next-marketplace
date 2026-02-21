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

interface Location {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface LocationSelectClientProps {
  id: string;
  label?: string;
  locations: Location[];
}

export function LocationSelectClient({
  id,
  label = "City",
  locations,
}: LocationSelectClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCity = searchParams.get("location") || "all";

  const handleCityChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("location");
    } else {
      params.set("location", value);
    }

    // Reset to page 1 when changing city
    params.delete("page");

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Select value={currentCity} onValueChange={handleCityChange}>
        <SelectTrigger id={id} className="h-10 w-full bg-gray-50">
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.slug}>
              {location.name}{" "}
              <span className="text-slate-500">({location.count})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
