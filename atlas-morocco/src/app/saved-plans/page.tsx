"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Trash2, Plus, FolderOpen, CheckCircle2, Compass } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePlanContext } from "@/features/plan/PlanProvider";
import type { PlanPlace } from "@/features/plan/usePlan";
import { getCity } from "@/data/cities";
import { getCityCover, unsplashImage } from "@/data/cityImages";

interface SavedPlan {
  id: string;
  title: string;
  citySlug?: string | null;
  createdAt: string;
  updatedAt: string;
  items: PlanPlace[];
}

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin?callbackUrl=%2Fsaved-plans");
      return;
    }
    if (status !== "authenticated") return;

    let cancelled = false;
    fetch("/api/plans")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setPlans(data.plans || []);
      })
      .catch(() => {
        if (!cancelled) addToast({ type: "error", title: "Failed to load saved plans" });
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, router, addToast]);

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

  const header = (
    <PageHeader
      eyebrow="Your account"
      title="My Saved Plans"
      description="Every plan you build while signed in is saved here. Open one to keep editing it."
      actions={
        <Link href="/plan" className="btn-primary">
          <Plus className="h-4 w-4" />
          Go to Planner
        </Link>
      }
    />
  );

  if (status !== "authenticated" || isLoading) {
    return (
      <div className="container-pro py-10 sm:py-14">
        {header}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-stone-200" />
          ))}
        </div>
      </div>
    );
  }

  const allCities = new Set(plans.flatMap((plan) => citiesIn(plan.items)));

  return (
    <div className="container-pro py-10 sm:py-14">
      {header}

      {plans.length > 0 && (
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 sm:grid-cols-4">
          {[
            { value: plans.length, label: plans.length === 1 ? "Plan" : "Plans" },
            { value: plans.reduce((sum, plan) => sum + plan.items.length, 0), label: "Places" },
            { value: plans.reduce((sum, plan) => sum + totalDays(plan.items), 0), label: "Days planned" },
            { value: allCities.size, label: allCities.size === 1 ? "City" : "Cities" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white px-5 py-4">
              <dd className="font-display text-2xl font-bold text-stone-900">{value}</dd>
              <dt className="text-sm text-stone-500">{label}</dt>
            </div>
          ))}
        </dl>
      )}

      {plans.length === 0 ? (
        <div className="card mt-8 overflow-hidden">
          <div className="pattern-zellige bg-sand-100 px-6 py-16 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <CalendarDays className="h-7 w-7 text-brand-600" />
            </span>
            <h2 className="h3 mt-5">No Saved Plans Yet</h2>
            <p className="mx-auto mt-2 max-w-md text-stone-600">
              Add places from any city and your plan is saved here automatically while you&apos;re signed in.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/plan" className="btn-primary">
                <Plus className="h-4 w-4" />
                Create Your First Plan
              </Link>
              <Link href="/cities" className="btn-secondary">
                <Compass className="h-4 w-4" />
                Browse cities
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentPlan.cloudId === plan.id;
            const cities = citiesIn(plan.items);
            const cover = cities[0] ? getCityCover(cities[0]) : undefined;
            const days = totalDays(plan.items);
            return (
              <article key={plan.id} className="card flex flex-col overflow-hidden" data-testid="saved-plan">
                <div className="relative h-36 bg-sand-200">
                  {cover && (
                    <Image src={unsplashImage(cover, 700, 300)} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-3">
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                        <CheckCircle2 className="h-3 w-3" />
                        Open in planner
                      </span>
                    )}
                    {cities.slice(0, 3).map((slug) => (
                      <span key={slug} className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-stone-800">
                        {getCity(slug)?.name ?? slug}
                      </span>
                    ))}
                    {cities.length > 3 && <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-stone-800">+{cities.length - 3}</span>}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="h4 truncate">{plan.title}</h2>
                    <button
                      onClick={() => handleDeletePlan(plan)}
                      disabled={deletingPlanId === plan.id}
                      className="-mr-1 -mt-1 flex-none rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      aria-label={`Delete ${plan.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 flex items-center gap-3 text-sm text-stone-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {days} {days === 1 ? "day" : "days"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {plan.items.length} {plan.items.length === 1 ? "place" : "places"}
                    </span>
                  </p>

                  <ol className="mt-4 flex-1 space-y-1.5">
                    {plan.items.slice(0, 3).map((item, i) => (
                      <li key={item.id} className="flex items-center gap-2 text-sm text-stone-700">
                        <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">{i + 1}</span>
                        <span className="truncate">{item.name}</span>
                      </li>
                    ))}
                    {plan.items.length > 3 && <li className="pl-7 text-xs text-stone-500">+{plan.items.length - 3} more places</li>}
                  </ol>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                    <span className="text-xs text-stone-500">Updated {formatDate(plan.updatedAt)}</span>
                    <button onClick={() => handleOpenPlan(plan)} className="btn-secondary btn-sm text-sm" data-testid="open-plan">
                      <FolderOpen className="h-4 w-4" />
                      Open in planner
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
