'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useFavorites } from '@/features/favorites/useFavorites';

interface FavoritePlace {
  id: string;
  name: string;
  category: string;
  description: string;
  lat: number;
  lon: number;
  visitTime: number;
  bestTime: string;
  cost: string;
  accessibility: string;
  tags: string[];
  blurb?: string;
  cityName: string;
  citySlug: string;
  addedAt: string;
}

interface FavoritesManagerProps {
  placeId: string;
  placeName: string;
  placeCategory: string;
  placeDescription: string;
  placeLat: number;
  placeLon: number;
  placeVisitTime: number;
  placeBestTime: string;
  placeCost: string;
  placeAccessibility: string;
  placeTags: string[];
  placeBlurb?: string;
  cityName: string;
  citySlug: string;
}

export function FavoritesManager({
  placeId,
  placeName,
  placeCategory,
  placeDescription,
  placeLat,
  placeLon,
  placeVisitTime,
  placeBestTime,
  placeCost,
  placeAccessibility,
  placeTags,
  placeBlurb,
  cityName,
  citySlug
}: FavoritesManagerProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [mounted, setMounted] = useState(false);

  const getFavorites = (): FavoritePlace[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('am.favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    setMounted(true);
    // Check if place is already favorited
    const favorites = getFavorites();
    setIsFavorited(favorites.some(fav => fav.id === placeId));
  }, [placeId]);

  const saveFavorites = (favorites: FavoritePlace[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('am.favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = () => {
    if (!mounted) return;
    
    const favorites = getFavorites();
    
    if (isFavorited) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(fav => fav.id !== placeId);
      saveFavorites(updatedFavorites);
      setIsFavorited(false);
    } else {
      // Add to favorites
      const newFavorite: FavoritePlace = {
        id: placeId,
        name: placeName,
        category: placeCategory,
        description: placeDescription,
        lat: placeLat,
        lon: placeLon,
        visitTime: placeVisitTime,
        bestTime: placeBestTime,
        cost: placeCost,
        accessibility: placeAccessibility,
        tags: placeTags,
        blurb: placeBlurb,
        cityName,
        citySlug,
        addedAt: new Date().toISOString()
      };
      
      const updatedFavorites = [...favorites, newFavorite];
      saveFavorites(updatedFavorites);
      setIsFavorited(true);
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Heart className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      className={`transition-colors ${
        isFavorited 
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
          : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
      }`}
    >
      <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
    </Button>
  );
}

export function FavoritesList() {
  const { favorites, isLoading, removeFavorite } = useFavorites();
  const [cities, setCities] = useState<any[]>([]);

  // Load cities data
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetch('/api/cities');
        if (response.ok) {
          const data = await response.json();
          setCities(data.cities || []);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    };
    loadCities();
  }, []);

  const handleRemoveFavorite = async (citySlug: string) => {
    await removeFavorite(citySlug);
  };

  if (isLoading) {
    return (
      <Card>
        <div className="card-pad">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <div className="card-pad text-center py-12">
          <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h4 className="h4 mb-2">No Favorite Cities Yet</h4>
          <p className="text-slate-600 mb-6">
            Start exploring cities and add them to your favorites to see them here.
          </p>
          <Link href="/cities" className="btn-primary">
            <MapPin className="h-4 w-4" />
            Explore Cities
          </Link>
        </div>
      </Card>
    );
  }

  // Get city data for favorites
  const favoriteCities = favorites.map(fav => {
    const city = cities.find(c => c.slug === fav.citySlug);
    return { ...fav, city };
  }).filter(fav => fav.city); // Only include cities that exist

  return (
    <Card>
      <div className="card-pad">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-5 w-5 text-red-500" />
          <h3 className="h3">My Favorite Cities</h3>
          <Badge variant="accent" className="text-xs">
            {favoriteCities.length} cities
          </Badge>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favoriteCities.map((favorite) => (
            <div key={favorite.id} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">{favorite.city.name}</h4>
                  <p className="text-sm text-slate-600 line-clamp-2">{favorite.city.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFavorite(favorite.citySlug)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <MapPin className="h-3 w-3" />
                <span>{favorite.city.region}</span>
              </div>
              
              <Link 
                href={`/cities/${favorite.citySlug}`}
                className="btn-secondary btn-sm w-full"
              >
                <MapPin className="h-4 w-4" />
                Explore City
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Your favorite cities are saved and synced across devices when you're signed in
          </p>
        </div>
      </div>
    </Card>
  );
}
