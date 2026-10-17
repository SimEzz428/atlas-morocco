"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { haversineDistance } from "@/features/planner/utils/geo";

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

  return (
    <div className="space-y-6">
      <Card>
        <div className="card-pad">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search cities..."
                aria-label="Search cities"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "primary" : "secondary"}
                  size="sm"
                  aria-pressed={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="city-sort" className="text-sm text-slate-600 whitespace-nowrap">Sort by:</label>
              <select
                id="city-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "popularity" | "distance")}
                className="input text-sm max-w-xs"
              >
                <option value="popularity">Popularity</option>
                <option value="name">Name</option>
                <option value="distance">Distance from Marrakech</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city, index) => (
          <Link key={city.slug} href={`/cities/${city.slug}`} className="group block" data-testid="city-card-link">
            <Card className="h-full hover-lift transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                {city.image ? (
                  <Image
                    src={city.image}
                    alt={`${city.name}, Morocco`}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                    priority={index < 3}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-amber-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              <div className="card-pad">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">{city.name}</h3>
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {city.placeCount} places
                  </span>
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{city.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-600 group-hover:text-amber-700 transition-colors">
                    Explore City
                  </span>
                  <ArrowRight className="h-4 w-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <Card>
          <div className="card-pad text-center py-12">
            <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="h3 mb-2">No Cities Found</h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your search terms or filters to find more cities.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
