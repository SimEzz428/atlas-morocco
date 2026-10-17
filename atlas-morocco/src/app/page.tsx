import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Calendar, Users, Globe, Compass } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getCity } from "@/data/cities";
import { getCityCover, unsplashImage } from "@/data/cityImages";

const FEATURED_SLUGS = ["marrakech", "fes", "essaouira", "casablanca", "chefchaouen", "rabat"];

const TAGLINES: Record<string, string> = {
  marrakech: "The Red City with vibrant souks",
  fes: "Cultural heart with ancient medina",
  essaouira: "Coastal charm and artistic vibes",
  casablanca: "Modern metropolis meets tradition",
  chefchaouen: "The blue pearl of the Rif",
  rabat: "Elegant capital with royal heritage",
};

export default function HomePage() {
  const cityImages = FEATURED_SLUGS.flatMap((slug) => {
    const city = getCity(slug);
    const cover = getCityCover(slug);
    if (!city || !cover) return [];
    return [{
      name: city.name,
      slug,
      description: TAGLINES[slug] ?? city.description,
      placeCount: city.places.length,
      image: unsplashImage(cover, 800, 533),
    }];
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1531230689007-0b32d7a7c33e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670"
            alt="Morocco landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 container-pro text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="h1 mb-6 text-white">Discover Morocco&apos;s Hidden Gems</h1>
            <p className="lead mb-8 text-white/90">
              Plan unforgettable journeys through Morocco&apos;s most enchanting cities.
              From the bustling souks of Marrakech to the blue streets of Chefchaouen,
              create memories that last a lifetime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore" className="btn btn-primary group">
                Start Exploring
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/plan" className="btn btn-secondary">
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cities */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="h2 mb-4">Featured Destinations</h2>
          <p className="lead text-slate-600">
            Explore Morocco&apos;s most captivating cities, each with its own unique charm and story.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cityImages.map((city) => (
            <Card key={city.slug} className="group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={city.image}
                  alt={`${city.name}, Morocco`}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{city.name}</h3>
                </div>
              </div>
              <div className="card-pad">
                <p className="text-slate-600 mb-1">{city.description}</p>
                <p className="caption mb-4">{city.placeCount} places to explore</p>
                <Link href={`/cities/${city.slug}`} className="btn btn-outline w-full group">
                  Explore {city.name}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section className="bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="h2 mb-4">Why Choose Atlas Morocco?</h2>
          <p className="lead text-slate-600">
            Your trusted companion for discovering the authentic beauty of Morocco.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Curated Locations</h3>
            <p className="text-slate-600">Handpicked destinations and hidden gems you won&apos;t find in typical guidebooks.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Planning</h3>
            <p className="text-slate-600">Route optimization orders your stops to cut travel time and splits them into days.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Practical Insights</h3>
            <p className="text-slate-600">Best times to visit, entry costs, etiquette and safety tips for every city, plus live weather and exchange rates.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cultural Immersion</h3>
            <p className="text-slate-600">Experience Morocco&apos;s rich culture, traditions, and warm hospitality.</p>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="text-center">
          <h2 className="h2 mb-4">Ready to Begin Your Moroccan Adventure?</h2>
          <p className="lead text-slate-600 mb-8">
            Pick the places you want to see, and Atlas Morocco turns them into a day-by-day route.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore" className="btn btn-primary group">
              <Compass className="mr-2 h-5 w-5" />
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/cities" className="btn btn-outline">
              Browse All Cities
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}