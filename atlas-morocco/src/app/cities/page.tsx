import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  ArrowRight, 
  Compass, 
  Globe 
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import CitySearch from "@/components/CitySearch";
import { absUrl } from "@/lib/abs-url";


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

async function getCityImage(cityName: string) {
  try {
    const response = await fetch(
      absUrl(`/api/unsplash?q=${encodeURIComponent(cityName)} morocco&per_page=1&w=600&h=400`),
      { next: { revalidate: 3600 } }
    );
    const data = await response.json();
    return data.images?.[0]?.src || null;
  } catch {
    return null;
  }
}


function getCityDescription(cityName: string) {
  const descriptions: Record<string, string> = {
    "marrakech": "The Red City with vibrant souks, stunning palaces, and the iconic Jemaa el-Fnaa square.",
    "casablanca": "Morocco's economic capital featuring the magnificent Hassan II Mosque and modern architecture.",
    "fes": "The cultural heart of Morocco with the world's oldest university and intricate medina.",
    "rabat": "The elegant capital city with royal palaces, ancient ruins, and coastal charm.",
    "agadir": "A modern beach resort city with golden sands, water sports, and Atlantic Ocean views.",
    "tangier": "The gateway between Europe and Africa with rich history and Mediterranean beauty.",
    "essaouira": "A charming coastal town known for its artistic heritage and beautiful beaches.",
    "chefchaouen": "The blue pearl of the Rif Mountains, famous for its stunning blue-washed buildings.",
    "meknes": "A historic imperial city with impressive monuments and traditional architecture.",
    "ouarzazate": "The gateway to the Sahara Desert and Hollywood of Morocco.",
  };
  
  return descriptions[cityName.toLowerCase()] || "A captivating Moroccan destination waiting to be explored.";
}


function getCityHighlights(cityName: string) {
  const highlights: Record<string, string[]> = {
    "marrakech": ["Jemaa el-Fnaa", "Bahia Palace", "Majorelle Garden"],
    "casablanca": ["Hassan II Mosque", "Corniche", "Old Medina"],
    "fes": ["Fes el-Bali", "Al Quaraouiyine", "Tanneries"],
    "rabat": ["Hassan Tower", "Kasbah", "Royal Palace"],
    "agadir": ["Agadir Beach", "Souk el-Had", "Kasbah"],
    "tangier": ["Medina", "Hercules Cave", "Cap Spartel"],
    "essaouira": ["Medina", "Beach", "Port"],
    "chefchaouen": ["Blue Streets", "Spanish Mosque", "Ras el-Maa"],
    "meknes": ["Bab Mansour", "Moulay Ismail Mausoleum", "Volubilis"],
    "ouarzazate": ["Atlas Studios", "Ait Benhaddou", "Taourirt Kasbah"],
  };
  
  return highlights[cityName.toLowerCase()] || ["Historic Sites", "Local Culture", "Authentic Experience"];
}

export default async function CitiesIndex() {
  const cities = await getCities();
  
  
  const citiesWithImages = await Promise.all(
    cities.map(async (city: any) => ({
      ...city,
      image: await getCityImage(city.name),
      description: getCityDescription(city.name),
      highlights: getCityHighlights(city.name),
    }))
  );

  return (
    <main className="min-h-screen">
      {/* Header */}
      <Section size="sm">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="h-6 w-6 text-amber-600" />
            <div className="inline-flex items-center gap-1 rounded-full border font-medium px-3 py-1 text-sm bg-amber-50 text-amber-700 border-amber-200">Explore Morocco</div>
          </div>
          <h1 className="h1 mb-4">Discover Amazing Cities</h1>
          <p className="lead">
            From ancient medinas to modern metropolises, explore Morocco's most captivating destinations. 
            Each city offers unique experiences, rich culture, and unforgettable memories.
          </p>
        </div>
      </Section>

      {/* Cities Search */}
      <Section size="lg">
        <CitySearch cities={citiesWithImages} />
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="card card-pad max-w-2xl mx-auto">
            <h2 className="h2 mb-4">Ready to Plan Your Morocco Adventure?</h2>
            <p className="lead mb-6">
              Start building your perfect itinerary with our intelligent trip planner. 
              Combine multiple cities and create unforgettable memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/plan" className="btn-primary btn-lg group">
                <Compass className="h-5 w-5" />
                Start Planning
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/" className="btn-secondary btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}