"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { haversineDistance } from "@/features/planner/utils/geo";
import { cn } from "@/lib/utils";

interface City {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  description: string;
  placeCount: number;
  image?: string;
}

interface CitySearchProps {
  cities: City[];
}

const GROUPS: Record<string, { name: string; slugs: string[] }> = {
  imperial: { name: "Imperial Cities", slugs: ["marrakech", "fes", "meknes", "rabat"] },
  coastal: { name: "Coastal Cities", slugs: ["essaouira", "casablanca", "agadir", "tangier", "rabat"] },
  mountain: { name: "Mountains & Desert", slugs: ["chefchaouen", "ouarzazate"] },
};

const POPULARITY = ["marrakech", "fes", "casablanca", "rabat", "essaouira", "chefchaouen", "tangier", "agadir", "meknes", "ouarzazate"];
const MARRAKECH = { id: "marrakech", lat: 31.6295, lon: -7.9811 };

// Strips accents so "fes" matches "Fès".
const normalize = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function CitySearch({ cities }: CitySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "popularity" | "distance">("popularity");

  const categories = [
    { id: "all", name: "All Cities", count: cities.length },
    ...Object.entries(GROUPS).map(([id, group]) => ({
      id,
      name: group.name,
      count: cities.filter((c) => group.slugs.includes(c.slug)).length,
    })),
  ];

  const filteredCities = useMemo(() => {
    const query = normalize(searchTerm.trim());
    const group = GROUPS[selectedCategory];
    const filtered = cities.filter(
      (city) =>
        (!query || normalize(city.name).includes(query) || normalize(city.description).includes(query)) &&
        (!group || group.slugs.includes(city.slug))
    );

    const rank = (slug: string) => {
      const i = POPULARITY.indexOf(slug);
      return i === -1 ? POPULARITY.length : i;
    };
    const distance = (c: City) => haversineDistance(MARRAKECH, { id: c.slug, lat: c.lat, lon: c.lon });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "distance") return distance(a) - distance(b);
      return rank(a.slug) - rank(b.slug);
    });
  }, [cities, searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              placeholder="Search cities or what they're known for..."
              aria-label="Search cities"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 pr-10 [&::-webkit-search-cancel-button]:hidden"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="city-sort" className="whitespace-nowrap text-sm text-stone-600">Sort by:</label>
            <select
              id="city-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "popularity" | "distance")}
              className="input py-3 pr-9 sm:w-56"
            >
              <option value="popularity">Popularity</option>
              <option value="name">Name</option>
              <option value="distance">Distance from Marrakech</option>
            </select>
          </div>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter cities">
          {categories.map((category) => (
            <button
              key={category.id}
              aria-pressed={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn("chip flex-none", selectedCategory === category.id && "chip-active")}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-stone-500" aria-live="polite">
        {filteredCities.length === cities.length
          ? `${cities.length} cities`
          : `Showing ${filteredCities.length} of ${cities.length} cities`}
      </p>

      {filteredCities.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCities.map((city, index) => (
            <Link
              key={city.slug}
              href={`/cities/${city.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-shadow hover:shadow-lg"
              data-testid="city-card-link"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                {city.image ? (
                  <Image
                    src={city.image}
                    alt={`${city.name}, Morocco`}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    priority={index < 3}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-brand-100">
                    <MapPin className="h-10 w-10 text-brand-600" />
                  </div>
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-stone-800 backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5 text-brand-600" />
                  {city.placeCount} places
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-bold text-stone-900">{city.name}</h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-600">{city.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                  Explore city
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card card-pad py-14 text-center">
          <Search className="mx-auto mb-4 h-10 w-10 text-stone-300" />
          <h3 className="h4 mb-2">No Cities Found</h3>
          <p className="mb-5 text-stone-600">Try a different search, or clear the filters to see every city.</p>
          <button className="btn-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
