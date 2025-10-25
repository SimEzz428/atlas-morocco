
"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function CityScreen({
  city,
  places,
  categories,
}: {
  city: { name: string; lat: number; lon: number };
  places: { id: number; name: string; category: string; lat: number; lon: number }[];
  categories: Record<string, number>;
}) {
  const center = useMemo(
    () => ({ lat: city?.lat || 0, lon: city?.lon || 0 }),
    [city?.lat, city?.lon]
  );

  if (!city) {
    return <p className="p-6 text-red-500">City not found.</p>;
  }

  const tags = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  return (
    <main className="space-y-8 max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold tracking-tight">{city.name}</h1>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {tags.map(([key, count]) => (
          <span
            key={key}
            className="px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 text-sm"
          >
            {key} • {count}
          </span>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
        <Map center={center} places={places} />
      </div>

      {/* Highlights */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Highlights</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {places.map((p) => (
            <div
              key={p.id}
              className="p-4 border rounded-lg bg-white dark:bg-black/20 shadow-sm"
            >
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {p.category}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}