"use client";

import { useState, useEffect } from "react";
import { MapPin, Star, Calendar, ArrowRight, Thermometer, Cloud, Wind, TrendingUp, TrendingDown, Sun, CloudRain, Check, Heart } from "lucide-react";
import { usePlanContext } from "@/features/plan/PlanProvider";
import { useFavorites } from "@/features/favorites/useFavorites";
import Image from "next/image";
import LeafletMap from "@/components/LeafletMap";

interface CityImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface WeatherData {
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

interface FXData {
  base: string;
  date: string;
  rates: {
    USD: number;
    EUR: number;
  };
  provider: string;
}

interface Place {
  id: string;
  name: string;
  description: string;
  lat: number;
  lon: number;
  category: string;
  visitTime: number;
  bestTime: string;
  cost: string;
  accessibility: string;
  tags: string[];
  blurb?: string;
}

interface City {
  id: string;
  name: string;
  slug: string;
  description: string;
  lat: number;
  lon: number;
  bestTimeToVisit: string;
  safetyTips: string[];
  etiquetteTips: string[];
  neighborhoods: Array<{
    name: string;
    description: string;
  highlights: string[];
  }>;
  places: Place[];
  itineraries: Array<{
    duration: number;
    title: string;
    description: string;
    places: string[];
  }>;
  practicalInfo: {
    gettingAround: string;
    simWifi: string;
  currency: string;
    emergencyNumbers: string[];
  };
}

interface CityTabContentProps {
  city: City;
  pois: Place[];
  attractions: Place[];
  categories: Array<{ name: string; count: number }>;
}

// Function to fetch city images from API
async function fetchCityImages(citySlug: string): Promise<CityImage[]> {
  try {
    const response = await fetch(`/api/images?city=${citySlug}&limit=12`);
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response for', citySlug, ':', data);
    return data.images || [];
  } catch (error) {
    console.error(`Error fetching images for ${citySlug}:`, error);
    return [];
  }
}

export function CityTabContent({ city, pois, attractions, categories }: CityTabContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { addPlace } = usePlanContext();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const [galleryImages, setGalleryImages] = useState<CityImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [fxData, setFxData] = useState<FXData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isLoadingFX, setIsLoadingFX] = useState(true);
  const [addedPlaces, setAddedPlaces] = useState<Set<string>>(new Set());

