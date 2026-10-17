import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Section } from "@/components/ui/Section";
import CitySearch from "@/components/CitySearch";
import { CITIES } from "@/data/cities";
import { getCityCover, unsplashImage } from "@/data/cityImages";

export const metadata: Metadata = {
  title: "Cities",
  description: "Explore Morocco's most captivating cities, from ancient medinas to Atlantic ports and desert kasbahs.",
};

export default function CitiesIndex() {
  const cities = CITIES.map((city) => {
    const cover = getCityCover(city.slug);
    return {
      slug: city.slug,
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      description: city.description,
      placeCount: city.places.length,
      image: cover ? unsplashImage(cover, 800, 533) : undefined,
    };
  });

  return (
    <div className="min-h-screen">
      <Section size="sm">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="h-6 w-6 text-amber-600" />
            <div className="inline-flex items-center gap-1 rounded-full border font-medium px-3 py-1 text-sm bg-amber-50 text-amber-700 border-amber-200">Explore Morocco</div>
          </div>
          <h1 className="h1 mb-4">Discover Amazing Cities</h1>
          <p className="lead">
            From ancient medinas to modern metropolises, explore Morocco&apos;s most captivating destinations.
            Each city offers unique experiences, rich culture, and unforgettable memories.
          </p>
        </div>
      </Section>

      <Section size="sm" className="pt-0 sm:pt-0">
        <CitySearch cities={cities} />

        <div className="mt-16 text-center">
          <div className="card card-pad max-w-2xl mx-auto">
            <h2 className="h2 mb-4">Ready to Plan Your Morocco Adventure?</h2>
            <p className="lead mb-6">
              Add places from any city to your trip, then let the planner order them into days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/plan" className="btn-primary btn-lg group">
                <Compass className="h-5 w-5" />
                Start Planning
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/explore" className="btn-secondary btn-lg">
                View on Map
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
