"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  Trash2, 
  GripVertical, 
  ArrowRight, 
  Star, 
  Users,
  Navigation,
  RotateCcw,
  Settings,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Cloud,
  User,
  Building,
  ShoppingBag,
  Mountain,
  UtensilsCrossed,
  Coffee,
  Eye,
  Globe,
  Save
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { 
  optimizeRoute, 
  formatDistance, 
  formatTime, 
  getRouteStats,
  type Point,
  type Route 
} from "@/features/planner/utils/geo";
import { usePlanContext } from "@/features/plan/PlanProvider";
import { SyncStatus } from "@/components/SyncStatus";
import { SyncStatusCard } from "@/components/SyncStatusCard";
import nextDynamic from "next/dynamic";
const PlannerMap = nextDynamic(() => import("@/components/PlannerMap"), { ssr: false });

// Simple map placeholder component for now
const MapPlaceholder = ({ points, height }: { points: any[], height: number }) => (
  <div className="h-96 flex items-center justify-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
    <div className="text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPin className="h-8 w-8 text-amber-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Interactive Map</h3>
      <p className="text-slate-600 mb-4">
        {points.length > 0 
          ? `Showing ${points.length} destination${points.length === 1 ? '' : 's'} on the map`
          : 'Add destinations to see them on the map'
        }
      </p>
      {points.length > 0 && (
        <div className="space-y-2">
          {points.map((point, index) => (
            <div key={point.id} className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-800">
                {index + 1}
              </div>
              <span>{point.name || `Point ${index + 1}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

interface PlanItem {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  blurb?: string;
  estimatedTime?: number; // in minutes
}

interface PlannerProps {
  initialItems?: PlanItem[];
}

// Sortable Item Component
function SortableItem({ item, index, onRemove }: { 
  item: PlanItem; 
  index: number; 
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Get category icon
  const getCategoryIcon = (category: string | undefined) => {
    if (!category || typeof category !== 'string') {
      return MapPin;
    }
    
    const icons: Record<string, any> = {
      'mosque': Building,
      'market': ShoppingBag,
      'palace': Building,
      'garden': Mountain,
      'museum': Building,
      'restaurant': UtensilsCrossed,
      'cafe': Coffee,
      'viewpoint': Eye,
      'beach': Globe,
      'mountain': Mountain,
      'desert': Mountain,
      'medina': Building,
      'food': UtensilsCrossed,
      'architecture': Building,
      'culture': Star,
      'nature': Mountain,
      'shopping': ShoppingBag,
      'view': Eye,
      'daytrip': Navigation,
    };
    return icons[category.toLowerCase()] || MapPin;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors"
      data-testid="plan-item"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-slate-400 hover:text-slate-600 transition-colors"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
        {React.createElement(getCategoryIcon(item.category), { className: "h-4 w-4 text-amber-600" })}
      </div>
      <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-800">
        {index + 1}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-900">{item.name}</h4>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Badge variant="accent" className="text-xs">{item.category}</Badge>
          {item.blurb && (
            <span className="text-slate-500 italic">"{item.blurb}"</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="accent" className="text-xs">
          {formatTime(item.estimatedTime || 60)}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function Planner({ initialItems = [] }: PlannerProps) {
  const { data: session, status } = useSession();
  const { plan, isSyncing, lastSyncTime, addPlace, removePlace, reorderItems, clear, setMeta, savePlan } = usePlanContext();
  const [useOptimization, setUseOptimization] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [isSaving, setIsSaving] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Convert plan items to points for route optimization
  const points: Point[] = useMemo(() => 
    plan.items.map(item => ({
      id: item.id,
      lat: item.lat || 31.6295,
      lon: item.lon || -7.9811,
      name: item.name
    })), [plan.items]
  );

  // Calculate optimized route
  const optimizedRoute: Route = useMemo(() => {
    if (points.length === 0) {
      return { points: [], totalDistance: 0, totalTime: 0 };
    }
    return optimizeRoute(points, useOptimization);
  }, [points, useOptimization]);

  // Distribute items across days
  const days = useMemo(() => {
    if (plan.items.length === 0) return [];
    
    const itemsPerDay = Math.ceil(plan.items.length / plan.days);
    const daysArray = [];
    
    for (let day = 0; day < plan.days; day++) {
      const startIndex = day * itemsPerDay;
      const endIndex = Math.min(startIndex + itemsPerDay, plan.items.length);
      const dayItems = optimizedRoute.points
        .slice(startIndex, endIndex)
        .map(point => plan.items.find(item => item.id === point.id)!)
        .filter(Boolean);
      
      const estimatedTime = dayItems.reduce((total, item) => total + 60, 0); // Default 60 minutes per place
      const estimatedCost = dayItems.reduce((total, item) => {
        // Estimate cost based on category (simplified)
        return total + 50; // Default 50 MAD per place
      }, 0);
      
      daysArray.push({
        dayNumber: day + 1,
        items: dayItems,
        estimatedTime,
        estimatedCost
      });
    }
    
    return daysArray;
  }, [plan.items, plan.days, optimizedRoute]);

  const removeItem = (itemId: string) => {
    removePlace(itemId);
  };

  const clearPlan = () => {
    clear();
  };

  const handleSavePlan = async () => {
    if (plan.items.length === 0) {
      alert("Add some places to your plan before saving!");
      return;
    }

    // Wait for session to load if it's still loading
    if (status === "loading") {
      alert("Please wait, session is loading...");
      return;
    }

    setIsSaving(true);
    try {
      await savePlan(plan.title);
    } finally {
      setIsSaving(false);
    }
  };


  const toggleDayExpansion = (dayNumber: number) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = plan.items.findIndex(item => item.id === active.id);
      const newIndex = plan.items.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderItems(oldIndex, newIndex);
      }
    }
  };

  const routeStats = getRouteStats(optimizedRoute);


  return (
    <div className="min-h-screen bg-slate-50" data-testid="planner">
      <div className="container-pro py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="h1 mb-2">Trip Planner</h1>
              <p className="lead">
                Plan your perfect Morocco itinerary with intelligent route optimization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setUseOptimization(!useOptimization)}
                className={useOptimization ? "bg-green-50 text-green-700 border-green-200" : ""}
              >
                <Navigation className="h-4 w-4" />
                {useOptimization ? "Optimized" : "Optimize Route"}
              </Button>
              
              <Button
                onClick={handleSavePlan}
                disabled={isSaving || plan.items.length === 0}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Plan"}
              </Button>
              
              {session ? (
                <div className="flex items-center gap-2">
                  {/* Manual sync buttons removed - sync is now automatic */}
                </div>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="secondary">
                    <User className="h-4 w-4" />
                    Sign In to Sync
                  </Button>
                </Link>
              )}
              
              {/* Cloud sync status indicator */}
              <SyncStatus isSyncing={isSyncing} lastSyncTime={lastSyncTime} />
            </div>
          </div>

          {/* Trip Settings */}
          <Card className="mb-6">
            <div className="card-pad">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Trip Title
                  </label>
                  <input
                    type="text"
                    value={plan.title}
                    onChange={(e) => setMeta({ title: e.target.value })}
                    className="input"
                    placeholder="My Morocco Adventure"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={plan.days}
                    onChange={(e) => setMeta({ days: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="input"
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="secondary" onClick={clearPlan} className="w-full" data-testid="plan-clear">
                    <Trash2 className="h-4 w-4" />
                    Clear Plan
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Sync Status */}
          <SyncStatusCard lastSyncTime={lastSyncTime} />

          {/* Trip Statistics */}
          {plan.items.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Card className="text-center">
                <div className="card-pad-sm">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {plan.items.length}
                  </div>
                  <div className="text-sm text-slate-600">Attractions</div>
                </div>
              </Card>
              <Card className="text-center">
                <div className="card-pad-sm">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {routeStats.totalDistance}
                  </div>
                  <div className="text-sm text-slate-600">Total Distance</div>
                </div>
              </Card>
              <Card className="text-center">
                <div className="card-pad-sm">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {routeStats.totalTime}
                  </div>
                  <div className="text-sm text-slate-600">Travel Time</div>
                </div>
              </Card>
              <Card className="text-center">
                <div className="card-pad-sm">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {plan.days}
                  </div>
                  <div className="text-sm text-slate-600">Days</div>
                </div>
              </Card>
              <Card className="text-center">
                <div className="card-pad-sm">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    ~{days.reduce((total, day) => total + day.estimatedCost, 0)} MAD
                  </div>
                  <div className="text-sm text-slate-600">Est. Total Cost</div>
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Trip Timeline */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="h2">Trip Timeline</h2>
              <Link href="/cities">
                <Button variant="primary">
                  <Plus className="h-4 w-4" />
                  Add Destinations
                </Button>
              </Link>
            </div>

            {plan.items.length === 0 ? (
              <Card>
                <div className="card-pad text-center py-12">
                  <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="h3 mb-2">Start Building Your Trip</h3>
                  <p className="text-slate-600 mb-6">
                    Add attractions from cities to create your perfect Morocco itinerary.
                  </p>
                  <Link href="/cities">
                    <Button variant="primary">
                      <Plus className="h-4 w-4" />
                      Add Your First Destination
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {days.map((day) => (
                  <Card key={day.dayNumber}>
                    <div className="card-pad">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-amber-700">
                              {day.dayNumber}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              Day {day.dayNumber}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {day.items.length} places • {formatTime(day.estimatedTime)} • ~{day.estimatedCost} MAD
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleDayExpansion(day.dayNumber)}
                        >
                          {expandedDays.has(day.dayNumber) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {expandedDays.has(day.dayNumber) && (
                        <div className="space-y-3">
                          {day.items.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <Calendar className="h-8 w-8 mx-auto mb-2" />
                              <p>No places added for this day</p>
                            </div>
                          ) : (
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={handleDragEnd}
                            >
                              <SortableContext
                                items={day.items.map(item => item.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                {day.items.map((item, index) => (
                                  <SortableItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    onRemove={removeItem}
                                  />
                                ))}
                              </SortableContext>
                            </DndContext>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Map */}
          <div>
            <div className="mb-6">
              <h2 className="h2 mb-4">Route Map</h2>
              <Card className="overflow-hidden">
                <div className="h-96">
                  <PlannerMap 
                    points={optimizedRoute.points}
                    height={384}
                  />
                </div>
              </Card>
            </div>

            {/* Route Information */}
            {optimizedRoute.points.length > 0 && (
              <Card>
                <div className="card-pad">
                  <h3 className="h3 mb-4">Route Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Total Distance</span>
                      <span className="font-semibold">{routeStats.totalDistance}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Travel Time</span>
                      <span className="font-semibold">{routeStats.totalTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Average per Place</span>
                      <span className="font-semibold">
                        {formatTime(routeStats.averageTimePerPoint)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Optimization</span>
                      <Badge variant={useOptimization ? "brand" : "default"}>
                        {useOptimization ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
