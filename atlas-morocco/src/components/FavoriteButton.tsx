"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/features/favorites/useFavorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({ citySlug, cityName }: { citySlug: string; cityName: string }) {
  const { isFavorited, toggleFavorite, isReady } = useFavorites();
  const active = isFavorited(citySlug);

  return (
    <button
      onClick={() => toggleFavorite(citySlug)}
      disabled={!isReady}
      aria-pressed={active}
      aria-label={active ? `Remove ${cityName} from favorites` : `Save ${cityName} to favorites`}
      data-testid="favorite-toggle"
      className={cn(
        "btn border py-3 backdrop-blur-sm sm:px-6 sm:text-base",
        active ? "border-white bg-white text-red-600 hover:bg-white/90" : "border-white/40 bg-white/10 text-white hover:bg-white/20"
      )}
    >
      <Heart className={cn("h-5 w-5", active && "fill-current")} />
      {active ? "Saved" : "Save"}
    </button>
  );
}
