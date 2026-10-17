"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface PlannerMapProps {
  points: Array<{ id: string; lat: number; lon: number; name?: string; category?: string }>;
  // Pixel height; fills the parent when omitted.
  height?: number;
}

const MOROCCO_CENTER: [number, number] = [31.7, -7.1];

// Matches the numbered stop badges in the itinerary (brand-600).
const MARKER_COLOR = '#B84D28';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export default function PlannerMap({ points, height }: PlannerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current).setView(MOROCCO_CENTER, 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const valid = points.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon));
    if (valid.length === 0) {
      map.setView(MOROCCO_CENTER, 5, { animate: false });
      return;
    }

    const latLngs = valid.map((p) => L.latLng(p.lat, p.lon));
    if (latLngs.length > 1) {
      L.polyline(latLngs, { color: MARKER_COLOR, weight: 4, opacity: 0.9, dashArray: '8, 12', lineCap: 'round', lineJoin: 'round' }).addTo(layer);
    }

    valid.forEach((point, index) => {
      const icon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:${MARKER_COLOR};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,.25);border:2px solid #fff">${index + 1}</div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker(latLngs[index]!, { icon, title: point.name })
        .bindPopup(`<strong>${escapeHtml(point.name || `Stop ${index + 1}`)}</strong><br><span style="color:#64748b">Stop ${index + 1}</span>`)
        .addTo(layer);
    });

    // No animation: navigating away mid-zoom makes Leaflet throw after the map is removed.
    if (latLngs.length === 1) {
      map.setView(latLngs[0]!, 14, { animate: false });
    } else {
      map.fitBounds(L.latLngBounds(latLngs).pad(0.15), { maxZoom: 15, animate: false });
    }
  }, [points]);

  return <div ref={containerRef} style={{ height: height ? `${height}px` : '100%', width: '100%' }} />;
}
