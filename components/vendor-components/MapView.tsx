"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { DirectoryItem } from "./DirectoryCard";

interface MapViewProps {
  items?: DirectoryItem[];
}

// Category to icon SVG mapping
const getCategoryIcon = (category: string): string => {
  const categoryLower = category.toLowerCase();

  // Map categories to SVG icons (24x24 viewBox)
  const iconMap: Record<string, string> = {
    "auto-repair":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', // Wrench
    cafes:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>', // Coffee
    daycare:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>', // Baby
    dentists:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3c0 1.5.5 2.9 1.3 4L8 15l-2-2-2 2 2 2 2-2 1.3-1.7c.7.5 1.5.7 2.7.7 2.5 0 4-1.5 4-4V5a3 3 0 0 0-3-3z"/><circle cx="12" cy="12" r="10"/></svg>', // Activity
    electricians:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', // Zap
    gyms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>', // Dumbbell
    hotels:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>', // Building/Hotel
    lawyers:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>', // Sparkles/Scale
    "pet-services":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>', // Paw
    photographers:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>', // Camera
    plumbers:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>', // Droplet
    "real-state":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', // Home
    restaurants:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>', // Utensils (using star as fallback)
    salons:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>', // Scissors
    spas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3c0 1 .5 1.9 1.3 2.5L8 13l-2-2-2 2 2 2 2-2 1.3-1.5c.7.4 1.5.5 2.7.5 2.5 0 4-1.3 4-3.5V5a3 3 0 0 0-3-3z"/><path d="M12 17.5a3 3 0 0 1 0 6.5 3 3 0 0 1 0-6.5z"/></svg>', // Flower
    sportswear:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', // Shopping Bag
  };

  // Default icon (map pin)
  const defaultIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';

  return iconMap[categoryLower] || defaultIcon;
};

