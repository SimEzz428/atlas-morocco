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
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Calendar,
  MapPin,
  Trash2,
  GripVertical,
  Star,
  Navigation,
  ChevronDown,
  ChevronUp,
  User,
  Building,
  ShoppingBag,
  Mountain,
  UtensilsCrossed,
  Coffee,
  Eye,
  Globe,
  Save,
  FilePlus,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { optimizeRoute, calculateRouteDistance, calculateRouteTime, formatDistance, formatTime } from "@/features/planner/utils/geo";
import { splitIntoDays, summarizeDay, DEFAULT_VISIT_MINUTES } from "@/features/planner/utils/itinerary";
import { usePlanContext } from "@/features/plan/PlanProvider";
import type { PlanPlace } from "@/features/plan/usePlan";
import { SyncStatus } from "@/components/SyncStatus";
import TripShare from "@/components/TripShare";
import { getCity } from "@/data/cities";
import nextDynamic from "next/dynamic";

const PlannerMap = nextDynamic(() => import("@/components/PlannerMap"), {
  ssr: false,
  loading: () => <div className="h-96 bg-slate-100 animate-pulse" />,
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

const cityName = (slug: string) => getCity(slug)?.name ?? slug;

function SortableItem({ item, index, onRemove }: { item: PlanPlace; index: number; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const Icon = CATEGORY_ICONS[item.category?.toLowerCase()] ?? MapPin;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors"
      data-testid="plan-item"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none"
        aria-label={`Drag to reorder ${item.name}`}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-800 flex-shrink-0">
        {index + 1}
      </div>
      <div className="w-8 h-8 bg-amber-100 rounded-lg hidden sm:flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 truncate">{item.name}</h4>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{cityName(item.city)}</span>
          <span>·</span>
          <span className="capitalize">{item.category === "daytrip" ? "Day trip" : item.category}</span>
        </div>
      </div>
      <Badge variant="accent" size="sm" className="hidden sm:inline-flex">
        {formatTime(item.visitTime ?? DEFAULT_VISIT_MINUTES)}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
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

  // Global index of each item, so stop numbers continue across days.
  const indexById = new Map(plan.items.map((item, i) => [item.id, i]));

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container-pro py-8 space-y-6">
          <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="planner">
      <div className="container-pro py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="h1 mb-2">Trip Planner</h1>
              <p className="lead">Arrange your places into days and find the shortest route between them.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                onClick={handleOptimize}
                disabled={!canOptimize}
                title={canOptimize ? "Reorder stops to minimize travel distance" : "Your route is already in its shortest order"}
                data-testid="optimize-route"
              >
                <Navigation className="h-4 w-4" />
                {canOptimize ? `Optimize route (save ${formatDistance(totals.distance - optimized!.totalDistance)})` : "Route optimized"}
              </Button>

              <Button onClick={() => savePlan()} disabled={isSyncing || plan.items.length === 0} data-testid="save-plan">
                <Save className="h-4 w-4" />
                {isSyncing ? "Saving..." : "Save Plan"}
              </Button>

              {plan.items.length > 0 && (
                <TripShare
                  tripTitle={plan.title}
                  tripDuration={plan.days}
                  planItems={plan.items}
                  routeStats={{ totalDistance: formatDistance(totals.distance), totalTime: formatTime(totals.travelTime) }}
                  days={days}
                />
              )}

              {status === "unauthenticated" && (
                <Link href="/auth/signin?callbackUrl=%2Fplan" className="btn-secondary">
                  <User className="h-4 w-4" />
                  Sign In to Sync
                </Link>
              )}
            </div>
          </div>
          <SyncStatus isSyncing={isSyncing} lastSyncTime={lastSyncTime} isSaved={Boolean(plan.cloudId)} />

          <Card className="my-6">
            <div className="card-pad">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="trip-title" className="block text-sm font-medium text-slate-700 mb-2">
                    Trip Title
                  </label>
                  <input
                    id="trip-title"
                    type="text"
                    value={plan.title}
                    maxLength={120}
                    onChange={(e) => setMeta({ title: e.target.value })}
                    onBlur={(e) => !e.target.value.trim() && setMeta({ title: "My Morocco Trip" })}
                    className="input"
                    placeholder="My Morocco Adventure"
                  />
                </div>
                <div>
                  <label htmlFor="trip-days" className="block text-sm font-medium text-slate-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    id="trip-days"
                    type="number"
                    min={1}
                    max={30}
                    value={plan.days}
                    onChange={(e) => setMeta({ days: Math.min(30, Math.max(1, parseInt(e.target.value) || 1)) })}
                    className="input"
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="secondary" onClick={handleClear} className="w-full" data-testid="plan-clear">
                    <FilePlus className="h-4 w-4" />
                    New Plan
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {plan.items.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6" data-testid="trip-stats">
              {[
                { value: plan.items.length, label: "Places" },
                { value: formatDistance(totals.distance), label: "Total Distance" },
                { value: formatTime(totals.travelTime), label: "Travel Time" },
                { value: plan.days, label: plan.days === 1 ? "Day" : "Days" },
                { value: `~${totals.cost} MAD`, label: "Entry Fees", accent: true },
              ].map(({ value, label, accent }) => (
                <Card key={label} className="text-center">
                  <div className="card-pad-sm">
                    <div className={`text-2xl font-bold mb-1 ${accent ? "text-green-600" : "text-slate-900"}`}>{value}</div>
                    <div className="text-sm text-slate-600">{label}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="h2">Trip Timeline</h2>
              <Link href="/cities" className="btn-primary">
                <Plus className="h-4 w-4" />
                Add Places
              </Link>
            </div>

            {plan.items.length === 0 ? (
              <Card>
                <div className="card-pad text-center py-12">
                  <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="h3 mb-2">Start Building Your Trip</h3>
                  <p className="text-slate-600 mb-6">
                    Open a city and tap <strong>Add to Plan</strong> on the places you want to visit.
                  </p>
                  <Link href="/cities" className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Add Your First Destination
                  </Link>
                </div>
              </Card>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-4">
                  {days.map((day) => {
                    const expanded = !collapsedDays.has(day.dayNumber);
                    return (
                      <Card key={day.dayNumber} data-testid="plan-day">
                        <div className="card-pad">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-bold text-amber-700">{day.dayNumber}</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900">Day {day.dayNumber}</h3>
                                <p className="text-sm text-slate-600">
                                  {day.items.length} {day.items.length === 1 ? "place" : "places"}
                                  {day.items.length > 0 && (
                                    <>
                                      {" "}· ~{formatTime(day.totalMinutes)}
                                      {day.travelMinutes >= 1 && ` (incl. ${formatTime(day.travelMinutes)} travel)`}
                                      {day.costMad > 0 && ` · ~${day.costMad} MAD`}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleDay(day.dayNumber)}
                              aria-expanded={expanded}
                              aria-label={expanded ? `Collapse day ${day.dayNumber}` : `Expand day ${day.dayNumber}`}
                            >
                              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>

                          {expanded && (
                            <div className="space-y-3 mt-4">
                              {day.items.length === 0 ? (
                                <div className="text-center py-6 text-slate-500">
                                  <Calendar className="h-8 w-8 mx-auto mb-2" />
                                  <p>A free day. Add more places or relax!</p>
                                </div>
                              ) : (
                                <SortableContext items={day.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                                  {day.items.map((item) => (
                                    <SortableItem key={item.id} item={item} index={indexById.get(item.id) ?? 0} onRemove={removePlace} />
                                  ))}
                                </SortableContext>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </DndContext>
            )}
          </div>

          <div className="lg:sticky lg:top-24 self-start w-full">
            <h2 className="h2 mb-6">Route Map</h2>
            <Card>
              <div className="h-96 relative z-0">
                <PlannerMap points={points} height={384} />
              </div>
            </Card>
            {plan.items.length > 0 && (
              <p className="text-sm text-slate-500 mt-3">
                Numbers follow your visiting order. Travel times assume ~30 km/h door to door.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
