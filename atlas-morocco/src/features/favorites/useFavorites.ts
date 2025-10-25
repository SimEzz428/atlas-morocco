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
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { addToast } = useToast();

  // Load favorites from API
  const loadFavorites = useCallback(async () => {
    if (!session?.user?.id) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
        console.error("Failed to load favorites");
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Add favorite
  const addFavorite = useCallback(async (citySlug: string) => {
    if (!session?.user?.id) {
      addToast({ type: "error", title: "Please sign in to add favorites" });
      return false;
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ citySlug }),
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(prev => [...prev, data.favorite]);
        addToast({ type: "success", title: "City added to favorites!" });
        return true;
      } else {
        const error = await response.json();
        if (error.error === "City already favorited") {
          addToast({ type: "info", title: "City is already in your favorites" });
        } else {
          addToast({ type: "error", title: "Failed to add favorite" });
        }
        return false;
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
      addToast({ type: "error", title: "Failed to add favorite" });
      return false;
    }
  }, [session?.user?.id, addToast]);

  // Remove favorite
  const removeFavorite = useCallback(async (citySlug: string) => {
    if (!session?.user?.id) {
      addToast({ type: "error", title: "Please sign in to manage favorites" });
      return false;
    }

    try {
      const response = await fetch(`/api/favorites?citySlug=${citySlug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.citySlug !== citySlug));
        addToast({ type: "success", title: "City removed from favorites" });
        return true;
      } else {
        addToast({ type: "error", title: "Failed to remove favorite" });
        return false;
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      addToast({ type: "error", title: "Failed to remove favorite" });
      return false;
    }
  }, [session?.user?.id, addToast]);

  // Check if city is favorited
  const isFavorited = useCallback((citySlug: string) => {
    return favorites.some(fav => fav.citySlug === citySlug);
  }, [favorites]);

  // Load favorites on mount and when session changes
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorited,
    loadFavorites,
  };
}
