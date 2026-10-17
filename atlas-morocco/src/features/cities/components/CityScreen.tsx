import Link from "next/link";
import Image from "next/image";
import { MapPin, CalendarDays, ArrowRight, ChevronLeft, Plus } from "lucide-react";
import type { City } from "@/data/cities";
import { CITIES } from "@/data/cities";
import { getCityCover, getCityPhotos, unsplashImage } from "@/data/cityImages";
import { CityTabContent } from "@/components/CityTabContent";
import { FavoriteButton } from "@/components/FavoriteButton";

export default function CityScreen({ city }: { city: City }) {
  const { name, slug, places } = city;
  const cover = getCityCover(slug);
  const photos = getCityPhotos(slug);
  const suggestedDays = city.itineraries.length > 0 ? Math.max(...city.itineraries.map((it) => it.duration)) : 2;
  const nearby = CITIES.filter((c) => c.slug !== slug)
    .map((c) => ({ city: c, km: Math.hypot(c.lat - city.lat, (c.lon - city.lon) * Math.cos((city.lat * Math.PI) / 180)) * 111 }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 3);

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-stone-900">
        {cover && (
          <Image src={unsplashImage(cover, 2000, 1000)} alt={`${name}, Morocco`} fill priority sizes="100vw" className="-z-10 object-cover" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-stone-950/20" />

        <div className="container-pro flex min-h-[26rem] flex-col justify-between gap-10 py-5 sm:min-h-[30rem] sm:py-6">
          <nav aria-label="Breadcrumb">
            <Link href="/cities" className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm hover:text-white">
              <ChevronLeft className="h-4 w-4" />
              All cities
            </Link>
          </nav>

          <div className="pb-2">
            <p className="eyebrow text-brand-200">
              <MapPin className="h-3.5 w-3.5" />
              Morocco
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">{name}</h1>
            <p className="mt-3 line-clamp-3 max-w-2xl text-base text-white/90 sm:line-clamp-none sm:text-lg">{city.description}</p>

            <div className="mt-6 flex items-center gap-3">
              {/* Plain anchor: a hash-only change fires "hashchange", which switches the tab below. */}
              <a href="#places" className="btn-light flex-1 py-3 sm:flex-none sm:px-6 sm:text-base">
                <Plus className="h-5 w-5" />
                Add places to your trip
              </a>
              <FavoriteButton citySlug={slug} cityName={name} />
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {suggestedDays === 1 ? "1 day" : `1-${suggestedDays} days`} recommended
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {places.length} places
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-pro pb-16">
        <CityTabContent city={city} photos={photos} />
      </div>

      <section className="border-t border-stone-200/80 bg-white">
        <div className="section">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <p className="eyebrow">Keep exploring</p>
              <h2 className="h2 mt-2">Combine {name} with a nearby city</h2>
              <p className="mt-3 text-stone-600">Your plan can span several cities. The planner works out the route between them.</p>
            </div>
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:grid sm:flex-1 sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:max-w-2xl">
              {nearby.map(({ city: other, km }) => {
                const otherCover = getCityCover(other.slug);
                return (
                  <Link key={other.slug} href={`/cities/${other.slug}`} className="group relative aspect-[4/3] w-[62%] flex-none snap-start overflow-hidden rounded-2xl bg-stone-200 sm:w-auto">
                    {otherCover && (
                      <Image src={unsplashImage(otherCover, 500, 375)} alt={`${other.name}, Morocco`} fill sizes="(min-width:640px) 22vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-display text-lg font-bold text-white">{other.name}</h3>
                      <p className="inline-flex items-center gap-1 text-xs text-white/80">
                        ~{Math.round(km / 10) * 10} km away
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
