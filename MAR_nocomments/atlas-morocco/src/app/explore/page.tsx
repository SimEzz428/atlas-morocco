"use client";

import { useEffect, useState } from "react";
import MapView from "@/features/explorer/components/MapView";

type City = {
  id: number;
  slug: string;
  name: string;
  lat: number;
  lon: number;
};

// Direct import avoids dev "Bail out to client-side rendering" overlay

export default function ExplorePage() {
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/cities`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCities(data.cities ?? data ?? []);
          return;
        }
        // graceful fallback without throwing/console error
        console.warn(`Cities API unavailable (${res.status}). Using local list.`);
        setCities([
          { id: 1, slug: 'marrakech', name: 'Marrakech', lat: 31.6295, lon: -7.9811 },
          { id: 2, slug: 'fes', name: 'Fès', lat: 34.0331, lon: -5.0003 },
          { id: 3, slug: 'casablanca', name: 'Casablanca', lat: 33.5731, lon: -7.5898 },
          { id: 4, slug: 'rabat', name: 'Rabat', lat: 34.0209, lon: -6.8416 },
          { id: 5, slug: 'essaouira', name: 'Essaouira', lat: 31.5085, lon: -9.7595 },
          { id: 6, slug: 'chefchaouen', name: 'Chefchaouen', lat: 35.1714, lon: -5.2696 },
          { id: 7, slug: 'tangier', name: 'Tangier', lat: 35.7595, lon: -5.8340 },
          { id: 8, slug: 'agadir', name: 'Agadir', lat: 30.4278, lon: -9.5981 },
          { id: 9, slug: 'meknes', name: 'Meknes', lat: 33.8935, lon: -5.5473 },
          { id: 10, slug: 'ouarzazate', name: 'Ouarzazate', lat: 30.9333, lon: -6.9167 }
        ]);
      } catch {
        // network error fallback
        setCities([
          { id: 1, slug: 'marrakech', name: 'Marrakech', lat: 31.6295, lon: -7.9811 },
          { id: 2, slug: 'fes', name: 'Fès', lat: 34.0331, lon: -5.0003 },
          { id: 3, slug: 'casablanca', name: 'Casablanca', lat: 33.5731, lon: -7.5898 },
          { id: 4, slug: 'rabat', name: 'Rabat', lat: 34.0209, lon: -6.8416 },
          { id: 5, slug: 'essaouira', name: 'Essaouira', lat: 31.5085, lon: -9.7595 },
          { id: 6, slug: 'chefchaouen', name: 'Chefchaouen', lat: 35.1714, lon: -5.2696 },
          { id: 7, slug: 'tangier', name: 'Tangier', lat: 35.7595, lon: -5.8340 },
          { id: 8, slug: 'agadir', name: 'Agadir', lat: 30.4278, lon: -9.5981 },
          { id: 9, slug: 'meknes', name: 'Meknes', lat: 33.8935, lon: -5.5473 },
          { id: 10, slug: 'ouarzazate', name: 'Ouarzazate', lat: 30.9333, lon: -6.9167 }
        ]);
      }
    }
    load();
  }, [API_URL]);

  return (
    <main className="w-full h-[calc(100vh-64px)]">
      <MapView
        points={cities.map((c) => [c.lat, c.lon])}
        cities={cities}
        linkBuilder={(c: City) => `/cities/${c.slug}`}
      />
    </main>
  );
}