"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  MapPin,
  Star,
  Calendar,
  ArrowRight,
  Thermometer,
  TrendingUp,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Check,
  Heart,
  Clock,
  Wallet,
  Phone,
  Wifi,
  Bus,
  ShieldCheck,
  Users,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { usePlanContext } from "@/features/plan/PlanProvider";
import { placeKey } from "@/features/plan/usePlan";
import { useFavorites } from "@/features/favorites/useFavorites";
import { useToast } from "@/components/ToastProvider";
import type { City, Place } from "@/data/cities";
import { type CityPhoto, unsplashImage } from "@/data/cityImages";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[320px] rounded-xl bg-slate-100 animate-pulse" />,
});

interface WeatherData {
  current?: { temperature_2m: number; weathercode: number };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
  };
}

interface FXData {
  date: string;
  madPer: { USD: number; EUR: number };
}

type TabId = "overview" | "places" | "itineraries" | "gallery";
const TAB_IDS: TabId[] = ["overview", "places", "itineraries", "gallery"];

// WMO weather codes used by Open-Meteo.
function describeWeather(code: number) {
  if (code === 0) return { label: "Clear", Icon: Sun, color: "text-yellow-500" };
  if (code <= 3) return { label: "Partly cloudy", Icon: Cloud, color: "text-slate-500" };
  if (code <= 48) return { label: "Fog", Icon: CloudFog, color: "text-slate-500" };
  if (code <= 67 || (code >= 80 && code <= 82)) return { label: "Rain", Icon: CloudRain, color: "text-blue-500" };
  if (code <= 77 || code === 85 || code === 86) return { label: "Snow", Icon: CloudSnow, color: "text-sky-400" };
  return { label: "Thunderstorms", Icon: CloudLightning, color: "text-purple-500" };
}

const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;
const formatMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}min` : ""}` : `${m} min`);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");