  // Load gallery images on client side
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const response = await fetch(`/api/images?city=${city.slug}&limit=12`);
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            setGalleryImages(data.images);
          }
        }
      } catch (error) {
        console.error('Error loading gallery images:', error);
      } finally {
      setIsLoadingGallery(false);
    }
    };

    loadGalleryImages();
  }, [city.slug]);

  // Load weather data
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const response = await fetch(`/api/weather?lat=${city.lat}&lon=${city.lon}`);
        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
        }
      } catch (error) {
        console.error('Error loading weather:', error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    loadWeather();
  }, [city.lat, city.lon]);

  // Load FX data
  useEffect(() => {
    const loadFX = async () => {
      try {
        const response = await fetch('/api/fx');
        if (response.ok) {
          const data = await response.json();
          setFxData(data);
        }
      } catch (error) {
        console.error('Error loading FX data:', error);
      } finally {
        setIsLoadingFX(false);
      }
    };

    loadFX();
  }, []);

  // Handle hash navigation (e.g., #gallery)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && ['overview', 'places', 'itineraries', 'gallery'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleAddToPlan = (place: Place) => {
    try {
    addPlace({
      name: place.name,
      city: city.slug,
      day: 1,
      lat: place.lat,
      lon: place.lon,
      category: place.category,
      note: place.description
    });
      
      // Add visual feedback
      setAddedPlaces(prev => new Set(prev).add(place.id));
      
      // Remove the feedback after 3 seconds
      setTimeout(() => {
        setAddedPlaces(prev => {
          const newSet = new Set(prev);
          newSet.delete(place.id);
          return newSet;
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error adding place to plan:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (isFavorited(city.slug)) {
      await removeFavorite(city.slug);
    } else {
      await addFavorite(city.slug);
    }
  };

  const getWeatherIcon = (weatherCode: number) => {
    if (weatherCode <= 3) return <Sun className="h-4 w-4 text-yellow-500" />;
    if (weatherCode <= 48) return <Cloud className="h-4 w-4 text-slate-500" />;
    if (weatherCode <= 67) return <CloudRain className="h-4 w-4 text-blue-500" />;
    return <Cloud className="h-4 w-4 text-slate-500" />;
  };

  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;

  const formatFXRate = (rate: number) => rate.toFixed(4);

  const renderOverviewContent = () => (
    <div className="space-y-10">
      {/* Hero Section with City Info and Live Data */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* About City */}
          <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Welcome to {city.name}</h2>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isFavorited(city.slug)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={isFavorited(city.slug) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`h-6 w-6 ${isFavorited(city.slug) ? 'fill-current' : ''}`} />
                </button>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg">{city.description}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-semibold text-slate-900">Best Time to Visit</span>
                </div>
                <p className="text-slate-600">{city.bestTimeToVisit}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-semibold text-slate-900">Currency</span>
                </div>
                <p className="text-slate-600">{city.practicalInfo.currency}</p>
              </div>
            </div>
          </div>
          
          {/* Live Information Card */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900">Live Information</h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
              {/* Weather Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-blue-900">Current Weather</span>
                </div>
                {isLoadingWeather ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-blue-200 rounded w-3/4"></div>
                    <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                  </div>
                ) : weatherData ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(weatherData.daily.weathercode[0] || 0)}
                      <span className="text-2xl font-bold text-blue-900">
                        {formatTemperature(weatherData.daily.temperature_2m_max[0] || 0)}
                      </span>
                    </div>
                    <div className="text-sm text-blue-700">
                      High: {formatTemperature(weatherData.daily.temperature_2m_max[0] || 0)} • 
                      Low: {formatTemperature(weatherData.daily.temperature_2m_min[0] || 0)}
                    </div>
                    {(weatherData.daily.precipitation_probability_max[0] || 0) > 0 && (
                      <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">
                        Rain chance: {weatherData.daily.precipitation_probability_max[0]}%
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-blue-600">Weather data unavailable</div>
                )}
              </div>
              
              {/* FX Section */}
              <div className="space-y-4 pt-4 border-t border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-green-900">Exchange Rates</span>
                </div>
                {isLoadingFX ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-green-200 rounded w-3/4"></div>
                    <div className="h-4 bg-green-200 rounded w-1/2"></div>
                  </div>
                ) : fxData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-green-100 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium text-green-700">USD</span>
                      <span className="font-bold text-green-900">{formatFXRate(fxData.rates.USD)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-100 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium text-green-700">EUR</span>
                      <span className="font-bold text-green-900">{formatFXRate(fxData.rates.EUR)}</span>
                    </div>
                    <div className="text-xs text-green-600 text-center">
                      Updated: {new Date(fxData.date).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-green-600">FX data unavailable</div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
        
      {/* Quick Facts Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">Essential Information</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <MapPin className="h-5 w-5 text-amber-600" />
              </div>
              <span className="font-semibold text-slate-900">Getting Around</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{city.practicalInfo.gettingAround}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Wind className="h-5 w-5 text-amber-600" />
              </div>
              <span className="font-semibold text-slate-900">SIM & WiFi</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{city.practicalInfo.simWifi}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <span className="font-semibold text-slate-900">Currency</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{city.practicalInfo.currency}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <span className="font-semibold text-slate-900">Emergency</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{city.practicalInfo.emergencyNumbers[0]}</p>
          </div>
        </div>
      </div>

      {/* Neighborhoods Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">Neighborhoods to Explore</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {(city.neighborhoods || []).map((neighborhood, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 text-lg">{neighborhood.name}</h4>
                  <p className="text-slate-600 leading-relaxed">{neighborhood.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">City Map</h3>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="h-80 w-full rounded-xl overflow-hidden">
            <LeafletMap 
              center={[city.lat, city.lon]} 
              zoom={12} 
              cityName={city.name}
            />
          </div>
        </div>
      </div>

      {/* Photo Preview Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Photo Gallery Preview</h3>
          <button
            onClick={() => setActiveTab('gallery')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Star className="h-4 w-4" />
            View All Photos
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        {isLoadingGallery ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 animate-pulse" />
            ))}
          </div>
        ) : galleryImages && galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.slice(0, 6).map((image, index) => (
              <div 
                key={`preview-${image.url}-${index}`} 
                className="group aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white cursor-pointer"
                onClick={() => setActiveTab('gallery')}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    priority={index < 2}
                    loading={index < 2 ? "eager" : "lazy"}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.src = '/cities/fallback-image.svg';
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium line-clamp-2">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Photo gallery will be available soon</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-2xl p-8 border border-amber-200 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Explore {city.name}?</h3>
            <p className="text-slate-600 text-lg">Discover the best places to visit and create your perfect itinerary</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setActiveTab('gallery')}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Star className="h-5 w-5" />
              View Gallery
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className="px-6 py-3 bg-white text-amber-600 border-2 border-amber-600 rounded-xl hover:bg-amber-50 transition-all duration-300 text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <MapPin className="h-5 w-5" />
              See Places
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlacesContent = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Places to Visit in {city.name}</h2>
            <p className="text-slate-600 text-lg">Discover the most interesting attractions and landmarks</p>
          </div>
          <div className="flex gap-2 flex-wrap">
          {(categories || []).map((category) => (
              <span key={category.name} className="px-4 py-2 bg-white text-amber-700 rounded-xl text-sm font-semibold border border-amber-200 shadow-sm">
              {category.name} ({category.count})
            </span>
          ))}
          </div>
        </div>
      </div>
      
      {/* Places Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(pois || []).map((place) => (
          <div key={place.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden group">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-amber-700 transition-colors">
                  {place.name}
                </h3>
                <button
                  onClick={() => handleAddToPlan(place)}
                  className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 font-semibold shadow-sm hover:shadow-md flex-shrink-0 flex items-center gap-2 ${
                    addedPlaces.has(place.id)
                      ? "bg-green-600 text-white"
                      : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                  }`}
                >
                  {addedPlaces.has(place.id) ? (
                    <>
                      <Check className="h-4 w-4" />
                      Added!
                    </>
                  ) : (
                    "Add to Plan"
                  )}
                </button>
              </div>
              
              {/* Description */}
              <p className="text-slate-600 leading-relaxed text-sm">{place.description}</p>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-semibold text-slate-700">Duration</span>
                  </div>
                  <span className="text-sm text-slate-600">{place.visitTime} min</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-semibold text-slate-700">Best Time</span>
                  </div>
                  <span className="text-sm text-slate-600">{place.bestTime}</span>
                </div>
              </div>
              
              {/* Cost */}
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-amber-700">Cost</span>
                </div>
                <span className="text-sm font-medium text-amber-800">{place.cost}</span>
              </div>
              
              {/* Tags */}
              {(place.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                {(place.tags || []).map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {(!pois || pois.length === 0) && (
        <div className="text-center py-16 bg-slate-50 rounded-2xl">
          <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No places found</h3>
          <p className="text-slate-500">Places will be loaded from our database</p>
        </div>
      )}
    </div>
  );

  const renderItinerariesContent = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Suggested Itineraries for {city.name}</h2>
          <p className="text-slate-600 text-lg">Carefully crafted routes to make the most of your visit</p>
        </div>
      </div>
      
      {/* Itineraries Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* 1-Day Highlights */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">1-Day Highlights</h3>
                <p className="text-amber-100 text-sm">Perfect for a quick visit</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
            {(pois || []).slice(0, 4).map((place, index) => (
                <div key={place.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{place.name}</h4>
                    <p className="text-slate-600 text-sm">{place.visitTime} min • {place.cost}</p>
                  </div>
                  <button
                    onClick={() => handleAddToPlan(place)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium flex items-center gap-1 ${
                      addedPlaces.has(place.id)
                        ? "bg-green-600 text-white"
                        : "bg-amber-600 text-white hover:bg-amber-700"
                    }`}
                  >
                    {addedPlaces.has(place.id) ? (
                      <>
                        <Check className="h-3 w-3" />
                        Added
                      </>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Total Duration: ~{pois.slice(0, 4).reduce((acc, place) => acc + place.visitTime, 0)} min</span>
                <span className="font-semibold text-amber-600">Perfect for day trips</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 2-Day Explorer */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">2-Day Explorer</h3>
                <p className="text-blue-100 text-sm">Comprehensive city experience</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
            {(pois || []).slice(0, 6).map((place, index) => (
                <div key={place.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{place.name}</h4>
                    <p className="text-slate-600 text-sm">{place.visitTime} min • {place.cost}</p>
                  </div>
                  <button
                    onClick={() => handleAddToPlan(place)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium flex items-center gap-1 ${
                      addedPlaces.has(place.id)
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {addedPlaces.has(place.id) ? (
                      <>
                        <Check className="h-3 w-3" />
                        Added
                      </>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Total Duration: ~{pois.slice(0, 6).reduce((acc, place) => acc + place.visitTime, 0)} min</span>
                <span className="font-semibold text-blue-600">Ideal for weekend trips</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Itinerary CTA */}
      <div className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-3">Want a Custom Itinerary?</h3>
          <p className="text-slate-600 mb-6">Use our trip planner to create your perfect personalized route</p>
          <button
            onClick={() => setActiveTab('places')}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl mx-auto"
          >
            <MapPin className="h-5 w-5" />
            Start Planning
          </button>
        </div>
      </div>
    </div>
  );

  const renderGalleryContent = () => {
    if (isLoadingGallery) {
      return (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Photo Gallery</h2>
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                <span>Loading beautiful images...</span>
              </div>
            </div>
          </div>
          
          {/* Loading Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 animate-pulse" />
            ))}
          </div>
        </div>
      );
    }

    if (!galleryImages || galleryImages.length === 0) {
      return (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Photo Gallery</h2>
              <p className="text-slate-600 text-lg">Discover the beauty of {city.name}</p>
            </div>
          </div>
          
          {/* Empty State */}
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Star className="h-20 w-20 text-slate-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-slate-600 mb-3">No gallery images available</h3>
            <p className="text-slate-500 text-lg">Images will be loaded from our photo collection</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Photo Gallery</h2>
            <p className="text-slate-600 text-lg">Discover the beauty of {city.name}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200">
              <Star className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">{galleryImages.length} beautiful photos</span>
            </div>
          </div>
        </div>
        
        {/* Gallery Grid */}
        <div data-testid="gallery-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <div key={`${image.url}-${index}`} className="group aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                src={image.url}
                alt={image.alt}
                width={image.width}
                height={image.height}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  priority={index < 4}
                  loading={index < 4 ? "eager" : "lazy"}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = '/cities/fallback-image.svg';
                    e.currentTarget.onerror = null;
                }}
              />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium line-clamp-2">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">
            All photos are carefully curated to showcase the authentic beauty of {city.name}
          </p>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "overview", label: "Overview", content: renderOverviewContent() },
    { id: "places", label: `Places (${pois.length})`, content: renderPlacesContent() },
    { id: "itineraries", label: "Itineraries", content: renderItinerariesContent() },
    { id: "gallery", label: "Gallery", content: renderGalleryContent() }
  ];

  return (
    <div className="w-full">
      {/* Enhanced Tab Navigation */}
      <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-2xl p-2 max-w-4xl mx-auto shadow-lg border border-slate-200" role="tablist">
        <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            data-testid={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 relative overflow-hidden ${
              activeTab === tab.id
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transform scale-105"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/80 hover:shadow-md"
            }`}
          >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {tab.id === 'overview' && <MapPin className="h-4 w-4" />}
                {tab.id === 'places' && <Star className="h-4 w-4" />}
                {tab.id === 'itineraries' && <Calendar className="h-4 w-4" />}
                {tab.id === 'gallery' && <Star className="h-4 w-4" />}
            {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 animate-pulse" />
              )}
          </button>
        ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-10">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`${tab.id}-panel`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={activeTab === tab.id ? "block animate-fadeIn" : "hidden"}
            data-testid={`${tab.id}-panel`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}