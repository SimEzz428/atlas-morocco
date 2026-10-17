import type { Metadata } from "next";
import Link from "next/link";
import { Map as MapIcon } from "lucide-react";
import CitySearch from "@/components/CitySearch";
import { PageHeader } from "@/components/ui/PageHeader";
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
      image: cover ? unsplashImage(cover, 800, 600) : undefined,
    };
  });

  return (
    <div className="container-pro py-10 sm:py-14">
      <PageHeader
        eyebrow="Explore Morocco"
        title="Discover amazing cities"
        description="From ancient medinas to Atlantic ports and desert kasbahs. Open a city to see its places, itineraries and live local info."
        actions={
          <Link href="/explore" className="btn-secondary">
            <MapIcon className="h-4 w-4" />
            View on map
          </Link>
        }
      />
      <div className="mt-8">
        <CitySearch cities={cities} />
      </div>
    </div>
  );
}
