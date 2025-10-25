"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  cityName: string;
}

export default function LeafletMap({ center, zoom, cityName }: LeafletMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize map once
  useEffect(() => {
    if (!isClient || !containerRef.current || mapRef.current) return;

    let isCancelled = false;

    const initializeMap = async () => {
      try {
        const L = (await import("leaflet")).default;
        leafletRef.current = L;
        
        // Fix default icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        if (isCancelled || !containerRef.current) return;

        // Ensure container has proper dimensions
        const container = containerRef.current;
        if (container.offsetHeight === 0) {
          container.style.height = '320px';
          container.style.width = '100%';
        }

        const map = L.map(container, {
          center: center,
          zoom: zoom,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          dragging: true,
          keyboard: true,
          touchZoom: true
        });

        mapRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add marker
        const marker = L.marker(center).addTo(map);
        marker.bindPopup(
          `<div class="text-center p-2">
            <h3 class="font-semibold text-lg">${cityName}</h3>
            <p class="text-sm text-gray-600">${center[0].toFixed(4)}, ${center[1].toFixed(4)}</p>
          </div>`
        );
        markerRef.current = marker;

        // Fit map to show marker properly
        map.fitBounds([[center[0] - 0.01, center[1] - 0.01], [center[0] + 0.01, center[1] + 0.01]], {
          padding: [20, 20]
        });

        setIsMapReady(true);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      isCancelled = true;
      try { 
        if (mapRef.current) {
          mapRef.current.remove(); 
        }
      } catch (error) {
        console.error('Error cleaning up map:', error);
      }
      mapRef.current = null;
      markerRef.current = null;
      setIsMapReady(false);
    };
  }, [isClient, center, zoom, cityName]);

  // Update center/marker when props change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    try { 
      map.setView(center, zoom); 
      
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      
      const L = leafletRef.current;
      if (!L) return;
      
      const marker = L.marker(center).addTo(map);
      marker.bindPopup(
        `<div class="text-center p-2">
          <h3 class="font-semibold text-lg">${cityName}</h3>
          <p class="text-sm text-gray-600">${center[0].toFixed(4)}, ${center[1].toFixed(4)}</p>
        </div>`
      );
      markerRef.current = marker;
    } catch (error) {
      console.error('Error updating map:', error);
    }
  }, [center, zoom, cityName, isMapReady]);

  if (!isClient) {
    return (
      <div className="w-full h-80 bg-slate-100 rounded-xl flex items-center justify-center">
        <div className="text-slate-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-80 rounded-xl bg-slate-100" 
      style={{ minHeight: '320px' }}
    />
  );
}
