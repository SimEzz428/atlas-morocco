import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import ExploreMap from "@/features/explorer/components/ExploreMap";
import { CITIES } from "@/data/cities";
import { getCityCover, unsplashImage } from "@/data/cityImages";

export const metadata: Metadata = {
  title: "Map",
  description: "See Morocco's cities on a map and jump straight into each city guide.",
};

export default function ExplorePage() {
  const cities = CITIES.map(({ slug, name, lat, lon, description, places }) => ({
    slug,
    name,
    lat,
    lon,
    description,
    placeCount: places.length,
  }));
  // North to south, so the list reads in the same order as the map.
  const byLatitude = [...cities].sort((a, b) => b.lat - a.lat);

  return (
    <div className="relative h-[calc(100vh-4rem)] min-h-[520px] w-full">
      <ExploreMap cities={cities} />

      {/* Desktop: floating city list */}
      <aside className="absolute bottom-4 left-4 top-4 z-[500] hidden w-80 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white/95 shadow-lg backdrop-blur-md lg:flex">
        <div className="border-b border-stone-100 p-5">
          <p className="eyebrow">Map</p>
          <h1 className="h3 mt-1">Morocco&apos;s cities</h1>
          <p className="mt-1 text-sm text-stone-500">Tap a pin for a summary, or pick a city below.</p>
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {byLatitude.map((city) => {
            const cover = getCityCover(city.slug);
            return (
              <li key={city.slug}>
                <Link href={`/cities/${city.slug}`} className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-stone-50">
                  <span className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-sand-200">
                    {cover && <Image src={unsplashImage(cover, 120, 120)} alt="" fill sizes="48px" className="object-cover" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-stone-900">{city.name}</span>
                    <span className="block text-xs text-stone-500">{city.placeCount} places</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-stone-300 transition-transform group-hover:translate-x-0.5 group-hover:text-stone-500" />
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Phones and tablets: swipeable city strip */}
      <nav aria-label="Cities" className="absolute inset-x-0 bottom-0 z-[500] lg:hidden">
        <div className="flex gap-2 overflow-x-auto px-4 pb-4 pt-6 scrollbar-none [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]">
          {byLatitude.map((city) => (
            <Link
              key={city.slug}
              href={`/cities/${city.slug}`}
              className="flex-none rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-md"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
