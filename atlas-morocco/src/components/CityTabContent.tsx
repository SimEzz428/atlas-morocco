"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  MapPin,
  Star,
  CalendarDays,
  ArrowRight,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Check,
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
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { usePlanContext } from "@/features/plan/PlanProvider";
import { placeKey } from "@/features/plan/usePlan";
import { useToast } from "@/components/ToastProvider";
import type { City, Place } from "@/data/cities";
import { type CityPhoto, unsplashImage } from "@/data/cityImages";
import { cn } from "@/lib/utils";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full min-h-[320px] w-full animate-pulse rounded-xl bg-stone-100" />,
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
  if (code === 0) return { label: "Clear", Icon: Sun, color: "text-brand-500" };
  if (code <= 3) return { label: "Partly cloudy", Icon: Cloud, color: "text-stone-500" };
  if (code <= 48) return { label: "Fog", Icon: CloudFog, color: "text-stone-500" };
  if (code <= 67 || (code >= 80 && code <= 82)) return { label: "Rain", Icon: CloudRain, color: "text-majorelle-600" };
  if (code <= 77 || code === 85 || code === 86) return { label: "Snow", Icon: CloudSnow, color: "text-majorelle-500" };
  return { label: "Thunderstorms", Icon: CloudLightning, color: "text-majorelle-700" };
}

const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;
const formatMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}min` : ""}` : `${m} min`);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
const categoryLabel = (c: string) => (c === "daytrip" ? "Day trip" : capitalize(c));

function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="h3">{children}</h2>
      {aside}
    </div>
  );
}

