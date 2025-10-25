
"use client";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/cities/marker-icon.png',
  iconUrl: '/cities/marker-icon.png',
  shadowUrl: '/cities/marker-shadow.png',
});

let cityMapInstanceCounter = 0;

export default function CityMap({
  center,
  places,
}: {
  center: { lat: number; lon: number };
  places: { lat: number; lon: number }[];
}) {
  const mapCenter: [number, number] = [center.lat, center.lon];
  const [isClient, setIsClient] = useState(false);
  const [mapKey] = useState(() => `city-map-${++cityMapInstanceCounter}`);
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

  if (!isClient) {
    return (
      <div style={{ height: "400px", width: "100%" }} className="rounded-2xl bg-slate-100" />
    );
  }
  
  return (
    <MapContainer
      key={mapKey}
      ref={mapRef}
      center={mapCenter}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
      whenReady={() => {
        // Map is ready
      }}
    >
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      />

      {places.map((p, i) => (
        <Marker key={i} position={[p.lat, p.lon] as [number, number]} />
      ))}

      {places.length > 1 && (
        <Polyline positions={places.map((p) => [p.lat, p.lon] as [number, number])} />
      )}
    </MapContainer>
  );
}