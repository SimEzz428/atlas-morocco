"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Trash2,
  Plus,
  Building,
  ShoppingBag,
  Mountain,
  UtensilsCrossed,
  Coffee,
  Eye,
  Navigation,
  FolderOpen,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ToastProvider";
import { usePlanContext } from "@/features/plan/PlanProvider";
import type { PlanPlace } from "@/features/plan/usePlan";
import { getCity } from "@/data/cities";

interface SavedPlan {
  id: string;
  title: string;
  citySlug?: string | null;
  createdAt: string;
  updatedAt: string;
  items: PlanPlace[];
}

const CATEGORY_STYLES: Record<string, { Icon: typeof Building; className: string }> = {
  restaurant: { Icon: UtensilsCrossed, className: "bg-orange-100 text-orange-700" },
  food: { Icon: UtensilsCrossed, className: "bg-orange-100 text-orange-700" },
  cafe: { Icon: Coffee, className: "bg-yellow-100 text-yellow-700" },
  shopping: { Icon: ShoppingBag, className: "bg-purple-100 text-purple-700" },
  market: { Icon: ShoppingBag, className: "bg-purple-100 text-purple-700" },
  souk: { Icon: ShoppingBag, className: "bg-purple-100 text-purple-700" },
  nature: { Icon: Mountain, className: "bg-green-100 text-green-700" },
  garden: { Icon: Mountain, className: "bg-green-100 text-green-700" },
  beach: { Icon: Mountain, className: "bg-green-100 text-green-700" },
  viewpoint: { Icon: Eye, className: "bg-pink-100 text-pink-700" },
  view: { Icon: Eye, className: "bg-pink-100 text-pink-700" },
  daytrip: { Icon: Navigation, className: "bg-indigo-100 text-indigo-700" },
};
const DEFAULT_STYLE = { Icon: Building, className: "bg-blue-100 text-blue-700" };

const totalDays = (items: PlanPlace[]) => Math.max(1, ...items.map((item) => Number(item.day) || 1));
const citiesIn = (items: PlanPlace[]) => [...new Set(items.map((item) => item.city))];
const formatDate = (value: string) => new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function SavedPlansPage() {
  const { status } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  const { plan: currentPlan, loadPlan, forgetCloudPlan } = usePlanContext();
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const fetchSavedPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/plans");
      if (!response.ok) throw new Error("Failed to load");
      const data = await response.json();
      setPlans(data.plans || []);
    } catch {
      addToast({ type: "error", title: "Failed to load saved plans" });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin?callbackUrl=%2Fsaved-plans");
    } else if (status === "authenticated") {
      fetchSavedPlans();
    }
  }, [status, router, fetchSavedPlans]);

  const handleOpenPlan = (plan: SavedPlan) => {
    loadPlan({ id: plan.id, title: plan.title, items: plan.items });
    router.push("/plan");
  };

  const handleDeletePlan = async (plan: SavedPlan) => {
    if (!window.confirm(`Delete "${plan.title}"? This can't be undone.`)) return;

    setDeletingPlanId(plan.id);
    try {
      const response = await fetch(`/api/plans?planId=${encodeURIComponent(plan.id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setPlans((prev) => prev.filter((p) => p.id !== plan.id));
      forgetCloudPlan(plan.id);
      addToast({ type: "success", title: "Plan deleted" });
    } catch {
      addToast({ type: "error", title: "Failed to delete plan" });
    } finally {
      setDeletingPlanId(null);
    }
  };

  if (status !== "authenticated" || isLoading) {
    return (
      <div className="container-pro py-8">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const allCities = new Set(plans.flatMap((plan) => citiesIn(plan.items)));

  return (
    <div className="container-pro py-8">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="h1">My Saved Plans</h1>
            <p className="text-slate-600 mt-2">Open a plan to keep editing it, or start a new one.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/plan" className="btn-primary">
              <Plus className="h-4 w-4" />
              Go to Planner
            </Link>
            <Link href="/cities" className="btn-secondary">
              <MapPin className="h-4 w-4" />
              Explore Cities
            </Link>
          </div>
        </div>

        {plans.length === 0 ? (
          <Card>
            <div className="card-pad text-center py-12">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-slate-900 mb-2">No Saved Plans Yet</h2>
              <p className="text-slate-600 mb-6">Plans you build while signed in are saved here automatically.</p>
              <Link href="/plan" className="btn-primary">
                <Plus className="h-4 w-4" />
                Create Your First Plan
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = currentPlan.cloudId === plan.id;
              const cities = citiesIn(plan.items);
              return (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow" data-testid="saved-plan">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2 truncate">{plan.title}</h2>
                        <div className="flex flex-wrap gap-1.5">
                          {isCurrent && (
                            <Badge variant="success" size="sm">
                              <CheckCircle2 className="h-3 w-3" />
                              Open in planner
                            </Badge>
                          )}
                          {cities.slice(0, 3).map((slug) => (
                            <Badge key={slug} variant="accent" size="sm">
                              {getCity(slug)?.name ?? slug}
                            </Badge>
                          ))}
                          {cities.length > 3 && <Badge size="sm">+{cities.length - 3}</Badge>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlan(plan)}
                        disabled={deletingPlanId === plan.id}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        aria-label={`Delete ${plan.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {totalDays(plan.items)} {totalDays(plan.items) === 1 ? "day" : "days"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {plan.items.length} {plan.items.length === 1 ? "place" : "places"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {plan.items.slice(0, 3).map((item) => {
                        const { Icon, className } = CATEGORY_STYLES[item.category?.toLowerCase()] ?? DEFAULT_STYLE;
                        return (
                          <div key={item.id} className="flex items-center gap-2 text-sm">
                            <div className={`p-1 rounded ${className}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="text-slate-700 truncate flex-1">{item.name}</span>
                            <Badge size="sm">Day {item.day || 1}</Badge>
                          </div>
                        );
                      })}
                      {plan.items.length > 3 && <div className="text-xs text-slate-500">+{plan.items.length - 3} more places</div>}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-200">
                      <div className="text-xs text-slate-500">Updated {formatDate(plan.updatedAt)}</div>
                      <Button variant="secondary" size="sm" onClick={() => handleOpenPlan(plan)} data-testid="open-plan">
                        <FolderOpen className="h-4 w-4" />
                        Open in planner
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {plans.length > 0 && (
          <div className="bg-slate-50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Travel Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: plans.length, label: "Plans", color: "text-blue-600" },
                { value: plans.reduce((sum, plan) => sum + plan.items.length, 0), label: "Places", color: "text-green-600" },
                { value: plans.reduce((sum, plan) => sum + totalDays(plan.items), 0), label: "Days Planned", color: "text-purple-600" },
                { value: allCities.size, label: "Cities", color: "text-orange-600" },
              ].map(({ value, label, color }) => (
                <div key={label} className="text-center">
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-sm text-slate-600">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
