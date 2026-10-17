// Persistent client-side store for the current trip plan, with automatic cloud sync for signed-in users
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ToastProvider";
import { assignDays } from "@/features/planner/utils/itinerary";

export type PlanPlace = {
  id: string;         // `${citySlug}:${name}`
  name: string;
  city: string;       // city slug
  day: number;        // 1..N, assigned from the item's position when the plan is saved
  lat: number;
  lon: number;
  note?: string;
  category: string;   // place category for icon display
  visitTime?: number; // minutes
  cost?: string;      // e.g. "70 MAD"
};

export type TripPlan = {
  title: string;
  startDate?: string; // ISO
  days: number;
  items: PlanPlace[];
  cloudId?: string;   // id of the saved plan this local plan is synced to
};

export type SavedPlan = { id: string; title: string; items: PlanPlace[] };

const STORAGE_KEY = "atlas.plan.v1";
const SYNC_DELAY_MS = 1500;

const DEFAULT_PLAN: TripPlan = {
  title: "My Morocco Trip",
  days: 3,
  items: [],
};

export const placeKey = (citySlug: string, name: string) => `${citySlug}:${name}`;

function readStoredPlan(): TripPlan {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PLAN;
    const stored = JSON.parse(raw);
    if (!stored || !Array.isArray(stored.items)) return DEFAULT_PLAN;
    return { ...DEFAULT_PLAN, ...stored };
  } catch {
    return DEFAULT_PLAN;
  }
}

