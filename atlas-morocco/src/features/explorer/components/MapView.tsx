"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type CityPoint = {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  description: string;
  placeCount: number;
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Static image imports are objects under webpack but plain URL strings under Turbopack.
const assetUrl = (img: string | { src: string }) => (typeof img === "string" ? img : img.src);

const icon = L.icon({
  iconUrl: assetUrl(markerIcon),
  iconRetinaUrl: assetUrl(markerIcon2x),
  shadowUrl: assetUrl(markerShadow),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapView({ cities }: { cities: CityPoint[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current).setView([31.7, -7.6], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const markers = cities.map((city) =>
      L.marker([city.lat, city.lon], { icon, title: city.name, alt: city.name })
        .bindPopup(
          `<div style="min-width:200px">
            <h3 style="font-weight:600;font-size:16px;margin:0 0 4px">${escapeHtml(city.name)}</h3>
            <p style="margin:0 0 8px;color:#475569">${escapeHtml(city.description)}</p>
            <p style="margin:0 0 10px;color:#64748b;font-size:12px">${city.placeCount} places to explore</p>
            <a href="/cities/${encodeURIComponent(city.slug)}" style="display:inline-block;padding:6px 12px;border-radius:8px;background:#d97706;color:#fff;text-decoration:none">Open city guide</a>
          </div>`,
          { maxWidth: 300 }
        )
        .addTo(map)
    );

    if (markers.length) {
      map.fitBounds(L.featureGroup(markers).getBounds().pad(0.2), { animate: false });
    }

    return () => {
      map.remove();
    };
  }, [cities]);

  return <div ref={containerRef} className="w-full h-full relative z-0" role="region" aria-label="Map of Moroccan cities" />;
}
