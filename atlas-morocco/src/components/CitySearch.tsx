"use client";

import { useState, useMemo } from "react";
import { Search, Filter, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

interface City {
  id: string;
  slug: string;
  name: string;
  lat: number;
  lon: number;
  image?: string;
}

interface CitySearchProps {
  cities: City[];
}

export default function CitySearch({ cities }: CitySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "popularity" | "distance">("popularity");

  const categories = [
    { id: "all", name: "All Cities", count: cities.length },
    { id: "imperial", name: "Imperial Cities", count: cities.filter(c => ["marrakech", "fes", "meknes", "rabat"].includes(c.slug)).length },
    { id: "coastal", name: "Coastal Cities", count: cities.filter(c => ["essaouira", "casablanca", "agadir", "tangier"].includes(c.slug)).length },
    { id: "mountain", name: "Mountain Cities", count: cities.filter(c => ["chefchaouen", "ouarzazate"].includes(c.slug)).length },
  ];

  const filteredCities = useMemo(() => {
    let filtered = cities;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      switch (selectedCategory) {
        case "imperial":
          filtered = filtered.filter(c => ["marrakech", "fes", "meknes", "rabat"].includes(c.slug));
          break;
        case "coastal":
          filtered = filtered.filter(c => ["essaouira", "casablanca", "agadir", "tangier"].includes(c.slug));
          break;
        case "mountain":
          filtered = filtered.filter(c => ["chefchaouen", "ouarzazate"].includes(c.slug));
          break;
      }
    }

    // Sort cities
    switch (sortBy) {
      case "name":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "popularity":
        // Sort by predefined popularity order
        const popularityOrder = ["marrakech", "fes", "casablanca", "rabat", "essaouira", "chefchaouen", "tangier", "agadir", "meknes", "ouarzazate"];
        filtered = filtered.sort((a, b) => {
          const aIndex = popularityOrder.indexOf(a.slug);
          const bIndex = popularityOrder.indexOf(b.slug);
          return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
        });
        break;
      case "distance":
        // Sort by distance from Marrakech (center of Morocco)
        filtered = filtered.sort((a, b) => {
          const distanceA = Math.sqrt(Math.pow(a.lat - 31.6295, 2) + Math.pow(a.lon - (-7.9811), 2));
          const distanceB = Math.sqrt(Math.pow(b.lat - 31.6295, 2) + Math.pow(b.lon - (-7.9811), 2));
          return distanceA - distanceB;
        });
        break;
    }

    return filtered;
  }, [cities, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <div className="card-pad">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "popularity" | "distance")}
                className="input text-sm"
              >
                <option value="popularity">Popularity</option>
                <option value="name">Name</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <Link key={city.slug} href={`/cities/${city.slug}`} className="group block" data-testid="city-card-link">
            <Card className="overflow-hidden hover-lift transition-all duration-300">
              {/* City Image */}
              <div className="relative h-48 overflow-hidden">
                {city.image ? (
                  <img
                    src={city.image}
                    alt={`${city.name} cityscape`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-amber-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Removed rating badge */}
              </div>

              {/* City Info */}
              <div className="card-pad">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">{city.name}</h3>
                  <div className="inline-flex items-center gap-1 rounded-full border font-medium px-3 py-1 text-sm bg-amber-50 text-amber-700 border-amber-200">Morocco</div>
                </div>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {getCityDescription(city.name)}
                </p>

                {/* Quick Stats */}
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>2-3 days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>15+ places</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-4 flex items-center justify-between">
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

      {/* No Results */}
      {filteredCities.length === 0 && (
        <Card>
          <div className="card-pad text-center py-12">
            <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="h3 mb-2">No Cities Found</h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your search terms or filters to find more cities.
            </p>
            <Button variant="secondary" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}>
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function getCityDescription(cityName: string): string {
  switch (cityName) {
    case "Marrakech":
      return "The Red City with vibrant souks, stunning palaces, and the iconic Jemaa el-Fnaa square.";
    case "Fès":
      return "Morocco's spiritual and cultural capital, home to the ancient Fes el-Bali medina.";
    case "Essaouira":
      return "A charming coastal town known for its artistic heritage and beautiful beaches.";
    case "Casablanca":
      return "Morocco's economic capital featuring the magnificent Hassan II Mosque.";
    case "Chefchaouen":
      return "The enchanting Blue Pearl nestled in the Rif Mountains.";
    case "Rabat":
      return "The elegant capital city with royal palaces and historic sites.";
    case "Tangier":
      return "The bustling port city at the gateway to Africa.";
    case "Agadir":
      return "A vibrant coastal city known for its beautiful sandy beaches.";
    case "Meknes":
      return "One of Morocco's imperial cities with grand gates and historic ruins.";
    case "Ouarzazate":
      return "The 'Door of the Desert' known for its film studios and kasbahs.";
    default:
      return "A captivating Moroccan destination waiting to be explored.";
  }
}
