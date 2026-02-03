"use client";

import { MapPin } from "lucide-react";
import { LeafletMap } from "@/components/v/LeafletMap";

interface Vendor {
  id: string;
  name: string;
  specialty: string;
  categoryId?: number;
  rating: number;
  location: string;
  latitude?: string;
  longitude?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: { src?: string };
}

interface InteractiveBusinessMapProps {
  vendors: Vendor[];
  categories: Category[];
  onVendorSelect: (vendorId: string) => void;
  selectedVendorId: string | null;
}

export function InteractiveBusinessMap({
  vendors,
  categories,
  onVendorSelect,
  selectedVendorId,
}: InteractiveBusinessMapProps) {
  // Filter vendors that have valid coordinates
  const vendorsWithLocation = vendors.filter(
    (v) =>
      v.latitude &&
      v.longitude &&
      !isNaN(parseFloat(v.latitude)) &&
      !isNaN(parseFloat(v.longitude)),
  );

  if (vendorsWithLocation.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="aspect-square flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-950 mb-2">No Location Data</h3>
            <p className="text-sm text-gray-500">
              Businesses on this page dont have coordinates available
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get category icon
  const getCategoryIcon = (vendor: Vendor): string | undefined => {
    let category;
    if (vendor.categoryId) {
      category = categories.find((cat) => cat.id === vendor.categoryId);
    }

    if (!category) {
      category = categories.find(
        (cat) =>
          cat.name.toLowerCase() === vendor.specialty.toLowerCase() ||
          vendor.specialty.toLowerCase().includes(cat.name.toLowerCase()),
      );
    }

    return category?.icon?.src;
  };

  // Convert vendors to map markers
  const mapMarkers = vendorsWithLocation.map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    lat: parseFloat(vendor.latitude!),
    lng: parseFloat(vendor.longitude!),
    specialty: vendor.specialty,
    categoryIcon: getCategoryIcon(vendor),
    rating: vendor.rating,
    location: vendor.location,
  }));

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="aspect-square">
        <LeafletMap
          markers={mapMarkers}
          onMarkerClick={onVendorSelect}
          onVendorSelect={onVendorSelect}
          selectedVendorId={selectedVendorId}
        />
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Showing {vendorsWithLocation.length} location
            {vendorsWithLocation.length !== 1 ? "s" : ""} on map
          </span>
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="text-xs">Click pins to filter results</span>
          </div>
        </div>
      </div>
    </div>
  );
}
