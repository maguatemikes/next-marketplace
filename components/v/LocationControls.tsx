"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Loader2 } from "lucide-react";

interface LocationControlsProps {
  userLocation: { lat: number; lon: number } | null;
  setUserLocation: (location: { lat: number; lon: number } | null) => void;
  setSortBy: (sortBy: string) => void;
}

export function LocationControls({
  userLocation,
  setUserLocation,
  setSortBy,
}: LocationControlsProps) {
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualZipCode, setManualZipCode] = useState("");

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setUserLocation(newLocation);
        setLocationLoading(false);
        setLocationError(null);
        setSortBy("distance");
        console.log("📍 User location detected:", newLocation);
      },
      (error) => {
        setLocationLoading(false);
        let errorMessage = "Unable to detect your location.";

        if (error.code === 1) {
          errorMessage =
            "Location access denied. Please enable location access in your browser settings.";
        } else if (error.code === 2) {
          errorMessage =
            "Location unavailable. Please check your device's location services.";
        } else if (error.code === 3) {
          errorMessage = "Location request timed out. Please try again.";
        }

        setLocationError(errorMessage);
        setShowManualLocation(true);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 300000,
      },
    );
  };

  const handleManualLocation = async () => {
    if (!manualZipCode.trim()) {
      setLocationError("Please enter a zip code or city name");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    try {
      const query = encodeURIComponent(manualZipCode.trim());
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=us&limit=1`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "ShopLocal Marketplace Directory",
        },
      });

      const data = await response.json();

      if (data && data.length > 0) {
        const newLocation = {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };

        setUserLocation(newLocation);
        setLocationLoading(false);
        setLocationError(null);
        setShowManualLocation(false);
        setSortBy("distance");

        console.log("📍 Manual location set:", newLocation);
      } else {
        setLocationError(
          "Location not found. Please try a valid US zip code or city name.",
        );
        setLocationLoading(false);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocationError("Unable to find location. Please try again.");
      setLocationLoading(false);
    }
  };

  const clearUserLocation = () => {
    setUserLocation(null);
    setLocationError(null);
    setShowManualLocation(false);
    setManualZipCode("");
    setSortBy("featured");
    console.log("📍 User location cleared");
  };

  return (
    <>
      {/* Use My Location Button */}
      <Button
        variant="outline"
        onClick={handleUseMyLocation}
        disabled={locationLoading}
        className="rounded-lg"
      >
        {locationLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Detecting...
          </>
        ) : userLocation ? (
          <>
            <Navigation className="w-4 h-4 mr-2 text-green-600" />
            Location Set
          </>
        ) : (
          <>
            <Navigation className="w-4 h-4 mr-2" />
            Use My Location
          </>
        )}
      </Button>

      {/* Manual Location Toggle or Clear Location */}
      {userLocation ? (
        <Button
          variant="ghost"
          onClick={clearUserLocation}
          className="rounded-lg text-gray-600 hover:text-red-600"
          size="sm"
        >
          Clear Location
        </Button>
      ) : !showManualLocation ? (
        <Button
          variant="ghost"
          onClick={() => setShowManualLocation(true)}
          className="rounded-lg text-gray-600 hover:text-gray-900"
          size="sm"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Enter Zip Code
        </Button>
      ) : null}

      {/* Manual Location Input */}
      {showManualLocation && !userLocation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg text-gray-900 mb-2">Enter Your Location</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your zip code or city to see distances to businesses
            </p>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Enter zip code or city..."
                value={manualZipCode}
                onChange={(e) => setManualZipCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualLocation()}
                className="flex-1 rounded-lg"
                disabled={locationLoading}
              />
              <Button
                onClick={handleManualLocation}
                disabled={locationLoading || !manualZipCode.trim()}
                className="rounded-lg bg-green-600 hover:bg-green-700"
              >
                {locationLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Set"
                )}
              </Button>
            </div>
            {locationError && (
              <p className="text-xs text-red-600 mb-4">{locationError}</p>
            )}
            <Button
              variant="outline"
              onClick={() => setShowManualLocation(false)}
              className="w-full rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
