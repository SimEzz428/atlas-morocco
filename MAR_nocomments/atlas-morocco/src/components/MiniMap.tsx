"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  points: [number, number][];
  legs?: [number, number][];
  height?: number;
  zoom?: number;
};

let miniMapInstanceCounter = 0;

export default function MiniMap({ points, legs = [], height = 220, zoom = 12 }: Props) {
  const [isClient, setIsClient] = useState(false);
  const [mapKey] = useState(() => `mini-map-${++miniMapInstanceCounter}`);
  const mapRef = useRef<any>(null);
  
  useEffect(() => {
    setIsClient(true);
    
    // Cleanup function to remove any existing map instances
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const center = points[0] ?? [31.6295, -7.9811]; // Marrakech fallback
  const valid = (n: number) => Number.isFinite(n);
  const safe = (pt: [number, number]) => valid(pt[0]) && valid(pt[1]);

  if (!isClient) {
    return (
      <div style={{ height }} className="bg-slate-100 rounded-lg flex items-center justify-center">
        <p className="text-slate-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div style={{ height }} className="relative">
      <MapContainer
        key={mapKey}
        ref={mapRef}
        center={safe(center) ? center : [31.6295, -7.9811]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => {
          // Map is ready
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.filter(safe).map((p, i) => (
          <Marker key={i} position={p} />
        ))}
        {legs.length > 1 && (
          <Polyline positions={legs.filter(safe)} />
        )}
      </MapContainer>
    </div>
  );
}