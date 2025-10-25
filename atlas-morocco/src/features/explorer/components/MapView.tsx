"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { MapPin, Star, Calendar, ArrowRight } from "lucide-react";

type Props = {
  points: number[][];
  cities: { name: string; slug: string }[];
  linkBuilder: (city: any) => string;
};

const center: [number, number] = [31.7, -7.6]; // Morocco center (Marrakech area)
const zoom = 6;

// Get city description for popup
function getCityDescription(cityName: string) {
  const descriptions: Record<string, string> = {
    "marrakech": "The Red City with vibrant souks and stunning palaces",
    "casablanca": "Morocco's economic capital with modern architecture",
    "fes": "The cultural heart with the world's oldest university",
    "rabat": "The elegant capital city with royal heritage",
    "agadir": "A modern beach resort with golden sands",
    "tangier": "The gateway between Europe and Africa",
    "essaouira": "A charming coastal town with artistic heritage",
    "chefchaouen": "The blue pearl of the Rif Mountains",
    "meknes": "A historic imperial city with impressive monuments",
    "ouarzazate": "The gateway to the Sahara Desert",
  };
  
  return descriptions[cityName.toLowerCase()] || "A captivating Moroccan destination";
}

// Global Leaflet instance to prevent HMR issues
let leafletInstance: any = null;
let leafletPromise: Promise<any> | null = null;

async function getLeaflet() {
  if (leafletInstance) return leafletInstance;
  if (leafletPromise) return leafletPromise;
  
  leafletPromise = import('leaflet').then((L) => {
    // Fix for default Leaflet icons not showing up
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/cities/marker-icon-2x.png',
      iconUrl: '/cities/marker-icon.png',
      shadowUrl: '/cities/marker-shadow.png',
    });
    leafletInstance = L;
    return L;
  });
  
  return leafletPromise;
}

export default function MapView({ points, cities, linkBuilder }: Props) {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize map once
  useEffect(() => {
    if (!isClient || !containerRef.current || mapRef.current) return;
    
    getLeaflet().then((L) => {
      const map = L.map(containerRef.current).setView(center, zoom);
      mapRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
    });
    
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {}
        mapRef.current = null;
      }
    };
  }, [isClient]);

  // Update markers when points or cities change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isClient) return;
    
    getLeaflet().then((L) => {
      // clear old markers
      markersRef.current.forEach((m) => {
        try { map.removeLayer(m); } catch {}
      });
      markersRef.current = [];

      const latLngs: any[] = [];
      points.forEach((p, i) => {
        const lat = p[0];
        const lon = p[1];
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
        const latLng = L.latLng(lat, lon);
        latLngs.push(latLng);
        const marker = L.marker(latLng).addTo(map);
        const name = cities[i]?.name || 'Unknown City';
        const html = `
          <div class="p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-flex h-2 w-2 rounded-full bg-amber-600"></span>
              <h3 class="font-semibold text-slate-900 text-base">${name}</h3>
            </div>
            <p class="text-sm text-slate-600 mb-3">${getCityDescription(name)}</p>
            <div class="flex">
              <a href="${cities[i] ? linkBuilder(cities[i]) : '#'}" class="px-3 py-2 rounded-lg bg-amber-600 text-white text-sm">Open city</a>
            </div>
          </div>`;
        marker.bindPopup(html, { maxWidth: 300 });
        markersRef.current.push(marker);
      });

      if (latLngs.length) {
        const group = new (L as any).featureGroup(markersRef.current);
        try { map.fitBounds(group.getBounds().pad(0.2)); } catch {}
      }
    });
  }, [points, cities, linkBuilder, isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading map…</p>
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}