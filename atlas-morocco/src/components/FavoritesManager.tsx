'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, LogIn } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useFavorites } from '@/features/favorites/useFavorites';
import { getCity } from '@/data/cities';
import { getCityCover, unsplashImage } from '@/data/cityImages';

export function FavoritesList() {
  const { favorites, isLoading, isSignedIn, removeFavorite } = useFavorites();

  if (isLoading) {
    return (
      <Card>
        <div className="card-pad">
          <div className="animate-pulse grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-56 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!isSignedIn) {
    return (
      <Card>
        <div className="card-pad text-center py-12">
          <LogIn className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to see your favorites</h2>
          <p className="text-slate-600 mb-6">
            Tap the heart on any city page to save it here. Favorites are stored in your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signin?callbackUrl=%2Ffavorites" className="btn-primary">
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
            <Link href="/cities" className="btn-secondary">
              <MapPin className="h-4 w-4" />
              Explore Cities
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  const favoriteCities = favorites.flatMap((fav) => {
    const city = getCity(fav.citySlug);
    return city ? [{ favorite: fav, city }] : [];
  });

  if (favoriteCities.length === 0) {
    return (
      <Card>
        <div className="card-pad text-center py-12">
          <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Favorite Cities Yet</h2>
          <p className="text-slate-600 mb-6">
            Tap the heart on a city&apos;s page to add it to your favorites.
          </p>
          <Link href="/cities" className="btn-primary">
            <MapPin className="h-4 w-4" />
            Explore Cities
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="card-pad">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-5 w-5 text-red-500" />
          <h2 className="h3">My Favorite Cities</h2>
          <Badge variant="accent" size="sm">
            {favoriteCities.length} {favoriteCities.length === 1 ? 'city' : 'cities'}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favoriteCities.map(({ favorite, city }) => {
            const cover = getCityCover(city.slug);
            return (
              <div key={favorite.citySlug} className="bg-slate-50 rounded-xl overflow-hidden" data-testid="favorite-card">
                <div className="relative h-32 bg-amber-100">
                  {cover && (
                    <Image src={unsplashImage(cover, 600, 260)} alt={`${city.name}, Morocco`} fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover" />
                  )}
                  <button
                    onClick={() => removeFavorite(favorite.citySlug)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-red-500 hover:bg-white"
                    aria-label={`Remove ${city.name} from favorites`}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-1">{city.name}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{city.description}</p>
                  <Link href={`/cities/${city.slug}`} className="btn-secondary btn-sm w-full">
                    <MapPin className="h-4 w-4" />
                    Explore {city.name}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
