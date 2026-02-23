"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-4 py-2  text-black rounded-lg cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm">Return to Directory</span>
    </button>
  );
}
