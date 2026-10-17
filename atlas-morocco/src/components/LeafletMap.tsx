"use client";

import { useEffect, useRef } from "react";
import type { LayerGroup, Map as LeafletMapInstance } from "leaflet";

export type MapMarker = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  category?: string;
};

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  cityName: string;
  markers?: MapMarker[];
  // Marker shown with an accent colour, e.g. the place the user just clicked.
  highlightedId?: string;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export default function LeafletMap({ center, zoom, cityName, markers = [], highlightedId }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const [lat, lon] = center;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, { scrollWheelZoom: false }).setView([lat, lon], zoom);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }
      const map = mapRef.current;
      const layer = layerRef.current!;
      layer.clearLayers();

      const points = markers.length > 0 ? markers : [{ id: "city", name: cityName, lat, lon }];
      for (const m of points) {
        const highlighted = m.id === highlightedId;
        L.circleMarker([m.lat, m.lon], {
          radius: highlighted ? 10 : 7,
          color: "#ffffff",
          weight: 2,
          fillColor: highlighted ? "#2563eb" : "#C67C2B",
          fillOpacity: 0.95,
        })
          .bindPopup(
            `<strong>${escapeHtml(m.name)}</strong>${m.category ? `<br><span style="color:#64748b;text-transform:capitalize">${escapeHtml(m.category)}</span>` : ""}`
          )
          .addTo(layer);
      }

      // Frame the in-city places; far-away day trips would otherwise zoom the map out too much.
      const local = points.filter((p) => p.category !== "daytrip");
      const framed = local.length > 1 ? local : points;
      // No animation: the map can unmount mid-zoom (e.g. switching tabs), which makes Leaflet throw.
      if (framed.length > 1) {
        map.fitBounds(L.latLngBounds(framed.map((p) => [p.lat, p.lon] as [number, number])), { padding: [30, 30], maxZoom: 15, animate: false });
      } else {
        map.setView([lat, lon], zoom, { animate: false });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lat, lon, zoom, cityName, markers, highlightedId]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[320px] rounded-xl bg-slate-100 relative z-0"
      role="region"
      aria-label={`Map of ${cityName}`}
    />
  );
}