export function usePlan() {
  const [plan, setPlan] = useState<TripPlan>(DEFAULT_PLAN);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const { addToast } = useToast();

  // The cloud id is mirrored in a ref so back-to-back saves update the same row instead of creating duplicates.
  const cloudIdRef = useRef<string | undefined>(undefined);
  const lastSyncedRef = useRef<string | null>(null);
  const syncQueueRef = useRef<Promise<unknown>>(Promise.resolve());
  const syncErrorShownRef = useRef(false);

  // localStorage only exists in the browser, so the saved plan is read after mount;
  // reading it during render would make the server and client HTML disagree.
  useEffect(() => {
    const stored = readStoredPlan();
    cloudIdRef.current = stored.cloudId;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
    setPlan(stored);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // Storage can be full or disabled (private mode); the plan still works for this session.
    }
  }, [plan, isHydrated]);

  // A different account must not inherit the previous account's sync state.
  useEffect(() => {
    lastSyncedRef.current = null;
  }, [userId]);

  const pushToCloud = useCallback((current: TripPlan) => {
    const run = async () => {
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cloudIdRef.current,
          title: current.title,
          items: assignDays(current.items, current.days),
        }),
      });
      if (!response.ok) throw new Error(`Saving plan failed (${response.status})`);
      const { tripPlan } = (await response.json()) as { tripPlan: { id: string } };
      cloudIdRef.current = tripPlan.id;
      lastSyncedRef.current = JSON.stringify([current.title, current.days, current.items]);
      setLastSyncTime(new Date());
      setPlan((p) => (p.cloudId === tripPlan.id ? p : { ...p, cloudId: tripPlan.id }));
      return tripPlan;
    };
    const next = syncQueueRef.current.then(run, run);
    syncQueueRef.current = next.catch(() => undefined);
    return next;
  }, []);

  // Auto-sync: debounced, skipped for empty plans and for changes that are already in the cloud.
  useEffect(() => {
    if (!isHydrated || !userId || plan.items.length === 0) return;
    const snapshot = JSON.stringify([plan.title, plan.days, plan.items]);
    if (snapshot === lastSyncedRef.current) return;

    const timeout = setTimeout(async () => {
      setIsSyncing(true);
      try {
        await pushToCloud(plan);
        syncErrorShownRef.current = false;
      } catch {
        if (!syncErrorShownRef.current) {
          addToast({
            type: "error",
            title: "Sync failed",
            message: "Your plan is still saved on this device. We'll retry on your next change.",
          });
          syncErrorShownRef.current = true;
        }
      } finally {
        setIsSyncing(false);
      }
    }, SYNC_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [plan, userId, isHydrated, pushToCloud, addToast]);

  const setMeta = useCallback((partial: Partial<Pick<TripPlan, "title" | "days" | "startDate">>) => {
    setPlan((p) => ({ ...p, ...partial }));
  }, []);

  const addPlace = useCallback((place: Omit<PlanPlace, "id">) => {
    setPlan((p) => {
      const id = placeKey(place.city, place.name);
      if (p.items.some((i) => i.id === id)) return p;
      return { ...p, items: [...p.items, { ...place, id }] };
    });
  }, []);

  const removePlace = useCallback((id: string) => {
    setPlan((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));
  }, []);

  const movePlace = useCallback((id: string, day: number) => {
    setPlan((p) => ({ ...p, items: p.items.map((i) => (i.id === id ? { ...i, day } : i)) }));
  }, []);

  const reorderItems = useCallback((fromIndex: number, toIndex: number) => {
    setPlan((p) => {
      const items = [...p.items];
      const [moved] = items.splice(fromIndex, 1);
      if (moved) items.splice(toIndex, 0, moved);
      return { ...p, items };
    });
  }, []);

  // Reorders the plan to match `orderedIds` (e.g. an optimized route).
  const setOrder = useCallback((orderedIds: string[]) => {
    setPlan((p) => {
      const byId = new Map(p.items.map((i) => [i.id, i]));
      const ordered = orderedIds.map((id) => byId.get(id)).filter((i): i is PlanPlace => Boolean(i));
      const rest = p.items.filter((i) => !orderedIds.includes(i.id));
      return { ...p, items: [...ordered, ...rest] };
    });
  }, []);

  // Starts a fresh plan. A plan that was already saved stays in the account.
  const clear = useCallback(() => {
    cloudIdRef.current = undefined;
    lastSyncedRef.current = null;
    setLastSyncTime(null);
    setPlan(DEFAULT_PLAN);
  }, []);

  const loadPlan = useCallback((saved: SavedPlan) => {
    const items = Array.isArray(saved.items) ? saved.items : [];
    const days = Math.max(1, ...items.map((i) => Number(i.day) || 1));
    const next: TripPlan = { title: saved.title, days, items, cloudId: saved.id };
    cloudIdRef.current = saved.id;
    lastSyncedRef.current = JSON.stringify([next.title, next.days, next.items]);
    setLastSyncTime(null);
    setPlan(next);
  }, []);

  // Called after a saved plan is deleted so the local copy doesn't try to update a row that no longer exists.
  const forgetCloudPlan = useCallback((id: string) => {
    if (cloudIdRef.current !== id) return;
    cloudIdRef.current = undefined;
    lastSyncedRef.current = null;
    setPlan((p) => ({ ...p, cloudId: undefined }));
  }, []);

  const savePlan = useCallback(async () => {
    if (status === "loading") {
      addToast({ type: "info", title: "Checking your session, try again in a moment" });
      return false;
    }
    if (!userId) {
      addToast({ type: "info", title: "Sign in to save your plan", message: "Your plan is kept on this device until then." });
      return false;
    }
    setIsSyncing(true);
    try {
      await pushToCloud(plan);
      addToast({ type: "success", title: "Plan saved to your account" });
      return true;
    } catch {
      addToast({ type: "error", title: "Failed to save plan", message: "Please try again." });
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [status, userId, plan, pushToCloud, addToast]);

  const isInPlan = useCallback(
    (citySlug: string, name: string) => plan.items.some((i) => i.id === placeKey(citySlug, name)),
    [plan.items]
  );

  return useMemo(
    () => ({
      plan,
      isHydrated,
      isSyncing,
      lastSyncTime,
      setMeta,
      addPlace,
      removePlace,
      movePlace,
      reorderItems,
      setOrder,
      clear,
      loadPlan,
      forgetCloudPlan,
      savePlan,
      isInPlan,
    }),
    [plan, isHydrated, isSyncing, lastSyncTime, setMeta, addPlace, removePlace, movePlace, reorderItems, setOrder, clear, loadPlan, forgetCloudPlan, savePlan, isInPlan]
  );
}
