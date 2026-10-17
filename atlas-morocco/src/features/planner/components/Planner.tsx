"use client";

import React, { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Minus,
  MapPin,
  Trash2,
  GripVertical,
  Star,
  Navigation,
  ChevronDown,
  Building,
  ShoppingBag,
  Mountain,
  UtensilsCrossed,
  Coffee,
  Eye,
  Globe,
  Save,
  FilePlus,
  Clock,
  Wallet,
  Check,
  LogIn,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { optimizeRoute, calculateRouteDistance, calculateRouteTime, formatDistance, formatTime } from "@/features/planner/utils/geo";
import { splitIntoDays, summarizeDay, DEFAULT_VISIT_MINUTES } from "@/features/planner/utils/itinerary";
import { usePlanContext } from "@/features/plan/PlanProvider";
import type { PlanPlace } from "@/features/plan/usePlan";
import { SyncStatus } from "@/components/SyncStatus";
import TripShare from "@/components/TripShare";
import { CITIES, getCity } from "@/data/cities";
import { cn } from "@/lib/utils";
import nextDynamic from "next/dynamic";

const PlannerMap = nextDynamic(() => import("@/components/PlannerMap"), {
  ssr: false,
  loading: () => <div className="h-full animate-pulse bg-stone-100" />,
});

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  mosque: Building,
  market: ShoppingBag,
  souk: ShoppingBag,
  palace: Building,
  garden: Mountain,
  museum: Building,
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  viewpoint: Eye,
  view: Eye,
  beach: Globe,
  medina: Building,
  food: UtensilsCrossed,
  architecture: Building,
  culture: Star,
  nature: Mountain,
  shopping: ShoppingBag,
  daytrip: Navigation,
};

const MAX_DAYS = 30;
const cityName = (slug: string) => getCity(slug)?.name ?? slug;

