import { NextResponse } from "next/server"

async function getCities() {
  return [
    { id: 'marrakech', slug: 'marrakech', name: 'Marrakech', lat: 31.6295, lon: -7.9811 },
    { id: 'fes', slug: 'fes', name: 'Fès', lat: 34.0331, lon: -5.0003 },
    { id: 'casablanca', slug: 'casablanca', name: 'Casablanca', lat: 33.5731, lon: -7.5898 },
    { id: 'rabat', slug: 'rabat', name: 'Rabat', lat: 34.0209, lon: -6.8416 },
    { id: 'essaouira', slug: 'essaouira', name: 'Essaouira', lat: 31.5085, lon: -9.7595 },
    { id: 'chefchaouen', slug: 'chefchaouen', name: 'Chefchaouen', lat: 35.1714, lon: -5.2696 },
    { id: 'tangier', slug: 'tangier', name: 'Tangier', lat: 35.7595, lon: -5.8340 },
    { id: 'agadir', slug: 'agadir', name: 'Agadir', lat: 30.4278, lon: -9.5981 },
    { id: 'meknes', slug: 'meknes', name: 'Meknes', lat: 33.8935, lon: -5.5473 },
    { id: 'ouarzazate', slug: 'ouarzazate', name: 'Ouarzazate', lat: 30.9333, lon: -6.9167 }
  ];
}

export async function GET() {
  try {
    const cities = await getCities();
    return NextResponse.json({ cities });
  } catch (error) {
    console.error("Cities API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}