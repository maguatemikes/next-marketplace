"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ClearFiltersClientProps {
  variant?: "default" | "outline";
  size?: "default" | "sm";
  className?: string;
}

export function ClearFiltersClient({
  variant = "outline",
  size = "default",
  className = "",
}: ClearFiltersClientProps) {
  const router = useRouter();

  const handleClearFilters = () => {
    // Clear all filter params, keep only view mode if present
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");

    const newParams = new URLSearchParams();
    if (view) {
      newParams.set("view", view);
    }

    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClearFilters}
    >
      {size === "sm" ? "Clear" : "Clear Filters"}
    </Button>
  );
}
