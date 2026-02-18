"use client";

import { LayoutGrid, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

type ViewMode = "grid" | "map";

interface ViewToggleProps {
  viewMode: ViewMode;
}

export function ViewToggle({ viewMode }: ViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleView = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (viewMode === "grid") {
      params.set("view", "map");
    } else {
      params.delete("view");
    }

    router.push(`/vendors?${params.toString()}`);
  };

  return (
    <Button variant="outline" size="sm" onClick={toggleView} className="gap-2">
      {viewMode === "grid" ? (
        <>
          <Map className="size-4" />
          Map View
        </>
      ) : (
        <>
          <LayoutGrid className="size-4" />
          Grid View
        </>
      )}
    </Button>
  );
}
