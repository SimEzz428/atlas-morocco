import type { Metadata } from "next";
import ExploreMap from "@/features/explorer/components/ExploreMap";
import { CITIES } from "@/data/cities";

export const metadata: Metadata = {
  title: "Map",
  description: "See Morocco's cities on a map and jump straight into each city guide.",
};

export default function ExplorePage() {
  const cities = CITIES.map(({ slug, name, lat, lon, description, places }) => ({
    slug,
    name,
    lat,
    lon,
    description,
    placeCount: places.length,
  }));

  return (
    <div className="w-full h-[calc(100vh-64px)] min-h-[480px]">
      <ExploreMap cities={cities} />
    </div>
  );
}
