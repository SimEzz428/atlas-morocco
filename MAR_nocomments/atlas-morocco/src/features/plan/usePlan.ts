// Persistent client-side store for a simple trip plan with automatic cloud sync
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ToastProvider";

export type PlanPlace = {
  id: string;         // `${citySlug}:${name}`
  name: string;
  city: string;       // city slug
  day: number;        // 1..N
  lat: number;
  lon: number;
  note?: string;
  category: string;   // place category for icon display
};

export type TripPlan = {
  title: string;
  startDate?: string; // ISO
  days: number;
  items: PlanPlace[];
};

const STORAGE_KEY = "atlas.plan.v1";

const DEFAULT_PLAN: TripPlan = {
  title: "My Morocco Trip",
  days: 3,
  items: [],
};

export function usePlan() {
  const [plan, setPlan] = useState<TripPlan>(DEFAULT_PLAN);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session, status } = useSession();
  const { addToast } = useToast();

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cloud sync function
  const syncToCloud = useCallback(async (planData: TripPlan) => {
    if (!session?.user?.id) return; // Only sync if user is authenticated
    
    setIsSyncing(true);
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: planData.title,
          items: planData.items,
          citySlug: planData.items[0]?.city || null, // Use first item's city as primary city
        }),
      });

      if (response.ok) {
        setLastSyncTime(new Date());
        addToast({
          type: 'success',
          title: 'Plan Synced',
          message: 'Your trip plan has been saved to the cloud',
          duration: 3000
        });
      } else {
        throw new Error('Failed to sync to cloud');
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Sync Failed',
        message: 'Could not sync your plan to the cloud. Your changes are saved locally.',
        duration: 5000
      });
    } finally {
      setIsSyncing(false);
    }
  }, [session?.user?.id]);

  // hydrate from localStorage (only on client side)
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsedPlan = JSON.parse(raw);
        setPlan(parsedPlan);
      }
      setIsHydrated(true);
    } catch (error) {
      console.error('Failed to load plan from localStorage:', error);
      setIsHydrated(true);
    }
  }, [isClient]);

  // persist to localStorage and sync to cloud (only on client side)
  useEffect(() => {
    if (!isClient || !isHydrated) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      
      // Auto-sync to cloud when plan changes (with debounce)
      const timeoutId = setTimeout(() => {
        syncToCloud(plan);
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Error persisting plan to localStorage:', error);
    }
  }, [plan, syncToCloud, isClient, isHydrated]);

  const actions = useMemo(() => {
    return {
      setMeta(partial: Partial<Omit<TripPlan, "items">>) {
        setPlan((p) => ({ ...p, ...partial }));
      },
      addPlace(place: Omit<PlanPlace, "id">) {
        console.log('usePlan addPlace called with:', place);
        setPlan((p) => {
          const id = `${place.city}:${place.name}`;
          if (p.items.some((i) => i.id === id)) {
            console.log('Place already exists in plan:', id);
            return p;
          }
          const newPlan = { ...p, items: [...p.items, { ...place, id }] };
          console.log('New plan state:', newPlan);
          return newPlan;
        });
      },
      removePlace(id: string) {
        setPlan((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));
      },
      movePlace(id: string, day: number) {
        setPlan((p) => ({
          ...p,
          items: p.items.map((i) => (i.id === id ? { ...i, day } : i)),
        }));
      },
      reorderItems(fromIndex: number, toIndex: number) {
        setPlan((p) => {
          const newItems = [...p.items];
          const [movedItem] = newItems.splice(fromIndex, 1);
          if (movedItem) {
            newItems.splice(toIndex, 0, movedItem);
          }
          return { ...p, items: newItems };
        });
      },
      clear() {
        setPlan(DEFAULT_PLAN);
      },
      async savePlan(title?: string, citySlug?: string) {
        // Wait for session to load if it's still loading
        if (status === "loading") {
          addToast({ type: "error", title: "Please wait, session is loading..." });
          return false;
        }
        
        if (!session?.user?.id) {
          addToast({ type: "error", title: "Please sign in to save your plan" });
          return false;
        }

        try {
          const planToSave = {
            title: title || plan.title,
            citySlug: citySlug || null,
            items: plan.items,
          };

          const response = await fetch("/api/plan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(planToSave),
          });

          if (response.ok) {
            const data = await response.json();
            addToast({ type: "success", title: "Plan saved successfully!" });
            return data.tripPlan;
          } else {
            addToast({ type: "error", title: "Failed to save plan" });
            return false;
          }
        } catch (error) {
          console.error("Error saving plan:", error);
          addToast({ type: "error", title: "Failed to save plan" });
          return false;
        }
      },
    };
  }, []);

  return { 
    plan, 
    isSyncing, 
    lastSyncTime,
    ...actions 
  };
}