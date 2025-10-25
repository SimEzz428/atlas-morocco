import { NextResponse } from "next/server";
import { getAttractionsForCity } from "@/data/attractions";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Get attractions for the city
    const places = getAttractionsForCity(slug);
    
    if (!places || places.length === 0) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }
    
    // Return city data in the expected format
    return NextResponse.json({
      city: {
        id: slug,
        slug: slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        lat: places[0]?.lat || 0,
        lon: places[0]?.lon || 0,
        description: `Discover the best places to visit in ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
        bestTimeToVisit: "Year-round destination",
        safetyTips: ["Be cautious in crowded areas", "Keep valuables secure"],
        etiquetteTips: ["Dress modestly", "Respect local customs"],
        neighborhoods: [],
        places: places,
        itineraries: [],
        practicalInfo: {
          gettingAround: "Walking and taxis",
          simWifi: "Tourist SIM cards available",
          currency: "Moroccan Dirham (MAD)",
          emergencyNumbers: ["Police: 19", "Medical: 15"]
        }
      },
      places: places.map(place => ({
        id: place.id,
        name: place.name,
        category: place.category,
        description: place.description,
        lat: place.lat,
        lon: place.lon,
        visitTime: place.visitTime,
        bestTime: place.bestTime,
        cost: place.cost,
        accessibility: place.accessibility,
        tags: place.tags,
        blurb: place.blurb,
        rating: place.rating,
        highlights: place.highlights,
        tips: place.tips
      })),
      categories: places.reduce((acc, place) => {
        acc[place.category] = (acc[place.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    });
  } catch (error) {
    console.error("City API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}