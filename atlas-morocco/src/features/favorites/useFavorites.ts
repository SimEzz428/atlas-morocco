"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ToastProvider";

export type Favorite = {
  id: string;
  userId: string;
  citySlug: string;
  createdAt: string;
};

export function useFavorites() {
  // Favorites are stored with the account they were loaded for, so signing out or switching
  // accounts never shows the previous account's list and "loading" can be derived.
  const [loaded, setLoaded] = useState<{ userId: string; favorites: Favorite[] } | null>(null);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const { addToast } = useToast();

  const favorites = useMemo(() => (userId && loaded?.userId === userId ? loaded.favorites : []), [userId, loaded]);
  const isLoading = status === "loading" || (Boolean(userId) && loaded?.userId !== userId);

  const setFavorites = useCallback(
    (update: (prev: Favorite[]) => Favorite[]) => {
      if (!userId) return;
      setLoaded((prev) => ({ userId, favorites: update(prev?.userId === userId ? prev.favorites : []) }));
    },
    [userId]
  );

  const fetchFavorites = useCallback(async (): Promise<Favorite[]> => {
    try {
      const response = await fetch("/api/favorites");
      return response.ok ? (await response.json()).favorites || [] : [];
    } catch {
      addToast({ type: "error", title: "Couldn't load your favorites" });
      return [];
    }
  }, [addToast]);

  const loadFavorites = useCallback(async () => {
    if (!userId) return;
    const list = await fetchFavorites();
    setLoaded({ userId, favorites: list });
  }, [userId, fetchFavorites]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchFavorites().then((list) => {
      if (!cancelled) setLoaded({ userId, favorites: list });
    });
    return () => {
      cancelled = true;
    };
  }, [userId, fetchFavorites]);

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
    [userId, setFavorites, addToast]
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
        setFavorites(() => previous);
        addToast({ type: "error", title: "Failed to remove favorite" });
        return false;
      }
    },
    [userId, favorites, setFavorites, addToast]
  );

  const toggleFavorite = useCallback(
    (citySlug: string) => (isFavorited(citySlug) ? removeFavorite(citySlug) : addFavorite(citySlug)),
    [isFavorited, addFavorite, removeFavorite]
  );

  return {
    favorites,
    isLoading,
    isReady: !isLoading,
    isSignedIn: Boolean(userId),
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
    loadFavorites,
  };
}
