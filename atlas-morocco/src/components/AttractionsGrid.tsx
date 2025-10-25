"use client";

import { useState, useEffect } from "react";
import { Search, Grid, List, MapPin, Clock, DollarSign, Calendar, Heart, Share2, Star } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Attraction } from "@/data/attractions";

interface AttractionsGridProps {
  cityName: string;
  attractions: Attraction[];
  onAddToPlan?: (id: string) => void;
  planItems?: string[];
}

export default function AttractionsGrid({
  cityName,
  attractions,
  onAddToPlan,
  planItems = [],
}: AttractionsGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [attractionImages, setAttractionImages] = useState<Record<string, string>>({});

  // Fetch images for attractions
  useEffect(() => {
    const fetchImages = async () => {
      for (const attraction of attractions) {
        if (!attraction.imageUrl && !attractionImages[attraction.id]) {
          try {
            const query = `${encodeURIComponent(attraction.name)} ${cityName} morocco`;
            const url = `/api/unsplash?q=${query}&per_page=1&w=600&h=400`;
            
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              if (data.images?.[0]?.src) {
                setAttractionImages(prev => ({ 
                  ...prev, 
                  [attraction.id]: data.images[0].src 
                }));
              }
            }
          } catch (error) {
            console.error(`Error fetching image for ${attraction.name}:`, error);
          }
        }
      }
    };

    if (attractions.length > 0) {
      fetchImages();
    }
  }, [attractions, cityName]);

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(attractions.map(a => a.category)))];

  // Filter and sort attractions
  const filteredAttractions = attractions
    .filter(attraction => {
      const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attraction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || attraction.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      return a.name.localeCompare(b.name);
    });

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: "🍽️",
      architecture: "🏛️",
      culture: "🎭",
      nature: "🌿",
      shopping: "🛍️",
      museum: "🏛️",
      market: "🏪",
      mosque: "🕌",
      palace: "🏰",
      historical: "📜",
      garden: "🌺",
      cafe: "☕",
      restaurant: "🍴",
      default: "📍"
    };
    return icons[category] || icons.default;
  };

  const AttractionCard = ({ attraction }: { attraction: Attraction }) => {
    const isInPlan = planItems.includes(attraction.id);
    const imageUrl = attraction.imageUrl || attractionImages[attraction.id];

    return (
      <Card className="group overflow-hidden hover-lift transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${attraction.name} in ${cityName}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <span className="text-4xl">{getCategoryIcon(attraction.category)}</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="brand" className="backdrop-blur-sm bg-white/90">
              {attraction.category}
            </Badge>
          </div>

          {/* Rating */}
          {attraction.rating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold">{attraction.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1">
            {attraction.name}
          </h3>
          
          {attraction.blurb && (
            <p className="text-sm text-brand-600 italic mb-3 line-clamp-1">
              "{attraction.blurb}"
            </p>
          )}

          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {attraction.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{attraction.visitTime}m</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{attraction.cost}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{attraction.bestTime}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {attraction.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
            {attraction.tags.length > 3 && (
              <Badge variant="default" size="sm">
                +{attraction.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Highlights */}
          {attraction.highlights && attraction.highlights.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Highlights:</p>
              <div className="flex flex-wrap gap-2">
                {attraction.highlights.slice(0, 2).map((highlight, i) => (
                  <span key={i} className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onAddToPlan?.(attraction.id)}
              variant={isInPlan ? "success" : "primary"}
              size="sm"
              className="flex-1"
            >
              {isInPlan ? "✓ Added" : "+ Add to Plan"}
            </Button>
            <Button variant="ghost" size="sm" className="px-3">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="px-3">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Top Attractions in {cityName}
          </h2>
          <p className="text-slate-600">
            Discover {filteredAttractions.length} amazing places to visit
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-colors ${
              viewMode === "grid"
                ? "bg-amber-500 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-colors ${
              viewMode === "list"
                ? "bg-amber-500 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search attractions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.slice(1).map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="rating">Sort by Rating</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Grid/List */}
      {filteredAttractions.length === 0 ? (
        <Card>
          <div className="card-pad text-center py-12">
            <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No attractions found matching your filters.</p>
          </div>
        </Card>
      ) : (
        <div className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredAttractions.map((attraction) => (
            <AttractionCard key={attraction.id} attraction={attraction} />
          ))}
        </div>
      )}
    </div>
  );
}