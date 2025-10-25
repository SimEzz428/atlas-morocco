// src/app/cities/[id]/page.tsx
import { notFound } from "next/navigation";
import CityScreen from "@/features/cities/components/CityScreen";
import { CITIES } from "@/server/db";

type Params = Promise<{ id: string }>;

// Fetch city data - use comprehensive data from db.ts
async function getCityData(slug: string) {
  // Find city in comprehensive data
  const city = CITIES.find(c => c.slug === slug);
  
  if (city) {
    return {
      city: city, // Return the complete city object
      places: city.places,
      itineraries: city.itineraries
    };
  }
  
  return null;
}

export default async function CityPage({ params }: { params: Params }) {
  const { id } = await params;
  const slug = id.toLowerCase();
  
  const cityData = await getCityData(slug);
  
  if (!cityData || !cityData.city) {
    return notFound();
  }

  return <CityScreen city={cityData.city} pois={cityData.places || []} loading={false} />;
}