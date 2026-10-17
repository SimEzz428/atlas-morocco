"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface PlannerMapProps {
  points: Array<{ id: string; lat: number; lon: number; name?: string; category?: string }>;
  height: number;
}

const MOROCCO_CENTER: [number, number] = [31.7, -7.1];

const CATEGORY_COLORS: Record<string, string> = {
  mosque: '#8B5CF6',
  market: '#F59E0B',
  souk: '#F59E0B',
  palace: '#DC2626',
  garden: '#10B981',
  museum: '#3B82F6',
  restaurant: '#EF4444',
  cafe: '#F97316',
  viewpoint: '#06B6D4',
  view: '#06B6D4',
  beach: '#0EA5E9',
  medina: '#7C3AED',
  food: '#EF4444',
  architecture: '#374151',
  culture: '#F59E0B',
  nature: '#10B981',
  shopping: '#F59E0B',
  daytrip: '#8B5CF6',
};

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
      L.polyline(latLngs, { color: '#C67C2B', weight: 4, opacity: 0.9, dashArray: '8, 12', lineCap: 'round', lineJoin: 'round' }).addTo(layer);
    }

    valid.forEach((point, index) => {
      const color = CATEGORY_COLORS[point.category?.toLowerCase() ?? ''] ?? '#C67C2B';
      const icon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:${color};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,.25);border:2px solid #fff">${index + 1}</div>`,
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

  return <div ref={containerRef} style={{ height: `${height}px`, width: '100%' }} />;
}
