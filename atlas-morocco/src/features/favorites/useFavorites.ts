"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ToastProvider";

export type Favorite = {
  id: string;
  userId: string;
  citySlug: string;
  createdAt: string;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const { addToast } = useToast();

  const loadFavorites = useCallback(async () => {
    if (!userId) {
      setFavorites([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch {
      addToast({ type: "error", title: "Couldn't load your favorites" });
    } finally {
      setIsLoading(false);
    }
  }, [userId, addToast]);

  useEffect(() => {
    if (status === "loading") return;
    if (!userId) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }
    loadFavorites();
  }, [status, userId, loadFavorites]);

  const isFavorited = useCallback((citySlug: string) => favorites.some((fav) => fav.citySlug === citySlug), [favorites]);

  const addFavorite = useCallback(
    async (citySlug: string) => {
      if (!userId) {
        addToast({ type: "info", title: "Sign in to save favorite cities" });
        return false;
      }
      const optimistic: Favorite = { id: `pending-${citySlug}`, userId, citySlug, createdAt: new Date().toISOString() };
      setFavorites((prev) => (prev.some((f) => f.citySlug === citySlug) ? prev : [optimistic, ...prev]));
      try {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ citySlug }),
        });
        if (!response.ok) throw new Error("Failed to add favorite");
        const { favorite } = (await response.json()) as { favorite: Favorite };
        setFavorites((prev) => prev.map((f) => (f.citySlug === citySlug ? favorite : f)));
        addToast({ type: "success", title: "Added to favorites", duration: 2500 });
        return true;
      } catch {
        setFavorites((prev) => prev.filter((f) => f.id !== optimistic.id));
        addToast({ type: "error", title: "Failed to add favorite" });
        return false;
      }
    },
    [userId, addToast]
  );

  const removeFavorite = useCallback(
    async (citySlug: string) => {
      if (!userId) {
        addToast({ type: "info", title: "Sign in to manage favorites" });
        return false;
      }
      const previous = favorites;
      setFavorites((prev) => prev.filter((f) => f.citySlug !== citySlug));
      try {
        const response = await fetch(`/api/favorites?citySlug=${encodeURIComponent(citySlug)}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to remove favorite");
        addToast({ type: "success", title: "Removed from favorites", duration: 2500 });
        return true;
      } catch {
        setFavorites(previous);
        addToast({ type: "error", title: "Failed to remove favorite" });
        return false;
      }
    },
    [userId, favorites, addToast]
  );

  const toggleFavorite = useCallback(
    (citySlug: string) => (isFavorited(citySlug) ? removeFavorite(citySlug) : addFavorite(citySlug)),
    [isFavorited, addFavorite, removeFavorite]
  );

  return {
    favorites,
    isLoading: status === "loading" || isLoading,
    isReady: status !== "loading" && !isLoading,
    isSignedIn: Boolean(userId),
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
    loadFavorites,
  };
}
