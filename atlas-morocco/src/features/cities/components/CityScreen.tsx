import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight, Compass, ChevronLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import type { City } from "@/data/cities";
import { getCityCover, getCityPhotos, unsplashImage } from "@/data/cityImages";
import { CityTabContent } from "@/components/CityTabContent";

export default function CityScreen({ city }: { city: City }) {
  const { name, slug, places } = city;
  const cover = getCityCover(slug);
  const photos = getCityPhotos(slug);
  const suggestedDays = city.itineraries.length > 0 ? Math.max(...city.itineraries.map((it) => it.duration)) : 2;

  return (
    <div className="min-h-screen">
      <section className="relative h-[26rem] overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200">
        {cover && (
          <Image
            src={unsplashImage(cover, 2000, 900)}
            alt={`${name}, Morocco`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

        <div className="container-pro relative z-10 h-full flex flex-col justify-between py-6">
          <Link href="/cities" className="inline-flex w-fit items-center gap-1 text-sm text-white/90 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            All cities
          </Link>
          <div className="max-w-4xl pb-2">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-white" />
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-white/20 text-white border-white/30">
                Morocco
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{name}</h1>
            <p className="text-white/90 text-lg mb-5 max-w-2xl">{city.description}</p>
            <div className="flex items-center gap-6 text-white/85 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {suggestedDays === 1 ? "1 day" : `1-${suggestedDays} days`}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {places.length} places
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-pro py-8 sm:py-10">
        <CityTabContent city={city} photos={photos} />
      </div>

      <Section background="gradient" size="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="h2 mb-4 text-slate-900">Ready to Explore {name}?</h2>
          <p className="lead mb-8 text-slate-700">
            Add places to your trip plan and the planner will turn them into a day-by-day route.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan" className="btn-primary btn-lg group">
              <Compass className="h-5 w-5" />
              Open My Plan
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/cities" className="btn-secondary btn-lg">
              <MapPin className="h-5 w-5" />
              Explore More Cities
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