export function CityTabContent({ city, photos }: { city: City; photos: CityPhoto[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [fx, setFx] = useState<FXData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isLoadingFX, setIsLoadingFX] = useState(true);
  const { addPlace, removePlace, isInPlan, isHydrated } = usePlanContext();
  const { isFavorited, toggleFavorite, isReady: favoritesReady } = useFavorites();
  const { addToast } = useToast();

  const places = city.places;
  const placesById = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of places) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  }, [places]);
  const visiblePlaces = categoryFilter === "all" ? places : places.filter((p) => p.category === categoryFilter);
  const mapMarkers = useMemo(
    () => places.map((p) => ({ id: p.id, name: p.name, lat: p.lat, lon: p.lon, category: p.category })),
    [places]
  );

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/weather?lat=${city.lat}&lon=${city.lon}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => !cancelled && data?.daily && setWeather(data))
      .catch(() => {})
      .finally(() => !cancelled && setIsLoadingWeather(false));
    fetch("/api/fx")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => !cancelled && data?.madPer && setFx(data))
      .catch(() => {})
      .finally(() => !cancelled && setIsLoadingFX(false));
    return () => {
      cancelled = true;
    };
  }, [city.lat, city.lon]);

  // Deep links such as /cities/fes#gallery open the matching tab.
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.substring(1) as TabId;
      if (TAB_IDS.includes(hash)) setActiveTab(hash);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const selectTab = (tab: TabId) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", tab === "overview" ? window.location.pathname : `#${tab}`);
  };

  const addToPlan = useCallback(
    (place: Place) => {
      addPlace({
        name: place.name,
        city: city.slug,
        day: 1,
        lat: place.lat,
        lon: place.lon,
        category: place.category,
        note: place.blurb ?? place.description,
        visitTime: place.visitTime,
        cost: place.cost,
      });
    },
    [addPlace, city.slug]
  );

  const togglePlace = (place: Place) => {
    if (isInPlan(city.slug, place.name)) {
      removePlace(placeKey(city.slug, place.name));
      addToast({ type: "info", title: `Removed ${place.name} from your plan`, duration: 2500 });
    } else {
      addToPlan(place);
      addToast({ type: "success", title: `Added ${place.name} to your plan`, duration: 2500 });
    }
  };

  const addItinerary = (placeIds: string[], title: string) => {
    const toAdd = placeIds.map((id) => placesById.get(id)).filter((p): p is Place => Boolean(p));
    toAdd.forEach(addToPlan);
    addToast({ type: "success", title: `Added "${title}" to your plan`, message: `${toAdd.length} places`, duration: 3000 });
  };

  const renderPlanButton = (place: Place, compact = false) => {
    const inPlan = isHydrated && isInPlan(city.slug, place.name);
    return (
      <button
        onClick={() => togglePlace(place)}
        aria-pressed={inPlan}
        title={inPlan ? "Remove from plan" : "Add to plan"}
        data-testid="add-to-plan"
        className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl font-semibold transition-colors ${
          compact ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"
        } ${
          inPlan
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
        }`}
      >
        {inPlan ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {inPlan ? "In plan" : compact ? "Add" : "Add to Plan"}
      </button>
    );
  };

  const renderOverview = () => {
    const today = weather?.daily;
    const current = weather?.current;
    return (
      <div className="space-y-10">
        <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Welcome to {city.name}</h2>
                  <p className="text-slate-700 leading-relaxed text-lg">{city.description}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(city.slug)}
                  disabled={!favoritesReady}
                  aria-pressed={isFavorited(city.slug)}
                  data-testid="favorite-toggle"
                  className={`p-3 rounded-xl transition-colors flex-shrink-0 ${
                    isFavorited(city.slug) ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  title={isFavorited(city.slug) ? "Remove from favorites" : "Add to favorites"}
                  aria-label={isFavorited(city.slug) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`h-6 w-6 ${isFavorited(city.slug) ? "fill-current" : ""}`} />
                </button>
              </div>

              <div className="bg-white/70 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-semibold text-slate-900">Best Time to Visit</span>
                </div>
                <p className="text-slate-600">{city.bestTimeToVisit}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Live Information</h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 shadow-sm space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Thermometer className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-blue-900">Weather</span>
                  </div>
                  {isLoadingWeather ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-6 bg-blue-200 rounded w-3/4"></div>
                      <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                    </div>
                  ) : today ? (
                    <div className="space-y-3" data-testid="weather">
                      {(() => {
                        const { label, Icon, color } = describeWeather(current?.weathercode ?? today.weathercode[0] ?? 0);
                        return (
                          <div className="flex items-center gap-3">
                            <Icon className={`h-7 w-7 ${color}`} />
                            <span className="text-3xl font-bold text-blue-900">
                              {formatTemperature(current?.temperature_2m ?? today.temperature_2m_max[0] ?? 0)}
                            </span>
                            <span className="text-sm text-blue-700">{label}</span>
                          </div>
                        );
                      })()}
                      <div className="text-sm text-blue-700">
                        Today: {formatTemperature(today.temperature_2m_max[0] ?? 0)} / {formatTemperature(today.temperature_2m_min[0] ?? 0)}
                        {(today.precipitation_probability_max[0] ?? 0) > 0 && ` · ${today.precipitation_probability_max[0]}% rain`}
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {today.time.slice(1, 4).map((date, i) => {
                          const { Icon, color, label } = describeWeather(today.weathercode[i + 1] ?? 0);
                          return (
                            <div key={date} className="bg-white/70 rounded-lg p-2 text-center" title={label}>
                              <div className="text-xs text-blue-700">
                                {new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" })}
                              </div>
                              <Icon className={`h-4 w-4 mx-auto my-1 ${color}`} />
                              <div className="text-xs font-semibold text-blue-900">
                                {Math.round(today.temperature_2m_max[i + 1] ?? 0)}° / {Math.round(today.temperature_2m_min[i + 1] ?? 0)}°
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-blue-600">Weather data unavailable right now</div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-blue-200">
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
                  ) : fx ? (
                    <div className="space-y-2" data-testid="fx">
                      {(["EUR", "USD"] as const).map((cur) => (
                        <div key={cur} className="flex justify-between items-center bg-green-100 px-3 py-2 rounded-lg">
                          <span className="text-sm font-medium text-green-700">1 {cur}</span>
                          <span className="font-bold text-green-900">{fx.madPer[cur].toFixed(2)} MAD</span>
                        </div>
                      ))}
                      <div className="text-xs text-green-600 text-center">
                        Updated {new Date(fx.date).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-green-600">Exchange rates unavailable right now</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Essential Information</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Getting Around", Icon: Bus, body: city.practicalInfo.gettingAround },
              { title: "SIM & WiFi", Icon: Wifi, body: city.practicalInfo.simWifi },
              { title: "Currency", Icon: Wallet, body: city.practicalInfo.currency },
              { title: "Emergency", Icon: Phone, body: city.practicalInfo.emergencyNumbers.join(" · ") },
            ].map(({ title, Icon, body }) => (
              <div key={title} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Icon className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-semibold text-slate-900">{title}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: "Safety Tips", Icon: ShieldCheck, tips: city.safetyTips },
            { title: "Local Etiquette", Icon: Users, tips: city.etiquetteTips },
          ].map(({ title, Icon, tips }) => (
            <div key={title} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Icon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
              </div>
              <ul className="space-y-2">
                {tips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-slate-600 text-sm leading-relaxed">
                    <Check className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {city.neighborhoods.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900">Neighborhoods to Explore</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {city.neighborhoods.map((neighborhood) => (
                <div key={neighborhood.name} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-slate-900 text-lg mb-2">{neighborhood.name}</h4>
                  <p className="text-slate-600 leading-relaxed mb-3">{neighborhood.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {neighborhood.highlights.map((h) => (
                      <span key={h} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-slate-900">City Map</h3>
            <span className="text-sm text-slate-500">{places.length} places · tap a dot for its name</span>
          </div>
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm">
            <div className="h-96 w-full">
              <LeafletMap center={[city.lat, city.lon]} zoom={13} cityName={city.name} markers={mapMarkers} />
            </div>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-900">Photo Gallery</h3>
              <button onClick={() => selectTab("gallery")} className="btn-secondary btn-sm">
                View all {photos.length} photos
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.slice(0, 6).map((photo, index) => (
                <button
                  key={photo.src}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-slate-100"
                  aria-label={`Open photo: ${photo.alt}`}
                >
                  <Image
                    src={unsplashImage(photo.src, 600, 450)}
                    alt={photo.alt}
                    fill
                    sizes="(min-width:768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPlaces = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Places to Visit in {city.name}</h2>
        <p className="text-slate-600 mb-5">Add places to your plan, then open the planner to arrange them into days.</p>
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by category">
          {[{ name: "all", count: places.length }, ...categories].map((category) => (
            <button
              key={category.name}
              onClick={() => setCategoryFilter(category.name)}
              aria-pressed={categoryFilter === category.name}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors ${
                categoryFilter === category.name
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
              }`}
            >
              {category.name === "all" ? "All" : capitalize(category.name)} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visiblePlaces.map((place) => (
          <article
            key={place.id}
            data-testid="place-card"
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300 p-6 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{place.name}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="capitalize">{place.category === "daytrip" ? "Day trip" : place.category}</span>
                  {place.rating && (
                    <span className="inline-flex items-center gap-0.5 text-amber-600">
                      <Star className="h-3 w-3 fill-current" />
                      {place.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
              {renderPlanButton(place)}
            </div>

            <p className="text-slate-600 leading-relaxed text-sm">{place.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  Duration
                </div>
                <span className="text-slate-600">{formatMinutes(place.visitTime)}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <Sun className="h-3.5 w-3.5 text-amber-600" />
                  Best Time
                </div>
                <span className="text-slate-600 capitalize">{place.bestTime}</span>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-sm">
              <span className="text-xs font-semibold text-amber-700 mr-2">Cost</span>
              <span className="font-medium text-amber-800">{place.cost}</span>
            </div>

            {place.tips && place.tips.length > 0 && (
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Tip:</span> {place.tips[0]}
              </p>
            )}

            {place.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {place.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );

  const renderItineraries = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Suggested Itineraries for {city.name}</h2>
        <p className="text-slate-600">Ready-made routes. Add a whole itinerary to your plan in one click.</p>
      </div>

      {city.itineraries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-600">No suggested itineraries yet. Build your own from the Places tab.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {city.itineraries.map((itinerary) => {
            const stops = itinerary.places.map((id) => placesById.get(id)).filter((p): p is Place => Boolean(p));
            const totalMinutes = stops.reduce((sum, p) => sum + p.visitTime, 0);
            return (
              <div key={itinerary.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" data-testid="itinerary">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">{itinerary.title}</h3>
                      <p className="text-amber-50 text-sm">
                        {itinerary.duration} {itinerary.duration === 1 ? "day" : "days"} · {stops.length} stops · ~{formatMinutes(totalMinutes)} of visits
                      </p>
                    </div>
                    <button
                      onClick={() => addItinerary(itinerary.places, itinerary.title)}
                      className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-semibold flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      Add all
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-slate-600 text-sm">{itinerary.description}</p>
                  {stops.map((place, index) => (
                    <div key={place.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">{place.name}</h4>
                        <p className="text-slate-600 text-sm">{formatMinutes(place.visitTime)} · {place.cost}</p>
                      </div>
                      {renderPlanButton(place, true)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderGallery = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Photo Gallery</h2>
        <p className="text-slate-600">Discover the beauty of {city.name}</p>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No photos for {city.name} yet.</p>
        </div>
      ) : (
        <div data-testid="gallery-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {photos.map((photo, index) => (
            <figure key={photo.src} className="group">
              <button
                onClick={() => setLightboxIndex(index)}
                className="relative block w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-slate-100"
                aria-label={`Open photo: ${photo.alt}`}
              >
                <Image
                  src={unsplashImage(photo.src, 600, 450)}
                  alt={photo.alt}
                  fill
                  sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </button>
              <figcaption className="mt-2 text-xs text-slate-500 leading-snug">
                {photo.alt}
                <br />
                <span className="text-slate-400">
                  Photo by{" "}
                  <a href={`${photo.photographerUrl}?utm_source=atlas_morocco&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
                    {photo.photographer}
                  </a>{" "}
                  on{" "}
                  <a href={`${photo.unsplashUrl}?utm_source=atlas_morocco&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
                    Unsplash
                  </a>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );

  const tabs: { id: TabId; label: string; Icon: typeof MapPin; render: () => React.ReactNode }[] = [
    { id: "overview", label: "Overview", Icon: MapPin, render: renderOverview },
    { id: "places", label: `Places (${places.length})`, Icon: Star, render: renderPlaces },
    { id: "itineraries", label: "Itineraries", Icon: Calendar, render: renderItineraries },
    { id: "gallery", label: "Gallery", Icon: ImageIcon, render: renderGallery },
  ];

  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
        <div className="bg-slate-50 rounded-2xl p-1.5 shadow-sm border border-slate-200 flex gap-1.5 min-w-max sm:min-w-0 max-w-4xl mx-auto" role="tablist">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`${id}-panel`}
              data-testid={`tab-${id}`}
              onClick={() => selectTab(id)}
              className={`flex-1 px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                activeTab === id
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Only the active panel is rendered so the map only mounts when Overview is open. */}
      <div className="mt-8 sm:mt-10 animate-fadeIn" key={activeTab} id={`${activeTab}-panel`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} data-testid={`${activeTab}-panel`}>
        {tabs.find((t) => t.id === activeTab)!.render()}
      </div>

      {lightboxIndex !== null && photos[lightboxIndex] && (
        <Lightbox photos={photos} index={lightboxIndex} onChange={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}

function Lightbox({
  photos,
  index,
  onChange,
  onClose,
}: {
  photos: CityPhoto[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index]!;
  const go = useCallback((delta: number) => onChange((index + delta + photos.length) % photos.length), [index, onChange, photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [go, onClose]);

  return (
    <div
      className="fixed inset-0 z-[1300] bg-black/90 flex flex-col items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
      data-testid="lightbox"
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white" aria-label="Close">
        <X className="h-7 w-7" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        className="absolute left-2 sm:left-6 p-2 text-white/80 hover:text-white"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-9 w-9" />
      </button>
      <div className="relative w-full max-w-5xl h-[75vh]" onClick={(e) => e.stopPropagation()}>
        <Image src={unsplashImage(photo.src, 1600)} alt={photo.alt} fill sizes="100vw" className="object-contain" />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        className="absolute right-2 sm:right-6 p-2 text-white/80 hover:text-white"
        aria-label="Next photo"
      >
        <ChevronRight className="h-9 w-9" />
      </button>
      <p className="mt-4 text-white/90 text-sm text-center" onClick={(e) => e.stopPropagation()}>
        {photo.alt} · {index + 1}/{photos.length} · Photo by{" "}
        <a href={`${photo.photographerUrl}?utm_source=atlas_morocco&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="underline">
          {photo.photographer}
        </a>{" "}
        on{" "}
        <a href={`${photo.unsplashUrl}?utm_source=atlas_morocco&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="underline">
          Unsplash
        </a>
      </p>
    </div>
  );
}
