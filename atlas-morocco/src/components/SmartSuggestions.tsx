'use client';

import { useState, useEffect } from 'react';
import { MapPin, Star, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Place {
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
}

interface SmartSuggestionsProps {
  currentCity: string;
  userLocation?: { lat: number; lon: number };
  visitedPlaces: string[];
  preferences?: {
    categories: string[];
    budget: 'low' | 'medium' | 'high';
    timeOfDay: 'morning' | 'afternoon' | 'evening';
  };
}

export default function SmartSuggestions({ 
  currentCity, 
  userLocation, 
  visitedPlaces, 
  preferences = { categories: [], budget: 'medium', timeOfDay: 'morning' }
}: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const response = await fetch(`/api/cities/${currentCity}`);
        if (!response.ok) throw new Error('Failed to fetch city data');
        
        const data = await response.json();
        const places = data.places || [];
        
        // Filter out visited places
        const unvisitedPlaces = places.filter((place: Place) => 
          !visitedPlaces.includes(place.id)
        );
        
        // Apply smart filtering based on preferences
        let filteredPlaces = unvisitedPlaces;
        
        // Filter by category preferences
        if (preferences.categories.length > 0) {
          filteredPlaces = filteredPlaces.filter((place: Place) =>
            preferences.categories.includes(place.category)
          );
        }
        
        // Filter by budget
        if (preferences.budget === 'low') {
          filteredPlaces = filteredPlaces.filter((place: Place) =>
            place.cost === 'Free' || place.cost.includes('20') || place.cost.includes('30')
          );
        } else if (preferences.budget === 'high') {
          filteredPlaces = filteredPlaces.filter((place: Place) =>
            place.cost.includes('200') || place.cost.includes('300') || place.cost.includes('400')
          );
        }
        
        // Filter by time of day
        filteredPlaces = filteredPlaces.filter((place: Place) =>
          place.bestTime === preferences.timeOfDay || place.bestTime === 'anytime'
        );
        
        // Sort by distance if user location is available
        if (userLocation) {
          filteredPlaces.sort((a: Place, b: Place) => {
            const distanceA = calculateDistance(userLocation.lat, userLocation.lon, a.lat, a.lon);
            const distanceB = calculateDistance(userLocation.lat, userLocation.lon, b.lat, b.lon);
            return distanceA - distanceB;
          });
        }
        
        // Take top 6 suggestions
        setSuggestions(filteredPlaces.slice(0, 6));
      } catch (error) {
        console.error('Error loading suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadSuggestions();
  }, [currentCity, visitedPlaces, preferences, userLocation]);

  // Calculate distance between two points using Haversine formula
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'mosque': '🕌',
      'market': '🛍️',
      'palace': '🏰',
      'garden': '🌿',
      'museum': '🏛️',
      'restaurant': '🍽️',
      'cafe': '☕',
      'viewpoint': '👁️',
      'beach': '🏖️',
      'mountain': '⛰️',
      'desert': '🏜️',
      'medina': '🏘️',
      'food': '🍴',
      'architecture': '🏛️',
      'culture': '⭐',
      'nature': '🌿',
      'shopping': '🛒',
      'view': '👁️',
      'daytrip': '🧭',
    };
    return icons[category.toLowerCase()] || '📍';
  };

  if (loading) {
    return (
      <Card>
        <div className="card-pad">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <h3 className="h3">Smart Suggestions</h3>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <div className="card-pad text-center py-8">
          <Sparkles className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h4 className="h4 mb-2">No New Suggestions</h4>
          <p className="text-slate-600">
            You've explored most places in {currentCity}! Try adjusting your preferences or visit a different city.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="card-pad">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <h3 className="h3">Smart Suggestions</h3>
          <Badge variant="accent" className="text-xs">
            {suggestions.length} places
          </Badge>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((place) => (
            <div key={place.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-lg">
                {getCategoryIcon(place.category)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{place.name}</h4>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Badge variant="accent" className="text-xs">{place.category}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {place.visitTime}m
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {place.cost}
                  </span>
                </div>
                {place.blurb && (
                  <p className="text-xs text-slate-500 mt-1 italic">"{place.blurb}"</p>
                )}
              </div>
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Suggestions based on your preferences and location in {currentCity}
          </p>
        </div>
      </div>
    </Card>
  );
}
