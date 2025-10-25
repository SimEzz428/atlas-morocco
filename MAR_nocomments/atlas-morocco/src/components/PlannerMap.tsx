"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PlannerMapProps {
  points: Array<{ id: string; lat: number; lon: number; name?: string; category?: string }>;
  height: number;
  zoom?: number;
}

export default function PlannerMap({ points, height, zoom = 10 }: PlannerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // Initialize map
      const map = L.map(mapRef.current).setView([31.6295, -7.9811], zoom);
      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      return () => {
        try {
          map.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.warn('Error removing map:', error);
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current || points.length === 0) return;

    try {
      const map = mapInstanceRef.current;

      // Clear existing markers and polyline
      markersRef.current.forEach(marker => {
        try {
          map.removeLayer(marker);
        } catch (error) {
          console.warn('Error removing marker:', error);
        }
      });
      markersRef.current = [];
      
      if (polylineRef.current) {
        try {
          map.removeLayer(polylineRef.current);
        } catch (error) {
          console.warn('Error removing polyline:', error);
        }
        polylineRef.current = null;
      }

      // Add markers for each point
      const latLngs: L.LatLng[] = [];
      
      points.forEach((point, index) => {
        try {
          // Validate coordinates
          if (typeof point.lat !== 'number' || typeof point.lon !== 'number' || 
              isNaN(point.lat) || isNaN(point.lon)) {
            console.warn(`Invalid coordinates for point ${index}:`, point);
            return;
          }

          const latLng = L.latLng(point.lat, point.lon);
          latLngs.push(latLng);

          // Create custom marker with number and category color
          const getCategoryColor = (category: string) => {
            const colors: Record<string, string> = {
              'mosque': '#8B5CF6', // Purple
              'market': '#F59E0B', // Amber
              'palace': '#DC2626', // Red
              'garden': '#10B981', // Emerald
              'museum': '#3B82F6', // Blue
              'restaurant': '#EF4444', // Red
              'cafe': '#F97316', // Orange
              'viewpoint': '#06B6D4', // Cyan
              'beach': '#0EA5E9', // Sky
              'mountain': '#6B7280', // Gray
              'desert': '#D97706', // Amber
              'medina': '#7C3AED', // Violet
              'food': '#EF4444', // Red
              'architecture': '#374151', // Gray
              'culture': '#F59E0B', // Amber
              'nature': '#10B981', // Emerald
              'shopping': '#F59E0B', // Amber
              'view': '#06B6D4', // Cyan
              'daytrip': '#8B5CF6', // Purple
            };
            return colors[category?.toLowerCase()] || '#C67C2B';
          };

          const categoryColor = getCategoryColor(point.category || 'attraction');
          
          const markerHtml = `
            <div style="width: 40px; height: 40px; background-color: ${categoryColor}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 2px solid white;">
              ${index + 1}
            </div>
          `;
          
          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker(latLng, { icon: customIcon })
            .addTo(map)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold text-slate-900">${point.name || `Point ${index + 1}`}</h3>
                <p class="text-sm text-slate-600">Stop ${index + 1}</p>
              </div>
            `);

          markersRef.current.push(marker);
        } catch (error) {
          console.error(`Error creating marker for point ${index}:`, error);
        }
      });

      // Add polyline connecting all points
      if (latLngs.length > 1) {
        try {
          const polyline = L.polyline(latLngs, {
            color: '#C67C2B',
            weight: 4,
            opacity: 0.9,
            dashArray: '8, 12',
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          polylineRef.current = polyline;
        } catch (error) {
          console.error('Error creating polyline:', error);
        }
      }

      // Fit map to show all points
      if (latLngs.length > 0) {
        try {
          const group = new (L as any).featureGroup(markersRef.current);
          map.fitBounds(group.getBounds().pad(0.1));
        } catch (error) {
          console.error('Error fitting map bounds:', error);
        }
      }
    } catch (error) {
      console.error('Error updating map points:', error);
    }
  }, [points]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: `${height}px`, width: '100%' }}
      className="rounded-lg"
    />
  );
}
