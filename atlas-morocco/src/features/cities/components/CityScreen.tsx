// import SmartSuggestions from "@/components/SmartSuggestions";
// import { FavoritesManager } from "@/components/FavoritesManager";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Check, 
  ArrowRight,
  Compass,
  Camera,
  Heart,
  Share2,
  Navigation,
  DollarSign,
  Thermometer,
  Cloud,
  Wind,
  Eye,
  Globe,
  Building,
  Mountain,
  Coffee,
  ShoppingBag,
  UtensilsCrossed,
  Clock
} from "lucide-react";
import { getAttractionsForCity } from "@/data/attractions";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { City } from "@/server/db";
import { CityTabContent } from "@/components/CityTabContent";

type Place = {
  id: string;
  name: string;
  category: string;
  description: string;
  lat: number;
  lon: number;
  visitTime: number;
  bestTime: "morning" | "afternoon" | "evening" | "anytime";
  cost: string;
  accessibility: string;
  tags: string[];
  blurb?: string;
};

// Simplified Gallery Grid Component - No HMR issues
function GalleryGrid({ cityName }: { cityName: string }) {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop'
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {fallbackImages.map((img, i) => (
        <div key={i} className="relative h-48 rounded-xl overflow-hidden">
          {i === 0 ? (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <MapPin className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold opacity-95">{cityName}</p>
              <p className="text-xs opacity-80 mt-1">Morocco</p>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <img
                src={img}
                alt={`${cityName} photo ${i}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

async function getCityHeroImage(cityName: string) {
  // Get a high-quality hero image for the city via Unsplash
  try {
    // Use more specific search terms for better city representation
    let searchQuery = cityName + ' morocco';

    // Add specific landmarks for better results
    if (cityName === 'Casablanca') {
      searchQuery = 'Casablanca Hassan II Mosque morocco';
    } else if (cityName === 'Marrakech') {
      searchQuery = 'Marrakech Jemaa el-Fnaa morocco';
    } else if (cityName === 'Fes') {
      searchQuery = 'Fes medina morocco';
    } else if (cityName === 'Chefchaouen') {
      searchQuery = 'Chefchaouen blue houses morocco';
    } else if (cityName === 'Rabat') {
      searchQuery = 'Rabat Hassan Tower morocco';
    } else if (cityName === 'Essaouira') {
      searchQuery = 'Essaouira port morocco';
    } else if (cityName === 'Agadir') {
      searchQuery = 'Agadir Morocco beach resort';
    } else if (cityName === 'Tangier') {
      searchQuery = 'Tangier Morocco city';
    } else if (cityName === 'Meknes') {
      searchQuery = 'Meknes Bab Mansour morocco';
    } else if (cityName === 'Ouarzazate') {
      searchQuery = 'Ouarzazate Morocco kasbah';
    }

    const key = process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    let imageUrl: string | null = null;
    if (key) {
      const api = new URL("https://api.unsplash.com/search/photos");
      api.searchParams.set("client_id", key);
      api.searchParams.set("query", searchQuery);
      api.searchParams.set("per_page", "1");
      api.searchParams.set("content_filter", "high");
      api.searchParams.set("orientation", "landscape");
      const r = await fetch(api, { cache: "no-store" });
      const j = await r.json();
      const base = j?.results?.[0]?.urls?.regular || j?.results?.[0]?.urls?.full || null;
      if (base) {
        const u = new URL(base);
        u.searchParams.set("w", "2560");
        u.searchParams.set("h", "1440");
        u.searchParams.set("fit", "crop");
        u.searchParams.set("q", "80");
        imageUrl = u.toString();
      }
    }
    if (!imageUrl) {
      imageUrl = `https://source.unsplash.com/2560x1440/?${encodeURIComponent(searchQuery)}`;
    }
    console.log(`Getting hero image for ${cityName}:`, imageUrl ? 'Found' : 'Not found');
    return imageUrl;
  } catch (error) {
    console.error(`Error fetching image for ${cityName}:`, error);
    return null;
  }
}

interface Props {
  city: City & {
    bestTimeToVisit: string;
    etiquetteTips: string[];
    safetyTips: string[];
    itineraries?: Array<{
      title: string;
      description: string;
      duration: number;
      places: string[];
    }>;
  };
  pois: Place[];
  loading?: boolean;
}

export default async function CityScreen({ city, pois, loading }: Props) {
  const { name, lat, lon, slug } = city;

  // Fetch hero image for the city
  const heroImage = await getCityHeroImage(name);
  console.log(`CityScreen: Hero image for ${name}:`, heroImage ? 'Found' : 'Not found');

  // Get attractions from the attractions data instead of using pois
  const attractions = getAttractionsForCity(slug);

  // Static categories calculation - no useMemo
  const categories = (() => {
    const counts: Record<string, number> = {};
    attractions.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  })();

  const getCityDescription = (cityName: string) => {
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
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        {heroImage ? (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={`${name}, Morocco`}
              className="w-full h-full object-cover"
              style={{
                imageRendering: '-webkit-optimize-contrast'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-200">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        )}

        <div className="container-pro relative z-10 h-full flex items-end pb-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-white" />
              <div className="inline-flex items-center gap-1 rounded-full border font-medium px-3 py-1 text-sm bg-white/20 text-white border-white/30">
                Morocco
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{name}</h1>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">{getCityDescription(name)}</p>
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">2-3 days</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">{attractions.length} attractions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation and Content */}
      <CityTabContent
        city={city}
        pois={pois}
        attractions={attractions}
        categories={categories}
      />

      {/* Final CTA */}
      <Section background="gradient" size="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="h2 mb-4 text-slate-900">Ready to Explore {name}?</h2>
          <p className="lead mb-8 text-slate-700">
            Add attractions to your trip plan and create the perfect itinerary for your Morocco adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan" className="btn-primary btn-lg group">
              <Compass className="h-5 w-5" />
              Plan Your Trip
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/cities" className="btn-secondary btn-lg">
              <MapPin className="h-5 w-5" />
              Explore More Cities
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}