function LiveInfo({ lat, lon }: { lat: number; lon: number }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [fx, setFx] = useState<FXData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isLoadingFX, setIsLoadingFX] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
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
  }, [lat, lon]);

  const daily = weather?.daily;
  const current = weather?.current;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-stone-100 bg-gradient-to-br from-majorelle-50 to-white p-5">
        <p className="eyebrow text-majorelle-700">Right now</p>
        {isLoadingWeather ? (
          <div className="mt-3 animate-pulse space-y-2">
            <div className="h-9 w-28 rounded bg-majorelle-100" />
            <div className="h-4 w-40 rounded bg-majorelle-100" />
          </div>
        ) : daily ? (
          <div data-testid="weather">
            {(() => {
              const { label, Icon, color } = describeWeather(current?.weathercode ?? daily.weathercode[0] ?? 0);
              return (
                <div className="mt-2 flex items-center gap-3">
                  <Icon className={cn("h-9 w-9", color)} />
                  <div>
                    <div className="font-display text-3xl font-bold text-stone-900">
                      {formatTemperature(current?.temperature_2m ?? daily.temperature_2m_max[0] ?? 0)}
                    </div>
                    <div className="text-sm text-stone-600">
                      {label} · {formatTemperature(daily.temperature_2m_max[0] ?? 0)} / {formatTemperature(daily.temperature_2m_min[0] ?? 0)}
                      {(daily.precipitation_probability_max[0] ?? 0) > 0 && ` · ${daily.precipitation_probability_max[0]}% rain`}
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {daily.time.slice(1, 4).map((date, i) => {
                const { Icon, color, label } = describeWeather(daily.weathercode[i + 1] ?? 0);
                return (
                  <div key={date} className="rounded-xl bg-white/80 p-2 text-center ring-1 ring-stone-100" title={label}>
                    <div className="text-xs font-medium text-stone-500">
                      {new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <Icon className={cn("mx-auto my-1 h-4 w-4", color)} />
                    <div className="text-xs font-semibold text-stone-800">
                      {Math.round(daily.temperature_2m_max[i + 1] ?? 0)}° <span className="font-normal text-stone-500">{Math.round(daily.temperature_2m_min[i + 1] ?? 0)}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-stone-600">Weather is unavailable right now.</p>
        )}
      </div>

      <div className="p-5">
        <p className="eyebrow text-stone-500">Exchange rate</p>
        {isLoadingFX ? (
          <div className="mt-3 h-12 animate-pulse rounded-xl bg-stone-100" />
        ) : fx ? (
          <div data-testid="fx">
            <dl className="mt-3 grid grid-cols-2 gap-2">
              {(["EUR", "USD"] as const).map((cur) => (
                <div key={cur} className="rounded-xl bg-sand-100 px-3 py-2">
                  <dt className="text-xs text-stone-500">1 {cur}</dt>
                  <dd className="font-semibold text-stone-900">{fx.madPer[cur].toFixed(2)} MAD</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs text-stone-400">Updated {new Date(fx.date).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-stone-600">Exchange rates are unavailable right now.</p>
        )}
      </div>
    </div>
  );
}

export function CityTabContent({ city, photos }: { city: City; photos: CityPhoto[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { addPlace, removePlace, isInPlan, isHydrated } = usePlanContext();
  const { addToast } = useToast();

  const places = city.places;
  const placesById = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of places) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  }, [places]);
  const visiblePlaces = categoryFilter === "all" ? places : places.filter((p) => p.category === categoryFilter);
  const topPlaces = useMemo(() => [...places].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 3), [places]);
  const mapMarkers = useMemo(
    () => places.map((p) => ({ id: p.id, name: p.name, lat: p.lat, lon: p.lon, category: p.category })),
    [places]
  );
  const inPlanCount = isHydrated ? places.filter((p) => isInPlan(city.slug, p.name)).length : 0;

  // Deep links such as /cities/fes#gallery open the matching tab.
  useEffect(() => {
    const syncFromHash = (event?: HashChangeEvent) => {
      const hash = window.location.hash.substring(1) as TabId;
      if (!TAB_IDS.includes(hash)) return;
      setActiveTab(hash);
      if (event) document.getElementById("city-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const selectTab = (tab: TabId) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", tab === "overview" ? window.location.pathname : `#${tab}`);
    // If the tab bar is stuck under the header (user scrolled down), jump back so the new panel starts in view.
    const bar = document.getElementById("city-tabs");
    if (bar && bar.getBoundingClientRect().top <= 65) bar.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const renderPlanButton = (place: Place, size: "full" | "compact" = "full") => {
    const inPlan = isHydrated && isInPlan(city.slug, place.name);
    return (
      <button
        onClick={() => togglePlace(place)}
        aria-pressed={inPlan}
        title={inPlan ? "Remove from plan" : "Add to plan"}
        data-testid="add-to-plan"
        className={cn(
          "inline-flex flex-none items-center justify-center gap-1.5 rounded-xl font-semibold transition-colors",
          size === "compact" ? "px-3 py-1.5 text-xs" : "w-full px-4 py-2.5 text-sm",
          inPlan
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100"
            : "bg-brand-600 text-white hover:bg-brand-700"
        )}
      >
        {inPlan ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {inPlan ? "In plan" : size === "compact" ? "Add" : "Add to Plan"}
      </button>
    );
  };

  const renderOverview = () => (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card card-pad">
            <p className="eyebrow">Know before you go</p>
            <div className="mt-4 flex gap-3 rounded-xl bg-brand-50 p-4">
              <CalendarDays className="mt-0.5 h-5 w-5 flex-none text-brand-700" />
              <div>
                <h3 className="font-semibold text-stone-900">Best time to visit</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-700">{city.bestTimeToVisit}</p>
              </div>
            </div>
            <dl className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {[
                { title: "Getting around", Icon: Bus, body: city.practicalInfo.gettingAround },
                { title: "SIM & WiFi", Icon: Wifi, body: city.practicalInfo.simWifi },
                { title: "Currency", Icon: Wallet, body: city.practicalInfo.currency },
                { title: "Emergency", Icon: Phone, body: city.practicalInfo.emergencyNumbers.join(" · ") },
              ].map(({ title, Icon, body }) => (
                <div key={title} className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 flex-none text-stone-400" />
                  <div>
                    <dt className="text-sm font-semibold text-stone-900">{title}</dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-stone-600">{body}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {topPlaces.length > 0 && (
            <div>
              <SectionTitle
                aside={
                  <button onClick={() => selectTab("places")} className="btn-ghost btn-sm text-sm">
                    All {places.length} places
                    <ArrowRight className="h-4 w-4" />
                  </button>
                }
              >
                Top picks
              </SectionTitle>
              <div className="grid gap-3 sm:grid-cols-3">
                {topPlaces.map((place) => (
                  <div key={place.id} className="card flex flex-col p-4">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span>{categoryLabel(place.category)}</span>
                      {place.rating && (
                        <span className="inline-flex items-center gap-0.5 font-semibold text-brand-700">
                          <Star className="h-3 w-3 fill-current" />
                          {place.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 font-semibold leading-snug text-stone-900">{place.name}</h3>
                    <p className="mb-3 mt-1 line-clamp-2 flex-1 text-sm text-stone-600">{place.blurb ?? place.description}</p>
                    {renderPlanButton(place, "compact")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-36 lg:self-start">
          <LiveInfo lat={city.lat} lon={city.lon} />
        </aside>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          { title: "Safety tips", Icon: ShieldCheck, tips: city.safetyTips },
          { title: "Local etiquette", Icon: Users, tips: city.etiquetteTips },
        ].map(({ title, Icon, tips }) => (
          <div key={title} className="card card-pad">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sand-100">
                <Icon className="h-5 w-5 text-brand-700" />
              </span>
              <h3 className="h4">{title}</h3>
            </div>
            <ul className="space-y-2.5">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-2.5 text-sm leading-relaxed text-stone-600">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {city.neighborhoods.length > 0 && (
        <div>
          <SectionTitle>Neighborhoods to explore</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {city.neighborhoods.map((neighborhood) => (
              <div key={neighborhood.name} className="card card-pad">
                <h3 className="h4">{neighborhood.name}</h3>
                <p className="mb-3 mt-1.5 text-sm leading-relaxed text-stone-600">{neighborhood.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {neighborhood.highlights.map((h) => (
                    <span key={h} className="rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <SectionTitle aside={<span className="hidden text-sm text-stone-500 sm:inline">{places.length} places · tap a dot for its name</span>}>
          City map
        </SectionTitle>
        <div className="card overflow-hidden p-2">
          <div className="h-[420px] w-full">
            <LeafletMap center={[city.lat, city.lon]} zoom={13} cityName={city.name} markers={mapMarkers} />
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div>
          <SectionTitle
            aside={
              <button onClick={() => selectTab("gallery")} className="btn-ghost btn-sm text-sm">
                View all {photos.length} photos
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          >
            Photos
          </SectionTitle>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
            {photos.slice(0, 5).map((photo, index) => (
              <button
                key={photo.src}
                onClick={() => setLightboxIndex(index)}
                className={cn(
                  "group relative overflow-hidden rounded-xl bg-stone-100",
                  index === 0 ? "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto" : "aspect-[4/3]",
                  index === 4 && "hidden md:block"
                )}
                aria-label={`Open photo: ${photo.alt}`}
              >
                <Image
                  src={unsplashImage(photo.src, index === 0 ? 1000 : 500, index === 0 ? 750 : 375)}
                  alt={photo.alt}
                  fill
                  sizes={index === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPlaces = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="h3">Places to visit</h2>
          <p className="mt-1 text-sm text-stone-600">
            {inPlanCount > 0 ? `${inPlanCount} of ${places.length} in your plan.` : "Add places to your plan, then arrange them into days in the planner."}
          </p>
        </div>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
        {[{ name: "all", count: places.length }, ...categories].map((category) => (
          <button
            key={category.name}
            onClick={() => setCategoryFilter(category.name)}
            aria-pressed={categoryFilter === category.name}
            className={cn("chip flex-none", categoryFilter === category.name && "chip-active")}
          >
            {category.name === "all" ? "All" : categoryLabel(category.name)} ({category.count})
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visiblePlaces.map((place) => (
          <article key={place.id} data-testid="place-card" className="card flex flex-col p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-md bg-sand-100 px-2 py-0.5 font-medium text-stone-700">{categoryLabel(place.category)}</span>
              {place.rating && (
                <span className="inline-flex items-center gap-0.5 font-semibold text-brand-700">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {place.rating.toFixed(1)}
                </span>
              )}
            </div>
            <h3 className="mt-2.5 font-display text-lg font-semibold leading-snug text-stone-900">{place.name}</h3>
            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-stone-600">{place.description}</p>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-stone-600">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-stone-400" />
                {formatMinutes(place.visitTime)}
              </span>
              <span className="inline-flex items-center gap-1.5 capitalize">
                <Sun className="h-4 w-4 text-stone-400" />
                {place.bestTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-stone-400" />
                {place.cost}
              </span>
            </div>

            {place.tips && place.tips.length > 0 && (
              <p className="mt-3 flex gap-2 rounded-lg bg-sand-50 p-2.5 text-xs leading-relaxed text-stone-600">
                <Lightbulb className="h-4 w-4 flex-none text-brand-600" />
                {place.tips[0]}
              </p>
            )}

            <div className="mt-auto pt-4">{renderPlanButton(place)}</div>
          </article>
        ))}
      </div>
    </div>
  );

  const renderItineraries = () => (
    <div className="space-y-6">
      <div>
        <h2 className="h3">Suggested itineraries</h2>
        <p className="mt-1 text-sm text-stone-600">Ready-made routes. Add a whole itinerary to your plan in one click.</p>
      </div>

      {city.itineraries.length === 0 ? (
        <div className="card card-pad py-12 text-center text-stone-600">
          No suggested itineraries yet. Build your own from the Places tab.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {city.itineraries.map((itinerary) => {
            const stops = itinerary.places.map((id) => placesById.get(id)).filter((p): p is Place => Boolean(p));
            const totalMinutes = stops.reduce((sum, p) => sum + p.visitTime, 0);
            return (
              <div key={itinerary.title} className="card overflow-hidden" data-testid="itinerary">
                <div className="flex items-start justify-between gap-4 border-b border-stone-100 bg-gradient-to-br from-brand-50 to-white p-5">
                  <div>
                    <p className="eyebrow">
                      <Sparkles className="h-3.5 w-3.5" />
                      {itinerary.duration} {itinerary.duration === 1 ? "day" : "days"}
                    </p>
                    <h3 className="h4 mt-1.5">{itinerary.title}</h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {stops.length} stops · ~{formatMinutes(totalMinutes)} of visits
                    </p>
                  </div>
                  <button onClick={() => addItinerary(itinerary.places, itinerary.title)} className="btn-primary btn-sm flex-none">
                    <Plus className="h-4 w-4" />
                    Add all
                  </button>
                </div>
                <div className="p-5">
                  <p className="mb-4 text-sm text-stone-600">{itinerary.description}</p>
                  <ol className="relative space-y-3 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-stone-200">
                    {stops.map((place, index) => (
                      <li key={place.id} className="relative flex items-center gap-3">
                        <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-sm font-bold text-brand-700 ring-2 ring-brand-200">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-semibold text-stone-900">{place.name}</h4>
                          <p className="text-xs text-stone-500">
                            {formatMinutes(place.visitTime)} · {place.cost}
                          </p>
                        </div>
                        {renderPlanButton(place, "compact")}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderGallery = () => (
    <div className="space-y-6">
      <div>
        <h2 className="h3">Photo gallery</h2>
        <p className="mt-1 text-sm text-stone-600">Tap a photo to view it full screen.</p>
      </div>

      {photos.length === 0 ? (
        <div className="card card-pad py-16 text-center">
          <ImageIcon className="mx-auto mb-4 h-10 w-10 text-stone-300" />
          <p className="text-stone-600">No photos for {city.name} yet.</p>
        </div>
      ) : (
        <div data-testid="gallery-grid" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <figure key={photo.src}>
              <button
                onClick={() => setLightboxIndex(index)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-100"
                aria-label={`Open photo: ${photo.alt}`}
              >
                <Image
                  src={unsplashImage(photo.src, 600, 450)}
                  alt={photo.alt}
                  fill
                  sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
              <figcaption className="mt-2 text-xs leading-snug text-stone-600">
                {photo.alt}
                <span className="block text-stone-400">
                  Photo by{" "}
                  <a href={`${photo.photographerUrl}?utm_source=atlas_morocco&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-600">
                    {photo.photographer}
                  </a>{" "}
                  on{" "}
                  <a href={`${photo.unsplashUrl}?utm_source=atlas_morocco&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-600">
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

  const tabs: { id: TabId; label: string; count?: number; Icon: typeof MapPin; render: () => React.ReactNode }[] = [
    { id: "overview", label: "Overview", Icon: MapPin, render: renderOverview },
    { id: "places", label: "Places", count: places.length, Icon: Star, render: renderPlaces },
    { id: "itineraries", label: "Itineraries", count: city.itineraries.length, Icon: CalendarDays, render: renderItineraries },
    { id: "gallery", label: "Gallery", count: photos.length, Icon: ImageIcon, render: renderGallery },
  ];

  return (
    <div className="w-full">
      {/* Sticks under the 64px site header so tabs stay reachable on long pages. */}
      <div id="city-tabs" className="sticky top-16 z-[1050] -mx-4 scroll-mt-16 border-b border-stone-200 bg-sand-50/95 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-none" role="tablist" aria-label={`${city.name} sections`}>
          {tabs.map(({ id, label, count, Icon }) => (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`${id}-panel`}
              data-testid={`tab-${id}`}
              onClick={() => selectTab(id)}
              className={cn(
                "relative flex flex-none items-center gap-2 whitespace-nowrap px-4 py-4 text-sm font-semibold transition-colors",
                activeTab === id ? "text-stone-900" : "text-stone-500 hover:text-stone-800"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {count !== undefined && (
                <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] font-bold", activeTab === id ? "bg-brand-600 text-white" : "bg-stone-200 text-stone-600")}>
                  {count}
                </span>
              )}
              {activeTab === id && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Only the active panel is rendered so the map only mounts when Overview is open. */}
      <div
        className="animate-fadeIn pt-8 sm:pt-10"
        key={activeTab}
        id={`${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        data-testid={`${activeTab}-panel`}
      >
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
      className="fixed inset-0 z-[1300] flex flex-col items-center justify-center bg-stone-950/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
      data-testid="lightbox"
    >
      <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white" aria-label="Close">
        <X className="h-7 w-7" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        className="absolute left-2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white sm:left-6"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-9 w-9" />
      </button>
      <div className="relative h-[75vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Image src={unsplashImage(photo.src, 1600)} alt={photo.alt} fill sizes="100vw" className="object-contain" />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        className="absolute right-2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white sm:right-6"
        aria-label="Next photo"
      >
        <ChevronRight className="h-9 w-9" />
      </button>
      <p className="mt-4 text-center text-sm text-white/90" onClick={(e) => e.stopPropagation()}>
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
