"use client";

import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MarkerPopup,
  MapRoute,
  MarkerLabel,
  type MapRef,
} from "@/components/ui/map";
import { useState, useEffect, useRef } from "react";

/**
 * Footer Component
 * Comprehensive footer with multiple sections:
 * - Company info and logo
 * - Quick links navigation
 * - Customer service links
 * - Newsletter signup with interactive map
 * - Social media links
 * - Copyright and legal links
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const [userLocation, setUserLocation] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const mapRef = useRef<MapRef>(null);
  const hasAttemptedLocation = useRef(false);

  // Destination coordinates - Wholesale For Everyone store
  const destination = {
    name: "Wholesale For Everyone",
    longitude: 123.8818,
    latitude: 10.2804,
    address: "2402 Sylon Blvd, Hainesport, NJ 08036, USA",
    phone: "+1 800-355-1131",
    hours: "Mon-Fri: 9:00 AM – 5:00 PM",
    website: "WholesaleForEveryone.com",
  };

  // Route state
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    [],
  );
  const [routeInfo, setRouteInfo] = useState<{
    duration: number;
    distance: number;
  } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Auto-detect location on mount
  useEffect(() => {
    if (hasAttemptedLocation.current) return;
    hasAttemptedLocation.current = true;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          };
          setUserLocation(coords);
          setIsDetecting(false);

          // Fly map to user location
          mapRef.current?.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 12,
            duration: 2000,
          });
        },
        (error) => {
          console.log(
            "Location detection declined or unavailable:",
            error.message,
          );
          setIsDetecting(false);
          // Silently fall back to Berlin - no alert needed
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    } else {
      console.log("Geolocation not supported");
      setIsDetecting(false);
    }
  }, []);

  // Fetch route when user location is available
  useEffect(() => {
    if (!userLocation) {
      setRouteCoordinates([]);
      setRouteInfo(null);
      return;
    }

    async function fetchRoute() {
      // ✅ Capture userLocation in a const to satisfy TypeScript
      const currentUserLocation = userLocation;
      if (!currentUserLocation) return;

      setIsLoadingRoute(true);
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${currentUserLocation.longitude},${currentUserLocation.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`,
        );
        const data = await response.json();

        if (data.routes?.length > 0) {
          const route = data.routes[0];
          setRouteCoordinates(route.geometry.coordinates);
          setRouteInfo({
            duration: route.duration,
            distance: route.distance,
          });

          // Calculate bounds to fit both markers and the route
          const lngs = [currentUserLocation.longitude, destination.longitude];
          const lats = [currentUserLocation.latitude, destination.latitude];

          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);

          // Fit map to show both markers with padding
          mapRef.current?.fitBounds(
            [
              [minLng, minLat], // Southwest corner
              [maxLng, maxLat], // Northeast corner
            ],
            {
              padding: { top: 50, bottom: 50, left: 50, right: 50 },
              duration: 2000,
            },
          );
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      } finally {
        setIsLoadingRoute(false);
      }
    }

    fetchRoute();
  }, [userLocation]);

  const handleLocate = (coords: { longitude: number; latitude: number }) => {
    setUserLocation(coords);
    console.log("User located at:", coords);
  };

  // Format helpers
  const formatDuration = (seconds: number): string => {
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const shopLinks = [
    { label: "All Products", path: "#products" },
    { label: "Featured Vendors", path: "#vendors" },
    { label: "New Arrivals", path: "#new" },
    { label: "Best Sellers", path: "#bestsellers" },
    { label: "Deals & Offers", path: "#deals" },
  ];

  const supportLinks = [
    { label: "Help Center", path: "#help" },
    { label: "Track Order", path: "#track" },
    { label: "Returns & Exchanges", path: "#returns" },
    { label: "Shipping Info", path: "#shipping" },
    { label: "Contact Us", path: "#contact" },
  ];

  const companyLinks = [
    { label: "About Us", path: "#about" },
    { label: "Careers", path: "#careers" },
    { label: "Press", path: "#press" },
    { label: "Blog", path: "#blog" },
    { label: "Become a Seller", path: "#sell" },
  ];

  return (
    <footer className="bg-[#272621] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold mb-4">BerlinsMarket</div>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted wholesale marketplace connecting resellers with
              verified suppliers. Access authentic products at true wholesale
              prices across all categories.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Berlin, Germany</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+49 (0) 30 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@berlinsmarket.com</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Shop</h3>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Customer Service</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter + Map Section - 2 Columns */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Newsletter Column */}
            <div>
              <h3 className="font-semibold mb-2 text-white">
                Subscribe to our Newsletter
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Get updates on new wholesale products, volume discounts, and
                verified supplier highlights.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>

              {/* Location Display */}
              {userLocation && (
                <div className="text-sm text-gray-300 bg-white/5 p-3 rounded-md">
                  <p className="font-semibold mb-1">📍 Your Location</p>
                  <p className="text-xs">
                    {userLocation.latitude.toFixed(4)},{" "}
                    {userLocation.longitude.toFixed(4)}
                  </p>
                </div>
              )}
            </div>

            {/* Map Column */}
            <div className="h-[300px] rounded-lg overflow-hidden border border-gray-600">
              <Map center={[13.404954, 52.520008]} zoom={11} ref={mapRef}>
                <MapControls
                  position="top-right"
                  showLocate={true}
                  onLocate={handleLocate}
                />

                {/* Route - Render first so markers appear on top */}
                {routeCoordinates.length > 0 && (
                  <MapRoute
                    coordinates={routeCoordinates}
                    color="#3b82f6"
                    width={4}
                    opacity={0.8}
                  />
                )}

                {/* User Location Marker (Start) - Green pulsing marker */}
                {userLocation && (
                  <MapMarker
                    longitude={userLocation.longitude}
                    latitude={userLocation.latitude}
                  >
                    <MarkerContent>
                      <div className="relative">
                        <div className="size-6 rounded-full bg-green-500 border-3 border-white shadow-lg animate-pulse" />
                        <div className="absolute inset-0 size-6 rounded-full bg-green-500/30 animate-ping" />
                      </div>
                    </MarkerContent>
                    <MarkerLabel position="top">You are here</MarkerLabel>
                    <MarkerTooltip>📍 Your Location</MarkerTooltip>
                    <MarkerPopup>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          Your Location
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {userLocation.latitude.toFixed(4)},{" "}
                          {userLocation.longitude.toFixed(4)}
                        </p>
                        {routeInfo && (
                          <div className="mt-2 pt-2 border-t space-y-1">
                            <p className="text-xs font-medium">
                              Route to {destination.name}:
                            </p>
                            <p className="text-xs text-muted-foreground">
                              🚗 {formatDistance(routeInfo.distance)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ⏱️ {formatDuration(routeInfo.duration)}
                            </p>
                          </div>
                        )}
                      </div>
                    </MarkerPopup>
                  </MapMarker>
                )}

                {/* Destination Marker (End) - Red marker */}
                <MapMarker
                  longitude={destination.longitude}
                  latitude={destination.latitude}
                >
                  <MarkerContent>
                    <div className="size-6 rounded-full bg-red-500 border-3 border-white shadow-lg" />
                  </MarkerContent>
                  <MarkerLabel position="bottom">
                    {destination.name}
                  </MarkerLabel>
                  <MarkerTooltip>🏪 {destination.name}</MarkerTooltip>
                  <MarkerPopup>
                    <div className="space-y-2 min-w-[220px]">
                      <div>
                        <p className="font-semibold text-foreground">
                          {destination.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {destination.address}
                        </p>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex items-start gap-1.5">
                          <Phone className="size-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                          <a
                            href={`tel:${destination.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {destination.phone}
                          </a>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <MapPin className="size-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {destination.hours}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Mail className="size-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                          <a
                            href={`https://${destination.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {destination.website}
                          </a>
                        </div>
                      </div>

                      <div className="pt-2 border-t text-xs bg-amber-50 dark:bg-amber-900/20 -mx-2 -mb-2 px-2 py-1.5 rounded-b">
                        <p className="text-amber-700 dark:text-amber-300 font-medium">
                          ⚠️ Appointment Required
                        </p>
                        <p className="text-amber-600 dark:text-amber-400 text-[11px] mt-0.5">
                          No walk-ins accepted
                        </p>
                      </div>

                      {routeInfo && userLocation && (
                        <div className="pt-2 border-t space-y-1">
                          <p className="text-xs font-medium">
                            Driving from your location:
                          </p>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <span>🚗 {formatDistance(routeInfo.distance)}</span>
                            <span>⏱️ {formatDuration(routeInfo.duration)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </MarkerPopup>
                </MapMarker>
              </Map>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-4">
            <a
              href="#facebook"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#twitter"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#instagram"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#youtube"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright and Legal */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>© {currentYear} BerlinsMarket. All rights reserved.</div>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              <a href="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
