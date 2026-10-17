'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, LogIn, Compass, ArrowRight } from 'lucide-react';
import { useFavorites } from '@/features/favorites/useFavorites';
import { getCity } from '@/data/cities';
import { getCityCover, unsplashImage } from '@/data/cityImages';

function EmptyState({ icon: Icon, title, body, children }: { icon: typeof Heart; title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="pattern-zellige bg-sand-100 px-6 py-16 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Icon className="h-7 w-7 text-brand-600" />
        </span>
        <h2 className="h3 mt-5">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-stone-600">{body}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">{children}</div>
      </div>
    </div>
  );
}

export function FavoritesList() {
  const { favorites, isLoading, isSignedIn, removeFavorite } = useFavorites();

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-stone-200" />
        ))}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <EmptyState icon={LogIn} title="Sign in to see your favorites" body="Tap Save on any city page to keep it here. Favorites are stored in your account.">
        <Link href="/auth/signin?callbackUrl=%2Ffavorites" className="btn-primary">
          <LogIn className="h-4 w-4" />
          Sign In
        </Link>
        <Link href="/cities" className="btn-secondary">
          <Compass className="h-4 w-4" />
          Explore Cities
        </Link>
      </EmptyState>
    );
  }

  const favoriteCities = favorites.flatMap((fav) => {
    const city = getCity(fav.citySlug);
    return city ? [{ favorite: fav, city }] : [];
  });

  if (favoriteCities.length === 0) {
    return (
      <EmptyState icon={Heart} title="No Favorite Cities Yet" body="Tap Save at the top of a city's page to add it to your favorites.">
        <Link href="/cities" className="btn-primary">
          <Compass className="h-4 w-4" />
          Explore Cities
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {favoriteCities.map(({ favorite, city }) => {
        const cover = getCityCover(city.slug);
        return (
          <article key={favorite.citySlug} className="card group flex flex-col overflow-hidden" data-testid="favorite-card">
            <div className="relative aspect-[16/9] bg-sand-200">
              {cover && (
                <Image src={unsplashImage(cover, 700, 394)} alt={`${city.name}, Morocco`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
              )}
              <button
                onClick={() => removeFavorite(favorite.citySlug)}
                className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-red-500 shadow-sm transition-colors hover:bg-white hover:text-red-600"
                aria-label={`Remove ${city.name} from favorites`}
                title="Remove from favorites"
              >
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="h4">{city.name}</h3>
              <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-600">{city.description}</p>
              <Link href={`/cities/${city.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
                Explore {city.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