function SortableItem({ item, index, onRemove }: { item: PlanPlace; index: number; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const Icon = CATEGORY_ICONS[item.category?.toLowerCase()] ?? MapPin;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 transition-shadow",
        isDragging ? "z-10 shadow-lg ring-2 ring-brand-300" : "hover:shadow-sm"
      )}
      data-testid="plan-item"
    >
      <button
        {...attributes}
        {...listeners}
        className="-m-1 cursor-grab touch-none rounded-md p-1 text-stone-300 hover:text-stone-600 active:cursor-grabbing"
        aria-label={`Drag to reorder ${item.name}`}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="truncate font-semibold text-stone-900">{item.name}</h4>
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <Icon className="h-3.5 w-3.5" />
          <span className="truncate">
            {cityName(item.city)} · {item.category === "daytrip" ? "Day trip" : item.category}
          </span>
        </div>
      </div>
      <span className="hidden flex-none items-center gap-1 text-xs font-medium text-stone-500 sm:inline-flex">
        <Clock className="h-3.5 w-3.5" />
        {formatTime(item.visitTime ?? DEFAULT_VISIT_MINUTES)}
      </span>
      <button
        onClick={() => onRemove(item.id)}
        className="flex-none rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyPlanner() {
  const suggestions = ["marrakech", "fes", "chefchaouen", "essaouira"].map((slug) => getCity(slug)).filter(Boolean);
  return (
    <div className="card overflow-hidden">
      <div className="pattern-zellige bg-sand-100 px-6 py-14 text-center sm:py-20">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
          <MapPin className="h-7 w-7 text-brand-600" />
        </span>
        <h2 className="h3 mt-5">Start Building Your Trip</h2>
        <p className="mx-auto mt-2 max-w-md text-stone-600">
          Open a city and tap <strong>Add to Plan</strong> on the places you want to see. They&apos;ll appear here,
          split into days and ordered into a route.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {suggestions.map((city) => (
            <Link key={city!.slug} href={`/cities/${city!.slug}#places`} className="chip">
              {city!.name}
            </Link>
          ))}
          <Link href="/cities" className="chip chip-active">
            All {CITIES.length} cities
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Planner() {
  const { status } = useSession();
  const { plan, isHydrated, isSyncing, lastSyncTime, removePlace, reorderItems, setOrder, clear, setMeta, savePlan } = usePlanContext();
  const [collapsedDays, setCollapsedDays] = useState<Set<number>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const points = useMemo(
    () => plan.items.map((item) => ({ id: item.id, lat: item.lat, lon: item.lon, name: item.name, category: item.category })),
    [plan.items]
  );

  const days = useMemo(
    () =>
      splitIntoDays(plan.items, plan.days).map((items, i) => ({
        dayNumber: i + 1,
        items,
        ...summarizeDay(items),
      })),
    [plan.items, plan.days]
  );

  const totals = useMemo(
    () => ({
      distance: calculateRouteDistance(points),
      travelTime: calculateRouteTime(points),
      cost: days.reduce((sum, d) => sum + d.costMad, 0),
    }),
    [points, days]
  );

  // Ordering is only worth suggesting when the optimized route is meaningfully shorter.
  const optimized = useMemo(() => (points.length > 2 ? optimizeRoute(points) : null), [points]);
  const canOptimize = optimized !== null && optimized.totalDistance < totals.distance - 0.05;
  const cities = [...new Set(plan.items.map((i) => i.city))];

  const handleOptimize = () => {
    if (optimized) setOrder(optimized.points.map((p) => p.id));
  };

  const handleClear = () => {
    if (plan.items.length > 0 && !window.confirm("Start a new plan? Your current places will be removed from this page (saved plans stay in your account).")) return;
    clear();
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = plan.items.findIndex((item) => item.id === active.id);
    const newIndex = plan.items.findIndex((item) => item.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) reorderItems(oldIndex, newIndex);
  };

  const toggleDay = (dayNumber: number) => {
    setCollapsedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNumber)) next.delete(dayNumber);
      else next.add(dayNumber);
      return next;
    });
  };

  const setDays = (value: number) => setMeta({ days: Math.min(MAX_DAYS, Math.max(1, value || 1)) });

  // Global index of each item, so stop numbers continue across days.
  const indexById = new Map(plan.items.map((item, i) => [item.id, i]));

  if (!isHydrated) {
    return (
      <div className="container-pro space-y-6 py-10">
        <div className="h-12 w-72 animate-pulse rounded-xl bg-stone-200" />
        <div className="h-16 animate-pulse rounded-2xl bg-stone-200" />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="h-96 animate-pulse rounded-2xl bg-stone-200" />
          <div className="h-96 animate-pulse rounded-2xl bg-stone-200" />
        </div>
      </div>
    );
  }

  const hasItems = plan.items.length > 0;

  return (
    <div className="container-pro py-8 sm:py-10" data-testid="planner">
      {/* Header: editable title, trip length and actions */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Trip planner</p>
          <label htmlFor="trip-title" className="sr-only">
            Trip Title
          </label>
          <div className="group relative mt-1 inline-block max-w-full">
            <input
              id="trip-title"
              type="text"
              value={plan.title}
              maxLength={120}
              onChange={(e) => setMeta({ title: e.target.value })}
              onBlur={(e) => !e.target.value.trim() && setMeta({ title: "My Morocco Trip" })}
              // Sized to the text so the edit pencil sits right after the title.
              style={{ width: `${Math.max(plan.title.length, 10) + 3}ch` }}
              className="max-w-full rounded-xl border border-transparent bg-transparent py-1 pl-0 pr-10 font-display text-3xl font-bold tracking-tight text-stone-900 transition-colors hover:border-stone-200 hover:bg-white hover:pl-3 focus:border-brand-400 focus:bg-white focus:pl-3 focus:outline-none focus:ring-4 focus:ring-brand-100 sm:text-4xl"
              placeholder="Name your trip"
            />
            <Pencil className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-300 group-hover:text-stone-500" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="inline-flex items-center rounded-xl border border-stone-300 bg-white">
              <button
                onClick={() => setDays(plan.days - 1)}
                disabled={plan.days <= 1}
                className="rounded-l-xl p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-40"
                aria-label="Fewer days"
              >
                <Minus className="h-4 w-4" />
              </button>
              <label htmlFor="trip-days" className="sr-only">
                Duration (days)
              </label>
              <input
                id="trip-days"
                type="number"
                min={1}
                max={MAX_DAYS}
                value={plan.days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-10 border-x border-stone-200 bg-transparent py-1.5 text-center text-sm font-semibold text-stone-900 [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setDays(plan.days + 1)}
                disabled={plan.days >= MAX_DAYS}
                className="rounded-r-xl p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-40"
                aria-label="More days"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-stone-600">{plan.days === 1 ? "day" : "days"}</span>
            {cities.length > 0 && (
              <span className="text-sm text-stone-500">
                · {cities.map(cityName).join(", ")}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasItems && (
            <button
              onClick={handleOptimize}
              disabled={!canOptimize}
              className={cn("btn", canOptimize ? "btn-soft" : "border border-stone-200 bg-white text-stone-500")}
              title={canOptimize ? "Reorder stops to minimize travel distance" : "Your route is already in its shortest order"}
              data-testid="optimize-route"
            >
              {canOptimize ? <Navigation className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              {canOptimize ? `Optimize route (save ${formatDistance(totals.distance - optimized!.totalDistance)})` : "Route optimized"}
            </button>
          )}
          {hasItems && (
            <TripShare
              tripTitle={plan.title}
              tripDuration={plan.days}
              planItems={plan.items}
              routeStats={{ totalDistance: formatDistance(totals.distance), totalTime: formatTime(totals.travelTime) }}
              days={days}
            />
          )}
          {hasItems && (
            <>
              <button onClick={() => savePlan()} disabled={isSyncing} className="btn-primary" data-testid="save-plan">
                <Save className="h-4 w-4" />
                {isSyncing ? "Saving..." : "Save Plan"}
              </button>
              <button onClick={handleClear} className="btn-ghost" data-testid="plan-clear" title="Start a new plan">
                <FilePlus className="h-4 w-4" />
                New Plan
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
        <SyncStatus isSyncing={isSyncing} lastSyncTime={lastSyncTime} isSaved={Boolean(plan.cloudId)} />
        {status === "unauthenticated" && (
          <Link href="/auth/signin?callbackUrl=%2Fplan" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
            <LogIn className="h-4 w-4" />
            Sign In to Sync
          </Link>
        )}
      </div>

      {!hasItems ? (
        <div className="mt-8">
          <EmptyPlanner />
        </div>
      ) : (
        <>
          <dl className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-stone-200 bg-white sm:grid-cols-4" data-testid="trip-stats">
            {[
              { value: plan.items.length, label: plan.items.length === 1 ? "Place" : "Places", icon: MapPin },
              { value: formatDistance(totals.distance), label: "Total distance", icon: Navigation },
              { value: formatTime(totals.travelTime), label: "Travel time", icon: Clock },
              { value: `~${totals.cost} MAD`, label: "Entry fees", icon: Wallet },
            ].map(({ value, label, icon: Icon }, i) => (
              <div key={label} className={cn("flex items-center gap-3 p-4", i % 2 === 1 && "border-l border-stone-100", i >= 2 && "border-t border-stone-100 sm:border-t-0", i === 2 && "sm:border-l")}>
                <Icon className="h-5 w-5 flex-none text-brand-600" />
                <div>
                  <dd className="font-display text-lg font-bold text-stone-900">{value}</dd>
                  <dt className="text-xs text-stone-500">{label}</dt>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="h3">Itinerary</h2>
                <Link href="/cities" className="btn-secondary btn-sm text-sm">
                  <Plus className="h-4 w-4" />
                  Add Places
                </Link>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <ol className="space-y-4">
                  {days.map((day) => {
                    const expanded = !collapsedDays.has(day.dayNumber);
                    return (
                      <li key={day.dayNumber} className="card" data-testid="plan-day">
                        <button
                          onClick={() => toggleDay(day.dayNumber)}
                          aria-expanded={expanded}
                          aria-label={expanded ? `Collapse day ${day.dayNumber}` : `Expand day ${day.dayNumber}`}
                          className="flex w-full items-center gap-3 p-4 text-left"
                        >
                          <span className="flex h-10 w-10 flex-none flex-col items-center justify-center rounded-xl bg-sand-100 leading-none">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">Day</span>
                            <span className="font-display text-base font-bold text-stone-900">{day.dayNumber}</span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-stone-900">
                              {day.items.length === 0 ? "Free day" : `${day.items.length} ${day.items.length === 1 ? "place" : "places"}`}
                            </span>
                            {day.items.length > 0 && (
                              <span className="block text-sm text-stone-500">
                                ~{formatTime(day.totalMinutes)}
                                {day.travelMinutes >= 1 && ` (incl. ${formatTime(day.travelMinutes)} travel)`}
                                {day.costMad > 0 && ` · ~${day.costMad} MAD`}
                              </span>
                            )}
                          </span>
                          <ChevronDown className={cn("h-5 w-5 flex-none text-stone-400 transition-transform", expanded && "rotate-180")} />
                        </button>

                        {expanded && (
                          <div className="space-y-2 border-t border-stone-100 p-3 sm:p-4">
                            {day.items.length === 0 ? (
                              <p className="py-4 text-center text-sm text-stone-500">Nothing planned. Add more places, or enjoy a slow day.</p>
                            ) : (
                              <SortableContext items={day.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                                {day.items.map((item) => (
                                  <SortableItem key={item.id} item={item} index={indexById.get(item.id) ?? 0} onRemove={removePlace} />
                                ))}
                              </SortableContext>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </DndContext>
              <p className="mt-3 text-xs text-stone-500">Drag the handle to reorder stops. Stops are spread evenly across your days in order.</p>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="h3 mb-4">Route map</h2>
              <div className="card overflow-hidden">
                <div className="relative z-0 h-80 sm:h-[28rem]">
                  <PlannerMap points={points} />
                </div>
              </div>
              <p className="mt-3 text-xs text-stone-500">Numbers follow your visiting order. Travel times assume ~30 km/h door to door.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
