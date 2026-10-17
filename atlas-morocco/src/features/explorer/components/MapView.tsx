"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

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

// Terracotta map pin (brand-600) drawn as SVG so it matches the site palette.
const icon = L.divIcon({
  className: "",
  html: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))"><path d="M15 1C7.3 1 1 7.2 1 14.9 1 25.3 15 39 15 39s14-13.7 14-24.1C29 7.2 22.7 1 15 1z" fill="#B84D28" stroke="#fff" stroke-width="2"/><circle cx="15" cy="15" r="5" fill="#fff"/></svg>`,
  iconSize: [30, 40],
  iconAnchor: [15, 39],
  popupAnchor: [0, -34],
});

export default function MapView({ cities }: { cities: CityPoint[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Zoom buttons go top-right: the floating city list covers the left edge on desktop.
    const map = L.map(containerRef.current, { zoomControl: false }).setView([31.7, -7.6], 6);
    L.control.zoom({ position: "topright" }).addTo(map);
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
            <a href="/cities/${encodeURIComponent(city.slug)}" style="display:inline-block;padding:6px 12px;border-radius:8px;background:#B84D28;color:#fff;text-decoration:none">Open city guide</a>
          </div>`,
          { maxWidth: 300 }
        )
        .addTo(map)
    );

    if (markers.length) {
      // Keep pins clear of the floating city list (desktop) or the city strip (phones).
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      map.fitBounds(L.featureGroup(markers).getBounds(), {
        animate: false,
        paddingTopLeft: [desktop ? 360 : 30, 40],
        paddingBottomRight: [40, desktop ? 40 : 90],
      });
    }

    return () => {
      map.remove();
    };
  }, [cities]);

  return <div ref={containerRef} className="w-full h-full relative z-0" role="region" aria-label="Map of Moroccan cities" />;
}
