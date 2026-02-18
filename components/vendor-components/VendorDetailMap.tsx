"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface VendorDetailMapProps {
  latitude?: string | number;
  longitude?: string | number;
  title: string;
  address: string;
}

export function VendorDetailMap({
  latitude,
  longitude,
  title,
  address,
}: VendorDetailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const lat = latitude ? parseFloat(String(latitude)) : null;
  const lng = longitude ? parseFloat(String(longitude)) : null;

  const hasValidCoordinates =
    lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !hasValidCoordinates)
      return;

    let mounted = true;

    const loadLeaflet = async () => {
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

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const L = (window as any).L;

      if (!L || !mounted) {
        console.error("Leaflet failed to load");
        return;
      }

      // Wait a bit for Leaflet CSS to be fully applied
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Initialize map
      if (!mapInstanceRef.current && mapRef.current && mounted && lat && lng) {
        try {
          const map = L.map(mapRef.current).setView([lat, lng], 15);
          mapInstanceRef.current = map;

          // Add OpenStreetMap tiles
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
          }).addTo(map);

          // Create custom green marker icon
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
                <!-- Store Icon -->
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
                ">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 7v1a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7"/>
                    <path d="M13 21V11h-2v10"/>
                    <path d="M2 3h20v4H2z"/>
                  </svg>
                </div>
              </div>
            `,
            iconSize: [40, 50],
            iconAnchor: [20, 50],
            popupAnchor: [0, -50],
          });

          // Add marker with popup
          L.marker([lat, lng], {
            icon: customIcon,
          })
            .bindPopup(
              `
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${title}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">📍 ${address}</p>
              </div>
            `,
            )
            .addTo(map);

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
        setIsMapReady(false);
      }
    };
  }, [hasValidCoordinates, lat, lng, title, address]);

  // If no valid coordinates, show placeholder
  if (!hasValidCoordinates) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <div className="aspect-[21/9] bg-gray-100 relative flex items-center justify-center">
          <div className="text-center p-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-950 mb-2">No Location Data</h3>
            <p className="text-sm text-gray-500">
              Location coordinates not available for this business
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      <div
        ref={mapRef}
        className="aspect-[21/9] w-full"
        style={{
          minHeight: "300px",
        }}
      />
      {!isMapReady && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
