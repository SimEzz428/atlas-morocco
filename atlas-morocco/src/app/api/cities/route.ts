import { NextResponse } from "next/server"
import { CITIES } from "@/data/cities"

export async function GET() {
  const cities = CITIES.map(({ id, slug, name, lat, lon, description, places }) => ({
    id,
    slug,
    name,
    lat,
    lon,
    description,
    placeCount: places.length,
  }))
  return NextResponse.json({ cities })
}
