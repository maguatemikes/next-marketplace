"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface OpenNowToggleClientProps {
  id: string;
  label?: string;
}

export function OpenNowToggleClient({
  id,
  label = "Open Now",
}: OpenNowToggleClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpenNow = searchParams.get("open_now") === "true";

  const handleToggleChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (checked) {
      params.set("open_now", "true");
    } else {
      params.delete("open_now");
    }

    // Reset to page 1 when toggling
    params.delete("page");

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-between py-2 border-t border-gray-100 pt-4">
      <Label
        htmlFor={id}
        className="cursor-pointer text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Switch
        id={id}
        checked={isOpenNow}
        onCheckedChange={handleToggleChange}
      />
    </div>
  );
}
