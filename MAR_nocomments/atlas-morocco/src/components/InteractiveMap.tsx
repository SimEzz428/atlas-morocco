"use client";

import LeafletMap from "./LeafletMap";

interface InteractiveMapProps {
  center: [number, number];
  zoom?: number;
  height?: number;
  cityName?: string;
  className?: string;
}

export default function InteractiveMap({ 
  center, 
  zoom = 12, 
  height = 320, 
  cityName = "City",
  className = ""
}: InteractiveMapProps) {
  return (
    <div style={{ height }} className={`rounded-lg overflow-hidden ${className}`}>
      <LeafletMap 
        center={center}
        zoom={zoom}
        cityName={cityName}
      />
    </div>
  );
}
