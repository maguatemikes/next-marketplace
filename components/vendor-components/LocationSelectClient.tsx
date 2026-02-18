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

interface LocationSelectClientProps {
  id: string;
  label?: string;
}

export function LocationSelectClient({
  id,
  label = "location",
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
          <SelectItem value="new-york">New York</SelectItem>
          <SelectItem value="los-angeles">Los Angeles</SelectItem>
          <SelectItem value="chicago">Chicago</SelectItem>
          <SelectItem value="san-francisco">San Francisco</SelectItem>
          <SelectItem value="boston">Boston</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