export function MapView({ items = [] }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Filter vendors that have valid coordinates
  const validItems = items.filter(
    (item) =>
      item.latitude &&
      item.longitude &&
      !isNaN(parseFloat(String(item.latitude))) &&
      !isNaN(parseFloat(String(item.longitude))),
  );

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let mounted = true;

    const loadLeaflet = async () => {
      try {
        // Add CSS
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.crossOrigin = "anonymous";
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!(window as any).L) {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.crossOrigin = "anonymous";
          document.head.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        const L = (window as any).L;

        if (!L || !mounted) {
          console.error("Leaflet failed to load");
          return; // ✅ Exit early if Leaflet failed to load
        }

        // Wait a bit for Leaflet CSS to be fully applied
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Initialize map
        if (!mapInstanceRef.current && mapRef.current && mounted) {
          try {
            // Default to center of USA
            const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
            mapInstanceRef.current = map;

            // Add OpenStreetMap tiles
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap contributors",
              maxZoom: 19,
            }).addTo(map);

            // Create marker layer
            markersLayerRef.current = L.layerGroup().addTo(map);

            // Wait for map to finish loading
            map.whenReady(() => {
              if (mounted) {
                setIsMapReady(true);
              }
            });
          } catch (error) {
            console.error("Error initializing map:", error);
          }
        }
      } catch (error) {
        console.error("Error loading Leaflet:", error);
      }
    };

    loadLeaflet();

    // Cleanup on unmount
    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Error removing map:", e);
        }
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        setIsMapReady(false);
      }
    };
  }, []); // Only run once on mount

  // Update markers when items change AND map is ready
  useEffect(() => {
    const L = (window as any).L;

    // Wait for map to be ready
    if (
      !L ||
      !isMapReady ||
      !mapInstanceRef.current ||
      !markersLayerRef.current
    ) {
      return;
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    // Defensive check: ensure map is still valid
    if (!map._loaded || !map.getContainer || !map.getContainer()) {
      return;
    }

    // Clear existing markers safely
    try {
      markersLayer.clearLayers();
    } catch (e) {
      console.warn("Error clearing markers:", e);
      return;
    }

    if (validItems.length === 0) {
      // Default view if no markers
      try {
        if (map._loaded) {
          map.setView([39.8283, -98.5795], 4);
        }
      } catch (e) {
        console.warn("Error setting view:", e);
      }
      return;
    }

    // Add markers
    const bounds: any[] = [];

    validItems.forEach((item) => {
      const lat = parseFloat(String(item.latitude));
      const lng = parseFloat(String(item.longitude));

      // Skip if coordinates are invalid
      if (isNaN(lat) || isNaN(lng)) return;

      const category = item.category?.[0] || "Business";
      const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
      const iconSvg = getCategoryIcon(categorySlug);

      // Create custom icon with brand color (#F57C00) and category icon
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="position: relative; width: 40px; height: 50px;">
            <!-- Pulsing radar effect -->
            <div class="pulse-ring" style="
              position: absolute;
              top: 6px;
              left: 50%;
              transform: translateX(-50%);
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: rgba(34, 197, 94, 0.6);
              animation: pulse-radar 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            "></div>
            <style>
              @keyframes pulse-radar {
                0% {
                  transform: translateX(-50%) scale(1);
                  opacity: 1;
                }
                70% {
                  transform: translateX(-50%) scale(2);
                  opacity: 0;
                }
                100% {
                  transform: translateX(-50%) scale(2);
                  opacity: 0;
                }
              }
            </style>
            <svg width="40" height="50" viewBox="0 0 40 50" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); position: relative; z-index: 2;">
              <!-- Pin Shape with green color -->
              <path d="M20 0C11.716 0 5 6.716 5 15c0 8.284 15 35 15 35s15-26.716 15-35c0-8.284-6.716-15-15-15z" 
                fill="#22c55e" 
                stroke="white" 
                stroke-width="2"/>
              <!-- White circle background for icon -->
              <circle cx="20" cy="15" r="9" fill="white"/>
            </svg>
            <!-- Category Icon -->
            <div style="
              position: absolute;
              top: 6px;
              left: 50%;
              transform: translateX(-50%);
              color: #22c55e;
              pointer-events: none;
              user-select: none;
              width: 18px;
              height: 18px;
              z-index: 3;
            ">${iconSvg}</div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50],
      });

      const location = item.location?.[0] || "Location not specified";
      const rating = item.rating || "N/A";

      try {
        const leafletMarker = L.marker([lat, lng], {
          icon: customIcon,
        })
          .bindPopup(
            `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${item.title}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${category}</p>
              <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
                <span style="color: #f59e0b; font-size: 12px;">★</span>
                <span style="font-size: 12px;">${rating}</span>
              </div>
              <p style="margin: 0; font-size: 11px; color: #999;">📍 ${location}</p>
            </div>
          `,
          )
          .addTo(markersLayer);

        bounds.push([lat, lng]);
      } catch (e) {
        console.warn("Error adding marker:", e);
      }
    });

    // Fit map to show all markers - with extra safety checks
    if (bounds.length > 0) {
      try {
        // Small delay to ensure markers are rendered
        setTimeout(() => {
          if (
            map._loaded &&
            mapInstanceRef.current &&
            map.getContainer &&
            map.getContainer()
          ) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
          }
        }, 100);
      } catch (e) {
        console.warn("Error fitting bounds:", e);
      }
    }
  }, [validItems, isMapReady]); // Update when items change OR map becomes ready

  // If no valid locations, show empty state
  if (validItems.length === 0) {
    return (
      <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="h-[600px] flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-950 mb-2 font-semibold">
              No Location Data
            </h3>
            <p className="text-sm text-gray-500">
              Businesses on this page don't have coordinates available
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "600px",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
        }}
      />

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {isMapReady ? (
              <>
                Showing {validItems.length} location
                {validItems.length !== 1 ? "s" : ""} on map
              </>
            ) : (
              <>Loading map...</>
            )}
          </span>
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="text-xs">Click pins for details</span>
          </div>
        </div>
      </div>
    </div>
  );
}
